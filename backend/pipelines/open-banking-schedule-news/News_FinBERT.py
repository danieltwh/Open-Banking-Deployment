import pandas as pd
import numpy as np
import tensorflow as tf
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer
from datasets import Dataset
import os
import boto3

tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")

aws_id = os.environ['AWS_ACCESS_KEY_ID']
aws_key = os.environ['AWS_SECRET_ACCESS_KEY']
bucket_name = os.environ['S3_BUCKET_NAME']

client = boto3.client(
    's3',
    aws_access_key_id = aws_id,
    aws_secret_access_key = aws_key,
    region_name = 'us-east-1'
)

files = client.list_objects_v2(Bucket=bucket_name)
for file in files['Contents']:
    client.download_file(bucket_name, file['Key'], file['Key'])

MODEL_PATH = ("results/models/FinBERT_v1.0")
trained_bert = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

def evaluation(eval_preds):
    logits, labels = eval_preds
    preds = np.argmax(logits, axis=-1)
    return {'accuracy': accuracy_score(labels, preds)}

def tokenize(examples):
    return tokenizer(examples['text'], truncation=True)

def predict(df):
    test_titles = df.title
    test_ds_raw = Dataset.from_dict({'text': test_titles})
    test_ds = test_ds_raw.map(tokenize, batched=False)
    trained_model = Trainer(trained_bert,tokenizer=tokenizer,)
    output = trained_model.predict(test_dataset=test_ds)
    preds = [np.argmax(i) for i in output.predictions]
    df['preds'] = preds
    df.loc[df["preds"] == 1, "preds"] = -1
    df.loc[df["preds"] == 0, "preds"] = 1
    df.loc[df["preds"] == 2, "preds"] = 0
    return df
