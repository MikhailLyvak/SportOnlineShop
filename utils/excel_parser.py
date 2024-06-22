import xlrd
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP


@dataclass
class GoodPrice:
    code: str
    price: Decimal


def parse_excel(filename):
    result_data = []

    wb = xlrd.open_workbook(filename)
    sheet = wb.sheet_by_index(0)

    for row_idx in range(12, sheet.nrows):
        row = sheet.row_values(row_idx)
        col1_value = row[2]
        col2_value = row[9]

        if col1_value and col2_value:
            price_decimal = Decimal(col2_value).quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP
            )
            result_data.append(GoodPrice(code=col1_value, price=price_decimal))

    return result_data
