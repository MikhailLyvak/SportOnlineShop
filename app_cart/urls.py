from django.urls import path, reverse_lazy
from django.contrib.auth import views as auth_views
from .views import (
    AddToCartAPIView,
    CartItemListAPIView,
    DeleteCartItemView,
    CartDetailPage,
    ContactsPage,
    delete_cart_item,
    add_or_minus_item,
)

urlpatterns = [
    path("api/add_to_cart/", AddToCartAPIView.as_view(), name="add_to_cart"),
    path("api/cart_items/", CartItemListAPIView.as_view(), name="cart_items"),
    path("cart/", CartDetailPage.as_view(), name="cart-detail"),
    path("cintacts/", ContactsPage.as_view(), name="contacts"),
    path(
        "api/cart_items/<int:item_id>/delete",
        DeleteCartItemView.as_view(),
        name="delete_cart_item",
    ),
    path("cart_items/<int:pk>/delete", delete_cart_item, name="delete-cart-item"),
    path("cart_items/<int:pk>/<str:action>/", add_or_minus_item, name="action-cart-item"),
]

app_name = "app_cart"
