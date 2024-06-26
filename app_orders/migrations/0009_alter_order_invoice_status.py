# Generated by Django 5.0.3 on 2024-05-07 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_orders', '0008_order_np_city'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='invoice_status',
            field=models.CharField(choices=[('CREATED', 'Created'), ('FILLED', 'Filled'), ('PAYED', 'PAYED'), ('TIMEOUR', 'Timeout'), ('CANCELED', 'Canceled')], default='CREATED', max_length=10),
        ),
    ]
