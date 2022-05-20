import requests
import pandas as pd
from get_news import get_news
import datetime
import os

database_api_token = os.environ['DATABASE_SECRET']

def insert_news():
    week_ago = datetime.date.today() - datetime.timedelta(days=7)
    week_ago = week_ago.strftime("%Y-%m-%d")
    data = get_news(30)
    URL = "https://openbanking-application.herokuapp.com/news"
    insert_success = True
    for record in data:
        record['token'] = database_api_token
        r1 = requests.post(URL, json=record)
        if r1.status_code == 200:
            insert_success = insert_success and True
        else: 
            insert_success = False and insert_success
        
    if insert_success:
        print('all inserted')
    else:
        print('insert failed')

    r2 = requests.delete(url=f"{URL}?date={week_ago}&token={database_api_token}")
    if r2.status_code == 200:
        print("delete success")
    else:
        print("delete failed")