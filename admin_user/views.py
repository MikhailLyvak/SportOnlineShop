from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .forms import LoginForm
from django.contrib.auth.decorators import login_required
from utils.permissions import admin_login
from django.contrib.auth import logout
from django.conf import settings


def login_view(request):
    assets_root = settings.ASSETS_ROOT
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.get_authenticated_user()
            if user is not None:
                if user.is_active and user.is_superuser:
                    login(request, user)
                    return redirect("app_goods:admin-goods")
                else:
                    return redirect("admin_user:login")
    else:
        form = LoginForm()

    return render(
        request, "auth/login.html", {"form": form, "ASSETS_ROOT": assets_root}
    )


@admin_login
def profile_view(request):
    context = {"user": request.user}

    return render(request, "auth/profile.html", context=context)


@login_required
def logout_view(request):
    logout(request)
    return redirect("admin_user:login")


def no_permission_view(request):
    return render(request, "auth/no_permission.html")
