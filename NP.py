import requests
from pprint import pprint


def get_settlement_areas(api_key):
    url = "https://api.novaposhta.ua/v2.0/json/"
    headers = {"Content-Type": "application/json"}
    payload = {
        "apiKey": api_key,
        "modelName": "Address",
        "calledMethod": "getSettlementAreas",
        "methodProperties": {"Ref": ""},
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print("Error fetching data:", e)
        return None


# Test areas
# result = get_settlement_areas(API_KAY)
# if result:
#     data = [{"Ref": res["Ref"],"name": res["Description"]} for res in result["data"]]
#     pprint(data)


def get_cities(api_key, FindByString: str = ""):
    url = "https://api.novaposhta.ua/v2.0/json/"
    headers = {"Content-Type": "application/json"}
    payload = {
        "apiKey": api_key,
        "modelName": "Address",
        "calledMethod": "getCities",
        "methodProperties": {
            FindByString : FindByString,
            "Page": 1,
            "Limit": 10,
        },
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print("Error fetching data:", e)
        return None


# Test cities
result = get_cities(API_KAY, "Луцьк")
if result:
    pprint([{"Ref": res["Ref"], "name": res["Description"]} for res in result["data"]])
    # print(result["data"])
