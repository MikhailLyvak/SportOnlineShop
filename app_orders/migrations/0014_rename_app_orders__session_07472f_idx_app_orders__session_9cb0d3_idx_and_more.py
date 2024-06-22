# Generated by Django 5.0.3 on 2024-05-07 21:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_orders', '0013_alter_orderfix_session'),
    ]

    operations = [
        migrations.RenameIndex(
            model_name='orderfix',
            new_name='app_orders__session_9cb0d3_idx',
            old_name='app_orders__session_07472f_idx',
        ),
        migrations.AlterField(
            model_name='orderfix',
            name='session',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
