from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.settings import api_settings
from django.views.generic import TemplateView, DetailView
from django.shortcuts import render, redirect, reverse, get_object_or_404

from utils.cart_calc import calculate_result

from .models import Cart, CartItem
from .serializers import *
from app_goods.models import GoodVariant
from django.contrib.sessions.models import Session


class AddToCartAPIView(APIView):
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

    def post(self, request):
        variant_id = request.data.get("variant_id")

        if not request.session.session_key:
            request.session.save()
        session_key = request.session.session_key

        session = Session.objects.get(session_key=session_key)

        cart, created = Cart.objects.get_or_create(session=session)

        good_variant = GoodVariant.objects.get(id=variant_id)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, good_variant=good_variant
        )
        if not created:
            cart_item.amount += 1
            cart_item.save()

        return Response(
            {"message": "Item added to cart successfully"}, status=status.HTTP_200_OK
        )


class CartItemListAPIView(ListAPIView):
    serializer_class = CartSerializer

    def get_queryset(self):
        session_key = self.request.session.session_key

        queryset = Cart.objects.filter(session=session_key)

        return queryset


class DeleteCartItemView(APIView):
    def delete(self, request, item_id):
        try:
            item = CartItem.objects.get(id=item_id)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "CartItem not found"}, status=status.HTTP_404_NOT_FOUND
            )


class CartDetailPage(TemplateView):
    template_name = "app_cart/cart_detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        cart_items = (
            Cart.objects.get(session=self.request.session.session_key)
            .items.select_related(
                "good_variant",
                "good_variant__size",
                "good_variant__good__producer",
                "good_variant__taste",  
            ).prefetch_related("good_variant__photos")
            .order_by("create_date")
        )
        calc_result = calculate_result(cart_items)
        context["calc_result"] = calc_result
        context["cart_items"] = cart_items

        return context


def delete_cart_item(request, pk):
    item = get_object_or_404(CartItem, pk=pk)
    item.delete()
    return redirect(request.META.get("HTTP_REFERER"))


def add_or_minus_item(request, pk, action):
    item = get_object_or_404(CartItem, pk=pk)
    if action == "add":
        item.amount += 1
    elif action == "minus":
        item.amount -= 1
    item.save()
    return redirect(request.META.get("HTTP_REFERER"))


class ContactsPage(TemplateView):
    template_name = "app_cart/contacts.html"