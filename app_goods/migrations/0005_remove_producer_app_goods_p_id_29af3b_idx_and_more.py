# Generated by Django 5.0.3 on 2024-04-12 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_goods', '0004_remove_good_app_goods_g_id_b5f3b1_idx_and_more'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='producer',
            name='app_goods_p_id_29af3b_idx',
        ),
        migrations.AddField(
            model_name='producer',
            name='name_lower',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddIndex(
            model_name='producer',
            index=models.Index(fields=['id', 'name', 'name_lower'], name='app_goods_p_id_23b3d8_idx'),
        ),
        migrations.AddIndex(
            model_name='producer',
            index=models.Index(fields=['name_lower'], name='app_goods_p_name_lo_03b321_idx'),
        ),
    ]