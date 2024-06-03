from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models.query import QuerySet
from django.urls import reverse_lazy
from django.views import generic
from utils.permissions import admin_login
from rest_framework.views import APIView
from django_filters.views import FilterView
from django.views.generic import TemplateView, DetailView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.db.models import Prefetch, Q
from rest_framework.response import Response

from rest_framework import filters, permissions
from django.db.models.query import QuerySet
from django.contrib import messages

from .models import GoodVariant, GoodType, GoodVarPhoto, Size, Good
from .forms import NameSearchForm, GoodDiscountForm
from .filters import GoodVariantFilter
from .serializers import *
from .pagination import Pagination


class AdminGoodsListView(LoginRequiredMixin, FilterView):
    model = GoodVariant
    template_name = "app_goods/admin_goods_list.html"
    context_object_name = "goods_list"
    paginate_by = 7
    filterset_class = GoodVariantFilter

    def get_queryset(self) -> QuerySet:
        queryset = GoodVariant.objects.select_related(
            "size", "taste", "good"
        ).prefetch_related("photos").order_by("-amount")

        name = self.request.GET.get("name")
        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        name = self.request.GET.get("name", "")
        context["search_form"] = NameSearchForm(initial={"name": name})
        context["good_filter"] = self.filterset_class(
            self.request.GET, queryset=self.get_queryset()
        )
        context["add_discount_form"] = GoodDiscountForm()
        context["filter_amount"] = GoodType.objects.count()

        return context


@admin_login
def good_delete(request, pk):
    good = get_object_or_404(GoodVariant, pk=pk)
    good.delete()
    return redirect(request.META.get("HTTP_REFERER"))


@admin_login
def add_discount(request, pk):
    if request.method == "POST":
        form = GoodDiscountForm(request.POST)
        if form.is_valid():
            good = get_object_or_404(GoodVariant, pk=pk)
            good.on_discount = True
            good.discount_percentage = form.cleaned_data["discount_percentage"]
            good.discount_price = round(
                good.sell_price
                * (100 - form.cleaned_data["discount_percentage"])
                / 100,
                2,
            )
            good.save()
            messages.success(request, "Discount added successfully")

            return redirect(request.META.get("HTTP_REFERER"))
        else:
            messages.error(request, "Invalid form data")
            return redirect(request.META.get("HTTP_REFERER"))


@admin_login
def remove_discount(request, pk):
    good = get_object_or_404(GoodVariant, pk=pk)
    good.on_discount = False
    good.discount_percentage = 0
    good.discount_price = good.sell_price
    good.save()
    return redirect(request.META.get("HTTP_REFERER"))


@admin_login
def set_to_top(request, pk: int, is_to_top: str):
    good = get_object_or_404(GoodVariant, pk=pk)
    total_amount = GoodVariant.objects.filter(is_top=True).count()
    
    is_to_top = is_to_top.lower() == 'true'

    if not is_to_top:
        good.is_top = False
        good.save()
        messages.success(request, "Тепер ваш товар прибрано з топу!")
    elif total_amount < 6:
        good.is_top = True
        good.save()
        messages.success(request, "Тепер ваш товар в топі!")
    else:
        messages.error(request, "Може бути максимум 6 топ товарів!")

    return redirect(request.META.get("HTTP_REFERER"))


def add_or_remove_good(request, pk):
    good = get_object_or_404(GoodVariant, pk=pk)
    if good.amount > 0:
        good.amount = 0
    else:
        good.amount = 1
    good.save()
    return redirect(request.META.get("HTTP_REFERER"))


class ShopGoodsPage(TemplateView):
    template_name = "app_goods/shop_goods.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        top_goods = GoodVariant.objects.filter(is_top=True)[:6]
        context["top_goods"] = top_goods
        return context


class GoodsListView(ListAPIView):
    serializer_class = GoodsListSerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = "__all__"
    pagination_class = Pagination
    search_fields = [
        "name",
        "good__name",
        "good__producer__name",
        "good__good_type__name",
    ]

    def get_queryset(self):
        queryset = (
            GoodVariant.objects.filter(good__isnull=False, taste__isnull=False)
            .select_related("size", "taste", "good__good_type", "good__producer")
            .prefetch_related("photos").order_by("name")
        )

        good_type_name = self.request.query_params.get("good_type_name")
        if good_type_name:
            queryset = queryset.filter(good__good_type__name=good_type_name)
            
        aim_filter_name = self.request.query_params.get("aim_filter")
        if aim_filter_name:
            queryset = queryset.filter(good__aim_filter__db_name=aim_filter_name)

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["variants"] = list(
            self.get_queryset().values(
                "good_id", "taste_id", "size_id", "size__name", "amount", "id"
            )
        )
        return context


class TopGoodsListView(ListAPIView):
    serializer_class = GoodsListSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = (
            GoodVariant.objects.filter(is_top=True)
            .select_related("size", "taste", "good__good_type", "good__producer")
            .prefetch_related("photos").order_by("name")
        )[:6]

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["variants"] = list(
            self.get_queryset().values(
                "good_id", "taste_id", "size_id", "size__name", "amount", "id"
            )
        )
        return context

class GoodVarClustersListView(APIView):
    def get(self, request):
        producers = Producer.objects.all()
        aim_filters = AimFilters.objects.all()
        good_type_clusters = GoodTypeCluster.objects.prefetch_related('good_types').all()

        producer_serializer = ProducerSerializer(producers, many=True)
        aim_filters_serializer = AimFiltersSerializer(aim_filters, many=True)
        good_type_clusters_serializer = GoodTypeClusterSerializer(good_type_clusters, many=True)

        return Response({
            'producers': producer_serializer.data,
            'aim_filters': aim_filters_serializer.data,
            'good_type_clusters': good_type_clusters_serializer.data
        })


class GoodDetailPage(DetailView):
    model = GoodVariant
    template_name = "app_goods/good_detail.html"
    context_object_name = "good"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        good = Good.objects.filter(goodvariant=self.object).first()
        sizes = [(good_var.size.name, good_var.id) for good_var in good.goodvariant_set.all().order_by("size__name")]
        print(sizes)
        context["sizes"] = sizes
        return context
