from rest_framework import serializers
import locale

from decimal import Decimal
from django.templatetags.static import static

from .models import Cart, CartItem


class CardItemSerializer(serializers.ModelSerializer):
    good_variant = serializers.StringRelatedField()
    items_total_price = serializers.SerializerMethodField()
    item_price = serializers.SerializerMethodField()
    item_on_discount = serializers.SerializerMethodField()
    item_discount_price = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "good_variant",
            "amount",
            "item_price",
            "item_on_discount",
            "item_discount_price",
            "items_total_price",
            "photo",
        ]

    def get_items_total_price(self, obj):
        if obj.good_variant.on_discount:
            return obj.amount * obj.good_variant.discount_price
        return obj.amount * obj.good_variant.sell_price

    def get_item_price(self, obj):
        return obj.good_variant.sell_price

    def get_item_on_discount(self, obj):
        return obj.good_variant.on_discount

    def get_item_discount_price(self, obj):
        return obj.good_variant.discount_price

    def get_photo(self, obj) -> list:
        photos = getattr(obj.good_variant, "photos")
        return (
            photos.first().photo.url
            if photos.exists()
            else static("images/default-good.png")
        )


class CartSerializer(serializers.ModelSerializer):
    items = CardItemSerializer(many=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "session",
            "items",
            "total_price",
        ]

    def get_total_price(self, obj):
        prices = []
        for item in obj.items.all():
            if item.good_variant.on_discount:
                prices.append(item.amount * item.good_variant.discount_price)
            if not item.good_variant.on_discount:
                prices.append(item.amount * item.good_variant.sell_price)

        total_price = sum(prices)
        # Set the locale to use the appropriate thousands separator
        locale.setlocale(locale.LC_ALL, "uk_UA.UTF-8")
        formatted_total_price = locale.currency(total_price, grouping=True)
        return formatted_total_price
