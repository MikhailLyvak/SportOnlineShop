from django.contrib import admin
from django import forms
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.utils.safestring import mark_safe
from django.contrib.admin import widgets
from tinymce.widgets import TinyMCE
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
    AimFilters,
    SliderImages,
)
# from app_orders.models import Order, OrderItem


class GoodVariantForm(forms.ModelForm):
    description = forms.CharField(widget=TinyMCE())
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
            "stars_amount",
        ]
        
    def clean_code(self):
        code = self.cleaned_data['code']
        code = code.zfill(11)
        if GoodVariant.objects.filter(code=code).exists():
            raise forms.ValidationError("A GoodVariant with this code already exists.")
        return code


class GoodVariantUpdateForm(forms.ModelForm):
    description = forms.CharField(widget=TinyMCE())
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
            "is_top",
            "stars_amount",
        ]


class SliderImagesAdmin(admin.ModelAdmin):
    list_display = ('title', 'image_thumbnail')
    search_fields = ('title',)
    list_filter = ('title',)
    ordering = ('title',)

    def image_thumbnail(self, obj):
        if obj.image:
            image_url = obj.image.url
            return mark_safe(f'<a href="{image_url}" target="_blank"><img src="{image_url}" style="height: 80px;"/></a>')
        return '-'
    image_thumbnail.short_description = 'Image'


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
    

class ProducerForm(forms.ModelForm):
    description = forms.CharField(widget=TinyMCE())
    
    class Meta:
        model = Producer
        fields = [
            "name",
            "description",
            "photo",
        ]

class ProducerAdmin(admin.ModelAdmin):
    form = ProducerForm
    search_fields = ["name"]


admin.site.register(GoodType)
admin.site.register(GoodTypeCluster)
admin.site.register(Producer, ProducerAdmin)
admin.site.register(Good)
admin.site.register(Size)
admin.site.register(Taste)
admin.site.register(AimFilters)
admin.site.register(SliderImages, SliderImagesAdmin)
# admin.site.register(Order)
# admin.site.register(OrderItem)
admin.site.register(GoodVariant, GoodVariantAdmin)
