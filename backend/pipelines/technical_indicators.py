import pandas
import numpy as np

"""Utils used to compute the technical indicators given a time series data"""


def sma(df, interval=7):
    """Simple moving average"""
    df["sma"] = df["Price"].rolling(window=interval).mean()
    return df


def ema(df):
    """Exponential moving average"""
    df["ema"] = df["Price"].ewm(com=0.3).mean()
    return df


def cma(df):
    """Cumulative moving average"""
    df["cma"] = df["Price"].expanding().mean()
    return df


def macd(df, slow=26, fast=12, window=9):
    """Moving average convergence divergence"""
    # Slow-day EMA
    k = df["Price"].ewm(span=fast, adjust=False, min_periods=slow).mean()
    # Fast-day EMA
    d = df["Price"].ewm(span=slow, adjust=False, min_periods=fast).mean()
    macd = k - d
    macd_s = macd.ewm(span=window, adjust=False, min_periods=window).mean()
    macd_h = macd - macd_s
    df["macd"] = df.index.map(macd)
    df["macd_s"] = df.index.map(macd_s)
    df["macd_h"] = df.index.map(macd_h)
    return df


def roc(df, n=5):
    """Rate of change"""
    N = df["Price"].diff(n)
    D = df["Price"].shift(n)
    df["roc"] = N / D
    return df


def rsi(df, length=14):
    """Relative strength index"""
    delta = df["Price"].diff()[1:]
    up = delta.clip(lower=0)
    down = delta.clip(upper=0).abs()
    roll_up = up.ewm(span=length).mean()
    roll_down = down.ewm(span=length).mean()
    rs = roll_up / roll_down
    rsi = 100.0 - (100.0 / (1.0 + rs))
    rsi[:] = np.select([roll_down == 0, roll_up == 0, True], [100, 0, rsi])
    df["rsi"] = rsi
    return df


def bb(df, interval=20):
    """Bollinger bands"""
    simple_ma = sma(df, interval=interval)["sma"]
    std = df["Price"].rolling(interval).std()
    bollinger_up = simple_ma + std * 2
    bollinger_down = simple_ma - std * 2
    df["Bollinger_up"] = bollinger_up
    df["Bollinger_down"] = bollinger_down
    return df


def cci(df, n=20):
    typical_price = (df["High"] + df["Low"] + df["Price"]) / 3
    df["cci"] = (typical_price - typical_price.rolling(n).mean()) / (0.015 * typical_price.rolling(n).std())
    return df


def process(df):
    df = sma(df)
    df = ema(df)
    df = cma(df)
    df = macd(df)
    df = roc(df)
    df = rsi(df)
    df = bb(df)
    df = cci(df)
    return df