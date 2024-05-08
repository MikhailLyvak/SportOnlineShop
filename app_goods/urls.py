from django.urls import path, reverse_lazy
from django.contrib.auth import views as auth_views
from .views import (
    AdminGoodsListView,
    ShopGoodsPage,
    GoodsListView,
    GoodVarClustersListView,
    GoodDetailPage,
    good_delete,
    add_discount,
    remove_discount,
    add_or_remove_good
)

urlpatterns = [
    path("admin-goods/", AdminGoodsListView.as_view(), name="admin-goods"),
    path("good-delete/<int:pk>/", good_delete, name="good-delete"),
    path("good-add-discount/<int:pk>/", add_discount, name="good-add-discount"),
    path("good-add-or-remove/<int:pk>/", add_or_remove_good, name="good-add-or-remove"),
    path("good-remove-discount/<int:pk>/", remove_discount, name="remove-discount"),
    path("", ShopGoodsPage.as_view(), name="shop-goods"),
    path("<int:pk>/", GoodDetailPage.as_view(), name="good-detail"),
    path("api/goods/", GoodsListView.as_view(), name="api-goods"),
    path("api/types/", GoodVarClustersListView.as_view(), name="api-types"),
]

app_name = "app_goods"
