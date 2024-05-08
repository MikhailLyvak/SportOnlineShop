import hashlib
import hmac
import json
import time
import uuid

import requests
from django.conf import settings

# TODO: поміняти не реальні | Start Block |

URL = settings.WEY_URL
SECRET_KEY = settings.WEY_SECRET_KEY
MERCHANT_ACCOUNT = settings.MERCHANT_ACCOUNT
MERCHANT_DOMAIN_NAME = settings.MERCHANT_DOMAIN_NAME

# TODO: поміняти не реальні | End Block |
# TODO: Статичні данні | Start Block |

APIVERSION = 1
TRANSACTIONTYPE = "CREATE_INVOICE"
MERCHANT_AUTH_TYPE = "SimpleSignature"
CURRENCY = "UAH"

# TODO: Статичні данні | Start Block |


class MLPay:
    def __init__(
        self,
        product_name: list,
        product_price: list,
        product_count: list,
        client_email: str = None,
    ) -> None:
        self.product_name = product_name
        self.product_price = product_price
        self.product_count = product_count
        self.client_email = client_email
        self.order_date = int(time.time())
        self.order_timeout = int(604800)
        self.order_reference = str(uuid.uuid4())
        self.amount = round(sum(
            [price * count for price, count in zip(product_price, product_count)]
        ),2 )

    def get_order_reference(self) -> str:
        return self.order_reference

    def create_HMAC_MD5_string(self) -> str:
        result = ""
        result += MERCHANT_ACCOUNT + ";"
        result += MERCHANT_DOMAIN_NAME + ";"
        result += self.order_reference + ";"
        result += str(self.order_date) + ";"
        result += str(self.amount) + ";"
        result += CURRENCY + ";"
        for name in self.product_name:
            result += name + ";"
        for count in self.product_count:
            result += str(count) + ";"
        for price in self.product_price:
            result += str(price) + ";"

        return result[:-1]

    def create_hash_hmac(self) -> str:
        return hmac.new(
            SECRET_KEY.encode("utf-8"),
            self.create_HMAC_MD5_string().encode("utf-8"),
            hashlib.md5,
        ).hexdigest()

    def make_wayforpay_request(self) -> dict:
        data = {
            "transactionType": TRANSACTIONTYPE,
            "merchantAccount": MERCHANT_ACCOUNT,
            "merchantDomainName": MERCHANT_DOMAIN_NAME,
            "merchantSignature": self.create_hash_hmac(),
            "apiVersion": APIVERSION,
            "orderReference": self.order_reference,
            "orderDate": self.order_date,
            "amount": self.amount,
            "currency": CURRENCY,
            "orderTimeout": self.order_timeout,
            "productName": self.product_name,
            "productPrice": self.product_price,
            "productCount": self.product_count,
            "clientEmail": self.client_email,
        }
        json_data = json.dumps(data)
        print(json_data)
        response = requests.post(
            URL, data=json_data, headers={"Content-Type": "application/json"}
        )
        return response.json()


class PaymentStatus:
    def __init__(self, order_reference: str) -> None:
        self.order_reference = order_reference

    def create_HMAC_MD5_string(self) -> str:
        concat = MERCHANT_ACCOUNT + ";" + self.order_reference

        return hmac.new(
            SECRET_KEY.encode("utf-8"),
            concat.encode("utf-8"),
            hashlib.md5,
        ).hexdigest()

    def make_wayforpay_request(self) -> dict:
        data = {
            "transactionType": "CHECK_STATUS",
            "merchantAccount": MERCHANT_ACCOUNT,
            "orderReference": self.order_reference,
            "merchantSignature": self.create_HMAC_MD5_string(),
            "apiVersion": 1,
        }
        json_data = json.dumps(data)
        response = requests.post(
            URL, data=json_data, headers={"Content-Type": "application/json"}
        )
        return response.json()
