# Generated by Django 5.0.3 on 2024-05-29 16:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_goods', '0008_goodvariant_is_top'),
    ]

    operations = [
        migrations.CreateModel(
            name='AimFilters',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('db_name', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name': 'Фільтр за цілю',
                'verbose_name_plural': 'Фільтри за цілями',
                'ordering': ['title'],
                'indexes': [models.Index(fields=['id', 'title', 'db_name'], name='app_goods_a_id_fdcfd2_idx'), models.Index(fields=['id'], name='app_goods_a_id_141044_idx'), models.Index(fields=['title'], name='app_goods_a_title_bfd89b_idx'), models.Index(fields=['db_name'], name='app_goods_a_db_name_b1a8d3_idx')],
            },
        ),
        migrations.AddField(
            model_name='good',
            name='aim_filter',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app_goods.aimfilters'),
        ),
    ]
