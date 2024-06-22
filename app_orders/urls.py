from django.urls import path, reverse_lazy, include
from rest_framework.routers import DefaultRouter
from django.contrib.auth import views as auth_views

from .views import *

router = DefaultRouter()
router.register(r'orders', OrderViewSet)


urlpatterns = [
    path("order-detail/<int:pk>", OrderDetail.as_view(), name="order-detail-view"),
    path("order-admin-list/", AdminOrdersListView.as_view(), name="order-admin-list"),
    path("create-order/", create_order, name="create-order"),
    path('api/', include(router.urls)),
    path('check-payment-status/', check_payment_status, name='check_payment_status'),
    path('update_order_status/', OrderStatusUpdateAPIView.as_view(), name='update_order_status'),
    path('approve_order/<int:pk>/', approve_order, name='approve-order'),
]

app_name = "app_orders"