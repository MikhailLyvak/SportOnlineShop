from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.db.models import Count, Prefetch, Sum
from rest_framework import filters, permissions
from django.db.models.query import QuerySet

from .serializers import GoodsListAdminSerializer, GoodVariantAdminDetailSerializer
from app_goods.models import GoodVariant, GoodVarPhoto


class GoodsListAdminListView(ListAPIView):
    serializer_class = GoodsListAdminSerializer
    permission_classes = (permissions.IsAdminUser,)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = "__all__"

    def get_queryset(self) -> QuerySet:
        queryset = GoodVariant.objects.all()

        queryset = queryset.prefetch_related(
            Prefetch("photos", queryset=GoodVarPhoto.objects.all())
        ).select_related("size", "taste")

        return queryset


class GoodDetailAdminView(RetrieveAPIView):
    serializer_class = GoodVariantAdminDetailSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self) -> QuerySet:
        queryset = GoodVariant.objects.all()

        queryset = queryset.prefetch_related(
            Prefetch("photos", queryset=GoodVarPhoto.objects.all())
        ).select_related("size", "taste")

        return queryset


