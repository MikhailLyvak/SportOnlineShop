from django.urls import path, reverse_lazy
from django.contrib.auth import views as auth_views
from .views import GoodsListAdminListView, GoodDetailAdminView

urlpatterns = [
    path(
        "goods/",
        GoodsListAdminListView.as_view(),
        name="goods",
    ),
    path(
        "good/<int:pk>/",
        GoodDetailAdminView.as_view(),
        name="good-detail",
    ),
]

app_name = "app_admin_api"