from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import pickle
from preprocess import preprocess_text
from sentiment import predict_sentiment

# Load trained model, vectorizer, and encoder
with open("models/sentiment_model.pkl", "rb") as f:
    model, vectorizer, encoder = pickle.load(f)

app = FastAPI(title="Customer Experience Analytics Dashboard")

class Feedback(BaseModel):
    text: str

@app.post("/analyze/")
def analyze_feedback(feedback: Feedback):
    """
    Takes customer feedback, predicts sentiment, and summarizes text (simple version).
    """
    # Preprocess and predict sentiment
    processed_text = preprocess_text(feedback.text)
    sentiment = predict_sentiment(processed_text, model, vectorizer, encoder)

    # Simple summary = truncate feedback (you can enhance later)
    summary = feedback.text.split(".")[0]

    return {"feedback": feedback.text, "sentiment": sentiment, "summary": summary}


@app.get("/dataset/")
def get_dataset():
    """
    Returns dataset feedback with predicted sentiments for dashboard.
    """
    df = pd.read_csv("../dataset/feedback.csv")
    df["processed"] = df["feedback"].apply(preprocess_text)
    df["sentiment"] = df["processed"].apply(lambda x: predict_sentiment(x, model, vectorizer, encoder))
    return df.to_dict(orient="records")
