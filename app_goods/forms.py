from django import forms
from .models import GoodVariant


class NameSearchForm(forms.Form):
    name = forms.CharField(
        max_length=255,
        required=False,
        label="",
        widget=forms.TextInput(attrs={
            "placeholder": "Пошку товару по назві...",
            "class": "form-control",
            "id": "searchProductList",
            "type": "text"
        })
    )


class GoodDiscountForm(forms.ModelForm):
    discount_percentage = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            "placeholder": "Введіть відсоток знижки",
            "class": "form-control",
            "type": "number",
        }),
    )
    
    class Meta:
        model = GoodVariant
        fields = [
            "discount_percentage",
        ]