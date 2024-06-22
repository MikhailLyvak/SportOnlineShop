from app_cart.models import CartItem
from dataclasses import dataclass


@dataclass
class CalcData:
    total_clear_price: float
    total_discount: float
    total_price: float


def calculate_result(cart_items: CartItem):
    total_clear_price = 0
    total_discount = 0
    total_price = 0

    for item in cart_items:
        sell_price = item.good_variant.sell_price
        amount = item.amount
        total_clear_price += sell_price * amount
        if item.good_variant.on_discount:
            discount_price = item.good_variant.discount_price
            total_discount += (sell_price - discount_price) * amount
        total_price += sell_price * amount

    total_price -= total_discount

    return CalcData(total_clear_price, total_discount, total_price)
