from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError


class GoodTypeCluster(models.Model):
    name = models.CharField(max_length=100)
    name_lower = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        ordering = [
            "name",
        ]
        verbose_name = "Good Type Cluster"
        verbose_name_plural = "Good Types Clusters"
        indexes = [
            models.Index(
                fields=["id", "name", "name_lower"],
            ),
            models.Index(fields=["id"]),
            models.Index(fields=["name"]),
            models.Index(fields=["name_lower"]),
        ]

    def __str__(self) -> str:
        return f"{self.name}"
    
    def save(self, *args, **kwargs):
        if not self.pk:
            self.name_lower = self.name.lower()
        super().save(*args, **kwargs)


class GoodType(models.Model):
    cluster = models.ForeignKey(GoodTypeCluster, on_delete=models.CASCADE, related_name="good_types")
    name = models.CharField(max_length=100)
    name_lower = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        ordering = [
            "name",
        ]
        verbose_name = "Good Type"
        verbose_name_plural = "Good Types"
        indexes = [
            models.Index(
                fields=["id", "name", "name_lower"],
            ),
            models.Index(fields=["id"]),
            models.Index(fields=["name"]),
            models.Index(fields=["name_lower"]),
        ]

    def __str__(self) -> str:
        return f"{self.name}"
    
    def save(self, *args, **kwargs):
        if not self.pk:
            self.name_lower = self.name.lower()
        super().save(*args, **kwargs)


class Producer(models.Model):
    name = models.CharField(max_length=100)
    name_lower = models.CharField(max_length=100, null=True, blank=True)
    photo = models.ImageField(upload_to="producers", null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        ordering = [
            "name",
        ]
        verbose_name = "Producer"
        verbose_name_plural = "Producers"
        indexes = [
            models.Index(
                fields=["id", "name", "name_lower"],
            ),
            models.Index(fields=["id"]),
            models.Index(fields=["name"]),
            models.Index(fields=["name_lower"]),
        ]

    def __str__(self) -> str:
        return f"{self.name}"
    
    def save(self, *args, **kwargs):
        if not self.pk:
            self.name_lower = self.name.lower()
        super().save(*args, **kwargs)


class Good(models.Model):
    name = models.CharField(max_length=100)
    name_lower = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    good_type = models.ForeignKey(GoodType, on_delete=models.CASCADE)
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE)

    class Meta:
        ordering = [
            "name",
        ]
        verbose_name = "Good"
        verbose_name_plural = "Goods"
        indexes = [
            models.Index(
                fields=["id", "name", "good_type", "producer", "name_lower"],
            ),
            models.Index(fields=["id"]),
            models.Index(fields=["name"]),
            models.Index(fields=["good_type"]),
            models.Index(fields=["producer"]),
            models.Index(fields=["name_lower"]),
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.good_type.name}) by {self.producer.name}"
    
    def save(self, *args, **kwargs):
        if not self.pk:
            self.name_lower = self.name.lower()
        super().save(*args, **kwargs)


class Size(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        ordering = [
            "name",
        ]
        verbose_name = "Size"
        verbose_name_plural = "Sizes"
        indexes = [
            models.Index(
                fields=["id", "name"],
            ),
            models.Index(fields=["id"]),
            models.Index(fields=["name"]),
        ]

    def __str__(self) -> str:
        return f"{self.name}"


class Taste(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        ordering = [
            "name",
        ]
        verbose_name = "Taste"
        verbose_name_plural = "Tastes"
        indexes = [
            models.Index(
                fields=["id", "name"],
            ),
            models.Index(fields=["id"]),
            models.Index(fields=["name"]),
        ]

    def __str__(self) -> str:
        return f"{self.name}"


class PaddedIntegerField(models.IntegerField):
    def get_prep_value(self, value):
        if value is None:
            return None
        return str(value).zfill(11)


def validate_non_none(value):
    if value is None:
        raise ValidationError("Code cannot be None")


class GoodVariant(models.Model):
    code = models.CharField(unique=True, max_length=11, validators=[validate_non_none])
    name = models.CharField(max_length=255, null=True, blank=True)
    name_lower = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    good = models.ForeignKey(Good, on_delete=models.CASCADE)
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    taste = models.ForeignKey(Taste, on_delete=models.CASCADE)
    stock_price = models.DecimalField(max_digits=10, decimal_places=2)
    sell_price = models.DecimalField(max_digits=10, decimal_places=2)
    on_discount = models.BooleanField(default=False)
    discount_percentage = models.IntegerField(default=0)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    amount = models.IntegerField(default=1)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = [
            "update_date",
            "amount",
            "good",
            "size",
            "taste",
            "sell_price",
            "on_discount",
        ]
        verbose_name = "Good Variant"
        verbose_name_plural = "Good Variants"
        indexes = [
            models.Index(
                fields=["code", "good", "size", "taste", "sell_price", "on_discount", "name_lower"],
            ),
            models.Index(fields=["code"]),
            models.Index(fields=["good"]),
            models.Index(fields=["size"]),
            models.Index(fields=["taste"]),
            models.Index(fields=["sell_price"]),
            models.Index(fields=["on_discount"]),
            models.Index(fields=["name_lower"]),
        ]

    def __str__(self) -> str:
        return f"{self.good.name} ({self.size.name}, {self.taste.name})"
     


class GoodVarPhoto(models.Model):
    good_variant = models.ForeignKey(GoodVariant, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to="good_variants", null=True, blank=True)

    class Meta:
        ordering = [
            "good_variant",
        ]
        verbose_name = "Good Variant Photo"
        verbose_name_plural = "Good Variant Photos"
        indexes = [
            models.Index(
                fields=["id", "good_variant"],
            ),
            models.Index(fields=["id"]),
            models.Index(fields=["good_variant"]),
        ]

    def __str__(self) -> str:
        return f"{self.good_variant.good.name} ({self.good_variant.size.name}, {self.good_variant.taste.name}) - Photo"