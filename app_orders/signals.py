from django.db.models.signals import post_delete, post_save, pre_save, pre_delete
from django.dispatch import receiver
from django.core.exceptions import PermissionDenied
from django.contrib.sessions.models import Session

from .models import OrderFix, OrderItem


@receiver(post_save, sender=OrderItem)
def calculate_order(sender, instance, created, **kwargs):
    if created:
        order = instance.order
        sell_price = instance.good_variant.sell_price
        discount_price = instance.good_variant.discount_price
        amount = instance.amount
        
        order.total_price = order.total_price + (sell_price * amount)
        
        if instance.good_variant.on_discount:
            order.total_discount = order.total_discount + (sell_price - discount_price) * amount
        
        order.total_clear_price = order.total_price - order.total_discount
        order.save()


@receiver(pre_delete, sender=OrderFix)
def log_deleted_order(sender, instance, **kwargs):
    # Check if the instance being deleted is a session object
    if isinstance(instance, Session):
        return
    # If not a session object, raise PermissionDenied to prevent deletion
    raise PermissionDenied("Orders cannot be deleted.")
    # print(f"Order {instance.id} has been deleted.")