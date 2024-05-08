import requests
from django.conf import settings


BOT_API_KEY = settings.BOT_API_KEY
MY_CHANNEL_NAME = settings.MY_CHANNEL_NAME
DOMAIN = settings.DOMAIN


def bot_notification(sum, order_id, pay_type, phone, fio):
    response = requests.get(
        f"https://api.telegram.org/bot{BOT_API_KEY}/sendMessage",
        {
            "chat_id": MY_CHANNEL_NAME,
            "text": f"Оформлено замовлення \n"
            f"===== №{order_id} ===== \n"
            f"===== На сума ===== \n"
            f"{sum} грн.\n"
            f"===== Тип оплати ===== \n"
            f"{pay_type}\n"
            f"===== Посилання для первірки ===== \n"
            f"{DOMAIN}/order-admin-list/?pk={order_id} \n"
            f"===== Контакти ===== \n"
            f"{phone} => {fio} \n"
        },
    )

    if response.status_code == 200:
        print(
            f"Borrowing creating successfully sended to channel"
            f"  --> {MY_CHANNEL_NAME}  <-- "
        )
    else:
        print(response.text)
