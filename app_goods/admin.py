from django.contrib import admin
from django import forms
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models import (
    Good,
    Producer,
    Size,
    Taste,
    GoodVariant,
    GoodVarPhoto,
    GoodTypeCluster,
    GoodType,
)
# from app_orders.models import Order, OrderItem


class GoodVariantForm(forms.ModelForm):
    class Meta:
        model = GoodVariant
        fields = [
            "code",
            "name",
            "description",
            "good",
            "size",
            "taste",
            "stock_price",
        ]
        
    def clean_code(self):
        code = self.cleaned_data['code']
        code = code.zfill(11)
        if GoodVariant.objects.filter(code=code).exists():
            raise forms.ValidationError("A GoodVariant with this code already exists.")
        return code


class GoodVariantUpdateForm(forms.ModelForm):
    class Meta:
        model = GoodVariant
        fields = [
            "name",
            "description",
            "good",
            "size",
            "taste",
            "stock_price",
            "sell_price",
        ]


class GoodVarPhotoInline(admin.TabularInline):
    model = GoodVarPhoto
    extra = 1


class GoodVariantAdmin(admin.ModelAdmin):
    form = GoodVariantForm
    add_form = GoodVariantForm
    change_form = GoodVariantUpdateForm
    inlines = [GoodVarPhotoInline]
    
    def get_form(self, request, obj=None, **kwargs):
        if obj:
            return self.change_form
        return super().get_form(request, obj, **kwargs)

    def response_add(self, request, obj, post_url_continue=None):
        self.message_user(
            request, "GoodVariant was successfully added.", level=messages.SUCCESS
        )
        return HttpResponseRedirect(reverse("app_goods:admin-goods"))

    def response_change(self, request, obj):
        self.message_user(
            request, "GoodVariant was successfully updated.", level=messages.SUCCESS
        )
        return HttpResponseRedirect(reverse("app_goods:admin-goods"))


admin.site.register(GoodType)
admin.site.register(GoodTypeCluster)
admin.site.register(Producer)
admin.site.register(Good)
admin.site.register(Size)
admin.site.register(Taste)
# admin.site.register(Order)
# admin.site.register(OrderItem)
admin.site.register(GoodVariant, GoodVariantAdmin)
