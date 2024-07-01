from django.urls import path, reverse_lazy
from django.contrib.auth import views as auth_views
from .views import (
    AdminGoodsListView,
    ShopGoodsPage,
    GoodsListView,
    TopGoodsListView,
    GoodVarClustersListView,
    SliderImagesListAPIView,
    GoodDetailPage,
    Blog,
    good_delete,
    add_discount,
    set_to_top,
    remove_discount,
    add_or_remove_good,
    parse_excel_view,
    block_from_price_update
)

urlpatterns = [
    path("admin-goods/", AdminGoodsListView.as_view(), name="admin-goods"),
    path("good-delete/<int:pk>/", good_delete, name="good-delete"),
    path("set-top/<int:pk>/<str:is_to_top>/", set_to_top, name="set-top"),
    path("good-add-discount/<int:pk>/", add_discount, name="good-add-discount"),
    path("good-add-or-remove/<int:pk>/", add_or_remove_good, name="good-add-or-remove"),
    path("good-remove-discount/<int:pk>/", remove_discount, name="remove-discount"),
    path("block_price_update/<int:pk>/", block_from_price_update, name="block-price-update"),
    path("", ShopGoodsPage.as_view(), name="shop-goods"),
    path("<int:pk>/", GoodDetailPage.as_view(), name="good-detail"),
    path("api/goods/", GoodsListView.as_view(), name="api-goods"),
    path("api/sliders/", SliderImagesListAPIView.as_view(), name="api-sliders"),
    path("api/top-goods/", TopGoodsListView.as_view(), name="api-goods"),
    path("api/types/", GoodVarClustersListView.as_view(), name="api-types"),
    path("blog/", Blog.as_view(), name="blog"),
    path('parse-excel/', parse_excel_view, name='parse_excel'),
]

app_name = "app_goods"
