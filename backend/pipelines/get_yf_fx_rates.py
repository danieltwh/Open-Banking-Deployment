import yfinance as yf
from technical_indicators import process
import pandas as pd

def get_yf_past_fx_rates(currency_from, currency_to):
    sgd_eur = yf.Ticker(currency_from + currency_to +"=X")
    # hist = sgd_eur.history(start="2017-01-01", end="2017-04-30")
    df = sgd_eur.history(period='2mo')[["Open", "High", "Low", "Close", "Volume"]]
    df['Date'] = df.index
    df.rename(columns = {'Close':'Price'}, inplace = True)
    df.sort_index(axis=0, ascending=True, inplace=True)
    process(df)
    return df

def get_yf_new_fx_rate(currency_from, currency_to):
    df = get_yf_past_fx_rates(currency_from, currency_to)
    return df.iloc[-1]