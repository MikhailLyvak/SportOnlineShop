# Generated by Django 5.0.3 on 2024-04-30 14:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app_orders', '0006_alter_order_delivery_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='np_city',
        ),
    ]
