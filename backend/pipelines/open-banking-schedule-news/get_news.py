from newsapi import NewsApiClient
import pandas as pd
import numpy as np
from datetime import date
from random import shuffle
import os
import requests

def get_news(number_news_per_day):
    today = date.today()
    today = today.strftime("%Y-%m-%d")
    news_api_key = os.environ['NEWS_SECRET']
    newsapi = NewsApiClient(api_key = news_api_key)

    keywords = ['Latest US Stock Market', 
        'Crypto Ukraine Russia',
        'Biden nuclear France Germany dollar',
        'yahoo finance US europe',
        'blackrock US Europe',
        'quantitative trading US Europe']

    result = []
    for keyword in keywords:
        data = newsapi.get_everything(q=keyword,from_param=today,language='en', page=1, page_size=100)['articles']
        result += data

    shuffle(result)
    if len(result) > number_news_per_day:
        result = result[0:number_news_per_day]

    df = pd.DataFrame(result)[['publishedAt', 'title', 'content']]
    df.columns = ['date', 'title', 'article']
    input = df.to_dict(orient='records')

    sentiment_URL = 'https://open-banking-news-sentiment.azurewebsites.net/api/run-news-function'
    r = requests.get(sentiment_URL, json=input)
    if r.status_code == 200:
        print('success')
        df = pd.DataFrame(r.json())
    else:
        df['sentiment'] = -10

    df['date'] = df['date'].apply(lambda x: x[0:10])

    news = df.to_dict(orient = 'records')
    return news