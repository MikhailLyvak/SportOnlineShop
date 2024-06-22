from django import forms
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError

from .models import CustomUser
from django.contrib.auth.forms import SetPasswordForm

UserModel = get_user_model()


class LoginForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                "class": "form-control",
                "id": "emailfloatingInput",
                "placeholder": "Enter your email",
            }
        )
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "id": "passwordfloatingInput",
                "placeholder": "Enter your password",
            }
        )
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        password = cleaned_data.get("password")

        if email and password:
            users = CustomUser.objects.all().values_list("email", flat=True)
            user = authenticate(email=email, password=password)
            if email not in users:
                raise ValidationError("Введений Вами логін (емейл) не зареєстрований в системі!")
            if user is None or not user.is_active:
                raise ValidationError("Введний Вами парольне не вірний!")
            if not user.is_superuser:
                raise ValidationError("Адмін панель доступна тільки для адміністраторів!")

        return cleaned_data

    def get_authenticated_user(self):
        email = self.cleaned_data.get("email")
        return authenticate(email=email, password=self.cleaned_data.get("password"))


class CustomSetPasswordForm(SetPasswordForm):
    def __init__(self, user, *args, **kwargs):
        self.user = user
        self.email = UserModel.objects.get(pk=user.pk).email
        super().__init__(*args, **kwargs)