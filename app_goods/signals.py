from django.db.models.signals import pre_save
from django.dispatch import receiver
from decimal import Decimal

from .models import GoodVariant

def create_good_name(instance):
    if instance.taste is not None:
        return f"{instance.good.name} {instance.good.producer.name} | смак: {instance.taste.name}"
    return f"{instance.good.name} {instance.good.producer.name} | ({instance.size.name})"

@receiver(pre_save, sender=GoodVariant)
def pad_code_with_zeros(sender, instance, *args, **kwargs):
    if not instance.pk:
        if instance.code is not None:
            instance.code = str(instance.code).zfill(11)
        if instance.name is None:
            instance.name = create_good_name(instance)
            instance.name_lower = create_good_name(instance).lower()
            
        instance.sell_price = round(instance.stock_price * Decimal('1.2'), 2)
    else:
        pass
        
