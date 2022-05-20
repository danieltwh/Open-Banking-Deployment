import yfinance as yf
from technical_indicators import process
import pandas as pd
from datetime import datetime
from Signal_LSTM import predict

def get_yf_past_fx_rates(currency_from, currency_to):
    sgd_eur = yf.Ticker(currency_from + currency_to +"=X")
    # hist = sgd_eur.history(start="2017-01-01", end="2017-04-30")
    df = sgd_eur.history(period='2mo')[["Open", "High", "Low", "Close"]]
    df.insert(0,'Date', df.index)
    df.reset_index(drop=True, inplace=True)
    df.rename(columns = {'Close':'Price'}, inplace = True)
    df.sort_values(by=['Date'], ascending=True, inplace=True)
    process(df)
    df['difference'] = df['Price'].diff()
    df['change_percent'] = df['Price'].pct_change()
    df = predict(df, path = 'Signal_LSTM_v3.7')
    df['Date'] = df['Date'].apply(lambda x: x.strftime("%Y-%m-%d"))
    df.rename(columns = {'Date':'date', 'Open':'open', 'High':'high', 'Low':'low', 'Price':'price',
        'Bollinger_up':'bollinger_up', 'Bollinger_down':'bollinger_down', 'Pred':'label'}, inplace = True)
    cols = ['date', 'price', 'open', 'high', 'low', 'change_percent', 'difference', 'label',
        'sma', 'ema', 'macd', 'macd_s', 'macd_h', 'roc', 'rsi', 'bollinger_up', 'bollinger_down', 'cci']
    df = df[cols]
    df.fillna("", inplace = True)
    df = df.astype(str)
    data = df.to_dict(orient = 'records')
    return data


def get_yf_single_fx_rate(currency_from, currency_to, days):
    data = get_yf_past_fx_rates(currency_from, currency_to)
    days = days * -1
    data = data[days]
    return data