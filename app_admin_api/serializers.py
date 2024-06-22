from rest_framework import serializers

from app_goods.models import *


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = [
            "id",
            "name",
        ]


class TasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Taste
        fields = [
            "id",
            "name",
        ]


class GoodsListAdminSerializer(serializers.ModelSerializer):
    photos = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    create_date = serializers.SerializerMethodField()
    update_date = serializers.SerializerMethodField()
    size = SizeSerializer()
    taste = TasteSerializer()

    class Meta:
        model = GoodVariant
        fields = [
            "id",
            "code",
            "name",
            "description",
            "good",
            "size",
            "taste",
            "stock_price",
            "sell_price",
            "on_discount",
            "discount_percentage",
            "discount_price",
            "amount",
            "create_date",
            "update_date",
            "photos",
        ]

    def get_photos(self, obj) -> list:
        photos = getattr(obj, "photos")
        return [photo.photo.url for photo in photos.all()]

    def get_amount(self, obj) -> int or str:
        return obj.amount if obj.amount else "Out of Stock"

    def get_create_date(self, obj) -> str:
        return obj.create_date.strftime("%Y-%m-%d %H:%M")

    def get_update_date(self, obj) -> str:
        return obj.create_date.strftime("%Y-%m-%d %H:%M")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data["on_discount"]:
            data.pop("discount_percentage")
            data.pop("discount_price")
        return data


class GoodVariantAdminDetailSerializer(GoodsListAdminSerializer):
    sizes = serializers.SerializerMethodField()
    tastes = serializers.SerializerMethodField()

    class Meta:
        model = GoodVariant
        fields = [
            "id",
            "code",
            "name",
            "description",
            "good",
            "size",
            "taste",
            "stock_price",
            "sell_price",
            "on_discount",
            "discount_percentage",
            "discount_price",
            "amount",
            "create_date",
            "update_date",
            "photos",
            "sizes",
            "tastes",
        ]

    def get_sizes(self, obj) -> list:
        variants = GoodVariant.objects.filter(
            good=obj.good, taste=obj.taste
        ).select_related("size")

        sizes_data = []

        for variant in variants:
            size_data = {
                "id": variant.id,
                "name": variant.size.name,
                "amount": variant.amount,
                "current": variant.id == obj.id,
            }
            sizes_data.append(size_data)


        return sizes_data

    def get_tastes(self, obj) -> list:
        variants = GoodVariant.objects.filter(good=obj.good).select_related("taste")

        tastes_data = {}
        total_amount = 0

        for variant in variants:
            total_amount += variant.amount
            if variant.taste.name not in tastes_data:
                tastes_data[variant.taste.name] = {
                    "id": variant.taste.id,
                    "name": variant.taste.name,
                    "amount": variant.amount,
                    "current": variant.id == obj.id,
                }
            else:
                tastes_data[variant.taste.name]["amount"] += variant.amount

        unique_tastes_data = list(tastes_data.values())

        return unique_tastes_data
