from django.apps import AppConfig


class AppGoodsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app_goods'
    
    def ready(self):
        import app_goods.signals

