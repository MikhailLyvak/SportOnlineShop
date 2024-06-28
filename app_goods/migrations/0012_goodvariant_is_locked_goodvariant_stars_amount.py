# Generated by Django 5.0.3 on 2024-06-28 10:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_goods', '0011_sliderimages'),
    ]

    operations = [
        migrations.AddField(
            model_name='goodvariant',
            name='is_locked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='goodvariant',
            name='stars_amount',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
