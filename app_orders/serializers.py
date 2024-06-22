from .models import OrderFix
from rest_framework import serializers


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderFix
        fields = [
            "payment_url",
            "order_reference",
            "payment_type",
            "delivery_type",
            "ukr_post_adress",
            "np_city",
            "nova_post_address",
            "user_fio",
            "user_email",
            "user_phone",
        ]
    
    def update(self, instance, validated_data):
        instance.invoice_status = "FILLED"

        instance.payment_url = validated_data.get('payment_url', instance.payment_url)
        instance.order_reference = validated_data.get('order_reference', instance.order_reference)
        instance.payment_type = validated_data.get('payment_type', instance.payment_type)
        instance.delivery_type = validated_data.get('delivery_type', instance.delivery_type)
        instance.ukr_post_adress = validated_data.get('ukr_post_adress', instance.ukr_post_adress)
        instance.np_city = validated_data.get('np_city', instance.np_city)
        instance.nova_post_address = validated_data.get('nova_post_address', instance.nova_post_address)
        instance.is_delivered = validated_data.get('is_delivered', instance.is_delivered)
        instance.user_fio = validated_data.get('user_fio', instance.user_fio)
        instance.user_email = validated_data.get('user_email', instance.user_email)
        instance.user_phone = validated_data.get('user_phone', instance.user_phone)
        instance.save()

        return instance
    

class OrderStatusUpdateSerializer(serializers.Serializer):
    order_pk = serializers.IntegerField()
    status = serializers.ChoiceField(choices=["PAYED", "TIMEOUT"])
