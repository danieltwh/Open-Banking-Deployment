import requests
import pandas as pd
import api_keys

def get_ocbc_fx_rate(currency_from, currency_to):
    base_currency = currency_from
    counter_currency = currency_to
    supported_currencies = ['USD', 'SGD', 'MYR']
    switch = False

    if base_currency not in supported_currencies and counter_currency not in supported_currencies:
        print('OCBC: currency unsupported')
        return pd.DataFrame()

    if base_currency not in supported_currencies:
        counter_currency = currency_from
        base_currency = currency_to
        switch = True

    url = "https://api.ocbc.com:8243/Forex/1.1/*?"
    params = {"country": base_currency[:-1]}
    headers = {"accept": "application/json", "Authorization": "Bearer " + api_keys.OCBC_ACCESS_TOKEN}
    response = requests.get(url=url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()["RateList"]
        data = list(filter(lambda each_currency: each_currency['toCurrency'] == counter_currency, data))[0]
        buying_rate = float(data['bankBuyingRateTT'])
        selling_rate = float(data['bankSellingRate'])
        if switch:
            values = [{'Bank':'OCBC', 'Currency From':currency_from, 'Currency To':currency_to,
                'Exchange Rate': buying_rate}]     
        else:
            values = [{'Bank':'OCBC', 'Currency From': currency_from, 'Currency To': currency_to,
                'Exchange Rate': 1 / selling_rate}]         
        
        df = pd.DataFrame(values)
        return df
    else:
        print('OCBC: failed request')
        return pd.DataFrame()