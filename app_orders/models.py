from django.db import models
from django.contrib.sessions.models import Session
from decimal import Decimal

from app_goods.models import GoodVariant


INVOICE_STATUS = (
    ("CREATED", "Created"),
    ("FILLED", "Filled"),
    ("PAYED", "PAYED"),
    ("TIMEOUT", "Timeout"),
    ("CANCELED", "Canceled"),
)


DELIVERY_TYPES = (
    ("NP", "Nova Poshta"),
    ("UP", "Ukr Poshta"),
    ("SL", "Sport Life"),
)

PAYMENT_TYPES = (
    ("OP", "Online Payment"),
    ("CP", "Cash Payment"),
)


class OrderFix(models.Model):
    session = models.CharField(max_length=255, null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=Decimal('0.00'))
    total_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=Decimal('0.00'))
    total_clear_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=Decimal('0.00'))
    
    invoice_status = models.CharField(max_length=10, choices=INVOICE_STATUS, default="CREATED")

    payment_url = models.CharField(null=True, blank=True, max_length=1024)
    order_reference = models.CharField(max_length=255, null=True, blank=True)
    payment_type = models.CharField(max_length=2, choices=PAYMENT_TYPES, null=True, blank=True)

    delivery_type = models.CharField(max_length=2, choices=DELIVERY_TYPES, null=True, blank=True)
    ukr_post_adress = models.CharField(max_length=512, null=True, blank=True)
    np_city = models.CharField(max_length=512, null=True, blank=True)
    nova_post_address = models.CharField(max_length=512, null=True, blank=True)
    is_delivered = models.BooleanField(default=False)
    
    user_fio = models.CharField(max_length=512, null=True, blank=True)
    user_email = models.EmailField(null=True, blank=True)
    user_phone = models.CharField(max_length=20, null=True, blank=True)
    
    def delete(self, using=None, keep_parents=False):
        raise PermissionError("Orders cannot be deleted.")

    class Meta:
        verbose_name = "OrderFix"
        verbose_name_plural = "OrdersFix"
        indexes = [
            models.Index(fields=["session"]),
            models.Index(fields=["create_date"]),
            models.Index(fields=["update_date"]),
            models.Index(fields=["total_price"]),
            models.Index(fields=["total_discount"]),
            models.Index(fields=["total_clear_price"]),
            models.Index(fields=["invoice_status"]),
            models.Index(fields=["is_delivered"]),
        ]

    def __str__(self) -> str:
        return f"Order {self.total_price} {self.invoice_status}"
    
    


class OrderItem(models.Model):
    order = models.ForeignKey(OrderFix, on_delete=models.CASCADE, related_name='items')
    good_variant = models.ForeignKey(GoodVariant, on_delete=models.CASCADE)
    amount = models.IntegerField(default=1)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"
        indexes = [
            models.Index(fields=["order"]),
            models.Index(fields=["good_variant"]),
            models.Index(fields=["amount"]),
            models.Index(fields=["create_date"]),
            models.Index(fields=["update_date"]),
        ]
        
    def __str__(self) -> str:
        return f"Order Item {self.good_variant} {self.amount}"