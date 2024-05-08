from rest_framework import serializers
from django.db.models import Count, Prefetch, Sum, F, Min

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


class GoodsListSerializer(serializers.ModelSerializer):
    photos = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    sizes = serializers.SerializerMethodField()
    taste = TasteSerializer()

    class Meta:
        model = GoodVariant
        fields = [
            "id",
            "name",
            "description",
            "on_discount",
            "discount_percentage",
            "sell_price",
            "on_discount",
            "discount_percentage",
            "discount_price",
            "amount",
            "good",
            "sizes",
            "taste",
            "photos",
        ]

    def get_description(self, obj) -> str:
        if len(obj.description) > 100:
            return obj.description[:100] + "..."
        return obj.description

    def get_sizes(self, obj) -> list:
        variants = [
            variant
            for variant in self.context["variants"]
            if variant["good_id"] == obj.good_id and variant["taste_id"] == obj.taste_id
        ]

        sizes_data = [
            {
                "id": variant["size_id"],
                "name": variant["size__name"],
                "amount": variant["amount"],
                "variant_id": variant["id"],
            }
            for variant in variants
        ]

        return sizes_data

    def get_photos(self, obj) -> list:
        photos = getattr(obj, "photos")
        return [photo.photo.url for photo in photos.all().order_by("id")]


class GoodVarClustersSerializer(serializers.ModelSerializer):
    cluster_types = serializers.SerializerMethodField()

    class Meta:
        model = GoodTypeCluster
        fields = [
            "id",
            "name",
            "cluster_types",
        ]

    def get_cluster_types(self, obj) -> list:
        types = obj.good_types.all()
        return [type.name for type in types]
