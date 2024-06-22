from django.urls import path, reverse_lazy
from django.contrib.auth import views as auth_views
from .views import login_view, profile_view, no_permission_view, logout_view

urlpatterns = [
    path("login/", login_view, name="login"),
    path("profile_view/", profile_view, name="profile_view"),
    path("no_permission/", no_permission_view, name="no_permission"),
    path("logout/", logout_view, name="logout"),
]

app_name = "admin_user"