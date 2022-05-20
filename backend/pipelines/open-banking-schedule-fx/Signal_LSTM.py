import sys
import os
import math

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import tensorflow as tf

from joblib import dump, load

from sklearn.metrics import accuracy_score


def load_model(path):
    loaded_scaler = load(os.path.join(path, "scaler.save"))
    loaded_model = tf.keras.models.load_model(path)
    return loaded_scaler, loaded_model


def lstm_data_transform(x_data, num_steps=3):
    """ Changes data to the format for LSTM training for sliding window approach """
    # Prepare the list for the transformed data
    X, y = list(), list()
    # Loop of the entire data set
    # for i in range(x_data.shape[0]):

    for i in range(x_data.shape[0]):
        # compute a new (sliding window) index
        end_ix = i + num_steps
        # if index is larger than the size of the dataset, we stop
        if end_ix > x_data.shape[0]:
            break
        # Get a sequence of data for x
        seq_X = x_data[i:end_ix]

        # Append the list with sequencies
        X.append(seq_X)

    # Make final arrays
    x_array = np.array(X)

    return x_array

def predict(df, path):
    # features = df.drop(labels =  ["Date", "Price", "Open", "High", "Low"], axis=1)
    df["Bollinger"] = (df["Price"] - df["sma"]) / (df["Bollinger_up"] - df["Bollinger_down"])
    df["price_sma"] = df["Price"]  - df["sma"]
    df["price_ema"] = df["Price"] - df["ema"]

    features = df[["macd", "roc", "rsi", "cci", 
    "Bollinger", "price_sma", "price_ema", "Momentum"]]
    features = features.dropna(axis=0)

    NUM_STEPS = 15

    scaler, model = load_model(path)

    X = scaler.transform(features)
    X = lstm_data_transform(X, num_steps=NUM_STEPS)

    pred = model.predict(X)
    y = np.argmax(pred, axis=1)
    
    # Fill the results in the dataframe
    df2 = df.copy()
    df2["Pred"] = np.nan
    num_pred = len(y)
    df2.loc[df2.index[-num_pred]:, "Pred"] = y 

    return df2


if __name__ == "__main__":
    # Set the path to the model directory
    PATH_TO_LOAD = "../results/models/Signal_LSTM_v3.7"

    df = pd.read_csv("../data/processed/oanda_backtest_data_labelled_v1.csv")
    # df = pd.read_csv("../data/processed/signalEUR_USD_Labelled_v4_processed.csv")

    
    df["Date"] = pd.to_datetime(df["Date"])

    # test_df = df.iloc[-462 - 5:]
    test_df = df

    # Call predict on the dataframe. Set the path to model directory
    result_df = predict(test_df, path = PATH_TO_LOAD)
    
    # For testing
    temp = result_df[["Pred", "label"]].dropna()
    pred_in_result_df = temp["Pred"]
    actual_labels = temp["label"]
    print(accuracy_score(actual_labels, pred_in_result_df))  # Should print out 0.84698




    






