from newsapi import NewsApiClient
import pandas as pd
import numpy as np
from datetime import date
from News_FinBERT import predict
from random import shuffle
import os

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
    df = predict(df)
    df.columns = ['date', 'title', 'article', 'sentiment']
    df['date'] = df['date'].apply(lambda x: x[0:10])

    news = df.to_dict(orient = 'records')
    return news