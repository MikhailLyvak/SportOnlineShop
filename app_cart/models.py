from django.contrib.sessions.models import Session
from django.db import models

from app_goods.models import GoodVariant

class Cart(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    good_variant = models.ForeignKey(GoodVariant, on_delete=models.CASCADE)
    amount = models.IntegerField(default=1)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
