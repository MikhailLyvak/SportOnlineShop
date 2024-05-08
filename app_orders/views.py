from django.db import transaction
from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.contrib.sessions.models import Session
from django.views.generic import DetailView, ListView
from rest_framework import viewsets, generics, permissions, status, mixins, views
from rest_framework.decorators import action
from rest_framework.response import Response
from utils.permissions import admin_login
from django.db.models.query import QuerySet
from django.db.models import Q
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from utils.wayforpay import MLPay, PaymentStatus

from utils.cart_calc import calculate_result
from .get_tele_bot import bot_notification

from .models import OrderFix, OrderItem
from .serializers import OrderSerializer, OrderStatusUpdateSerializer
from app_cart.models import Cart, CartItem
import os
import json


@transaction.atomic
def create_order(request):
    session_key = request.session.session_key

    cart = Cart.objects.filter(session=session_key).first()
    cart_items = CartItem.objects.filter(cart=cart)

    # Fetch or create a Session instance associated with the session key
    session_instance, _ = Session.objects.get_or_create(session_key=session_key)

    # Create the Order instance with the associated Session instance
    create_order = OrderFix.objects.create(session=session_key)

    for cart_item in cart_items:
        OrderItem.objects.create(
            order=create_order,
            good_variant=cart_item.good_variant,
            amount=cart_item.amount,
        )
        cart_item.delete()

    return redirect("app_orders:order-detail-view", pk=create_order.pk)


class OrderDetail(DetailView):
    model = OrderFix
    template_name = "app_orders/order_detail.html"
    context_object_name = "order"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        order_items = (
            OrderFix.objects.filter(session=self.request.session.session_key)
            .last()
            .items.select_related(
                "good_variant",
                "good_variant__size",
                "good_variant__good__producer",
                "good_variant__taste",
            )
            .prefetch_related("good_variant__photos")
            .order_by("create_date")
        )
        calc_result = calculate_result(order_items)
        context["calc_result"] = calc_result
        context["order_items"] = order_items
        context["NP_API_KEY"] = os.environ.get("NP_API_KEY", "")

        return context


class OrderViewSet(mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = OrderFix.objects.all()
    serializer_class = OrderSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.save()

        products = [
            f"Оплата замовлення №{instance.pk}",
        ]
        prices = [
            int(round(float(instance.total_clear_price), 0)),
        ]  # returns error that its not correct
        print(prices)
        # prices = [1,] # working correct
        counts = [
            1,
        ]
        client_email = instance.user_email

        payment_request = MLPay(
            product_name=products,
            product_price=prices,
            product_count=counts,
            client_email=client_email,
        )

        wayforpay_response = payment_request.make_wayforpay_request()
        redirect_url = wayforpay_response.get("invoiceUrl")

        instance.order_reference = payment_request.get_order_reference()
        instance.payment_url = redirect_url
        instance.save()
        
        if instance.payment_type == "CP":
            bot_notification(instance.total_clear_price, instance.pk, "Оплата при отриманні", instance.user_phone, instance.user_fio)


        return Response({"redirect_url": redirect_url}, status=status.HTTP_200_OK)


@csrf_exempt
def check_payment_status(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            order_reference = data.get("order_reference")
            if order_reference:
                payment_status_checker = PaymentStatus(order_reference)
                payment_status_response = (
                    payment_status_checker.make_wayforpay_request()
                )
                return JsonResponse(payment_status_response)
            else:
                return JsonResponse(
                    {"error": "OrderFix reference is required"}, status=400
                )
        except OrderFix.DoesNotExist:
            return JsonResponse({"error": "Order not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)


class OrderStatusUpdateAPIView(views.APIView):
    def post(self, request):
        serializer = OrderStatusUpdateSerializer(data=request.data)
        if serializer.is_valid():
            order_pk = serializer.validated_data["order_pk"]
            status_value = serializer.validated_data["status"]
            try:
                order = OrderFix.objects.get(pk=order_pk)
                # Update invoice_status based on the provided status
                if status_value == "PAYED":
                    order.invoice_status = "PAYED"
                    bot_notification(order.total_clear_price, order.pk, "Оплачено онлайн", order.user_phone, order.user_fio)
                elif status_value == "TIMEOUT":
                    order.invoice_status = "TIMEOUT"
                order.save()
                # Return updated order status in response
                return Response(
                    {
                        "message": "Invoice status updated successfully.",
                        "order_status": order.invoice_status,
                    },
                    status=status.HTTP_200_OK,
                )
            except OrderFix.DoesNotExist:
                return Response(
                    {"error": "Order does not exist."}, status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminOrdersListView(LoginRequiredMixin, ListView):
    model = OrderFix
    template_name = "app_orders/admin_orders_list.html"
    context_object_name = "orders_list"
    paginate_by = 9

    def get_queryset(self) -> QuerySet:
        queryset = OrderFix.objects.exclude(
            Q(payment_type="OP") & ~Q(invoice_status="PAYED")
        ).exclude(invoice_status="CREATED").prefetch_related("items").order_by("is_delivered", "-create_date")
        
        order_pk = self.request.GET.get("pk")
        if order_pk:
            queryset = queryset.filter(pk=order_pk)


        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context["order_filter"] = self.filterset_class(
        #     self.request.GET, queryset=self.get_queryset()
        # )

        return context


@admin_login
def approve_order(request, pk):
    order = OrderFix.objects.get(pk=pk)
    order.is_delivered = True
    order.save()
    
    return redirect(request.META.get("HTTP_REFERER"))
