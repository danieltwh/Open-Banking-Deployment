import requests
import pandas as pd
import api_keys

def get_ocbc_fx_rate(currency_from, currency_to):
    supported_currencies = ['USD', 'SGD', 'MYR']
    switch = False

    if currency_from not in supported_currencies and currency_to not in supported_currencies:
        print('OCBC: currency unsupported')
        return pd.DataFrame()

    if currency_from not in supported_currencies:
        store = currency_from
        currency_from = currency_to
        currency_to = store
        switch = True

    url = "https://api.ocbc.com:8243/Forex/1.1/*?"
    params = {"country": currency_from[:-1]}
    headers = {"accept": "application/json", "Authorization": "Bearer " + api_keys.OCBC_ACCESS_TOKEN}
    response = requests.get(url=url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()["RateList"]
        data = list(filter(lambda each_currency: each_currency['toCurrency'] == currency_to, data))[0]
        buying_rate = float(data['bankBuyingRateTT'])
        selling_rate = float(data['bankSellingRate'])
        if switch:
            values = [{'Bank':'OCBC', 'Currency From':currency_to, 'Currency To':currency_from,
                'Buying Rate':1 / buying_rate, 'Selling Rate':1 / selling_rate}]     
        else:
            values = [{'Bank':'OCBC', 'Currency From': currency_from, 'Currency To': currency_to,
                'Buying Rate': buying_rate, 'Selling Rate': selling_rate}]         
        
        df = pd.DataFrame(values)
        return df
    else:
        print('OCBC: failed request')
        return pd.DataFrame()