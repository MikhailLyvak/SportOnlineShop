# Generated by Django 5.0.3 on 2024-05-29 16:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_goods', '0009_aimfilters_good_aim_filter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='good',
            name='aim_filter',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='app_goods.aimfilters'),
            preserve_default=False,
        ),
    ]
