# Generated by Django 5.0.3 on 2024-05-23 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_goods', '0007_alter_goodvariant_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='goodvariant',
            name='is_top',
            field=models.BooleanField(default=False),
        ),
    ]