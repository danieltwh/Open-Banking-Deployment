import requests
import pandas as pd
import api_keys
from datetime import datetime

def get_access_token(url, client_id, client_secret):
    response = requests.post(url,
                        auth=(client_id, client_secret),
                         data={'grant_type':'client_credentials','client_id':client_id,'client_secret':client_secret})
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        return 0

def get_sc_fx_rate(currency_from, currency_to):
    base_currency = currency_from
    counter_currency = currency_to
    SC_ACCESS_TOKEN = get_access_token("https://sandbox-api.sc.com/retail/v1/oauth2/token", api_keys.SC_CLIENT_ID, api_keys.SC_CLIENT_SECRET)
    if SC_ACCESS_TOKEN == 0:
        print('SC: failed authentication')
        return pd.DataFrame()

    supported_currencies = ['AUDCAD', 'AUDCHF', 'AUDCNH', 'AUDHKD', 'AUDJPY', 'AUDNZD', 'AUDSGD', 'AUDUSD', 'CADCHF', 'CADCNH', 'CADHKD', 'CADJPY', 
                    'CADSGD', 'CHFCNH', 'CHFHKD', 'CHFJPY', 'CHFSGD', 'CNHHKD', 'EURAUD', 'EURCAD', 'EURCHF', 'EURCNH', 'EURGBP', 'EURHKD', 
                    'EURJPY', 'EURNZD', 'EURSGD', 'EURUSD', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPCNH', 'GBPHKD', 'GBPJPY', 'GBPNZD', 'GBPSGD', 
                    'GBPUSD', 'JPYCNH', 'JPYHKD', 'NZDCAD', 'NZDCHF', 'NZDCNH', 'NZDHKD', 'NZDJPY', 'NZDSGD', 'NZDUSD', 'SGDCNH', 'SGDHKD', 
                    'SGDJPY', 'USDCAD', 'USDCHF', 'USDCNH', 'USDHKD', 'USDJPY', 'USDSGD']
    switch = False
    
    currency_combined = base_currency + counter_currency
    if currency_combined not in supported_currencies:
        if counter_currency + base_currency not in supported_currencies:
            print('SC: currency unsupported')
            return pd.DataFrame()
        counter_currency = currency_from
        base_currency = currency_to
        currency_combined = base_currency + counter_currency
        switch = True

    url = "https://sandbox-api.sc.com/retail/v1/fx-rates?currency=" + currency_combined

    payload = {}
    headers = {
    'Transaction-ID': '123',
    "Authorization": f"Bearer {SC_ACCESS_TOKEN}",
    #  "User-Agent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.90 Safari/537.36',
    'Origin': 'http://example.com',
    #   'Referer': 'http://example.com/some_page'
    }
    response = requests.request("GET", url, headers=headers, data = payload)

    if response.status_code == 200:
        data = response.json()[0]
        # date = datetime.strptime(data['last-updated'], '%Y%m%d%H%M%S').date()
        buying_rate = float(data['buy-price'])
        selling_rate = float(data['sell-price'])
        if switch:
            values = [{'Bank': 'Standard Chartered', 'Currency From': currency_from, 'Currency To': currency_to,
                'Exchange Rate': buying_rate}]
        else:
            values = [{'Bank': 'Standard Chartered', 'Currency From': currency_from, 'Currency To': currency_to,
                'Exchange Rate': 1 / selling_rate}]
        df = pd.DataFrame(values)
        return df
    else:
        print('SC: failed request')
        return pd.DataFrame()