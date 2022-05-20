import requests
import pandas as pd
from get_yf_fx_rates import get_yf_past_fx_rates, get_yf_single_fx_rate
import os

database_api_token = os.environ['DATABASE_SECRET']

def insert_initial_data():
    data = get_yf_past_fx_rates("EUR", "USD")
    URL = "https://openbanking-application.herokuapp.com/data"
    success = True
    for record in data:
        record['token'] = database_api_token
        r = requests.post(URL, json=record)
        if r.status_code == 200:
            success = success and True
        else: 
            success = False and success
        
    if success:
        print('all inserted')
    else:
        print('error')

def insert_new_data():
    data_new = get_yf_single_fx_rate("EUR", "USD", 2)
    # data_fivedays = get_yf_single_fx_rate("EUR", "USD", 6)
    # data_new['token'] = database_api_token
    # data_fivedays['token'] = database_api_token

    # price_new = float(data_new['price'])
    # price_fivedays = float(data_fivedays['price'])

    # if price_new - price_fivedays > 0.0055:
    #     data_fivedays['label'] = 2
    # elif price_new - price_fivedays < -0.0055:
    #     data_fivedays['label'] = 1
    # else:
    #     data_fivedays['label'] = 0

    URL_post = "https://openbanking-application.herokuapp.com/data"

    r_insert_new = requests.post(URL_post, json=data_new)
    if r_insert_new.status_code == 200:
        print("inserted new data")
    
    # date_fivedays = data_fivedays['date']
    # r_delete_old = requests.delete(url=f"https://openbanking-application.herokuapp.com/fx?date={date_fivedays}&token={database_api_token}")
    # if r_delete_old.status_code == 200:
    #     print("deleted 5 days ago date")
    
    # r_insert_old = requests.post(URL_post, json=data_fivedays)
    # if r_insert_old.status_code == 200:
    #     print("updated 5 days ago label")