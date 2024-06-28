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
            "stars_amount",
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
    

class ProducerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producer
        fields = ["name", "id"]


class AimFiltersSerializer(serializers.ModelSerializer):
    class Meta:
        model = AimFilters
        fields = ['id', 'title']

class GoodTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoodType
        fields = ['id', 'name']

class GoodTypeClusterSerializer(serializers.ModelSerializer):
    good_types = GoodTypeSerializer(many=True, read_only=True)

    class Meta:
        model = GoodTypeCluster
        fields = ['id', 'name', 'good_types']

class SliderImagesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = SliderImages
        fields = ["image", ]