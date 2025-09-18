from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os
from preprocess import preprocess_text
from sentiment import predict_sentiment

# Load trained model, vectorizer, and encoder
with open("models/sentiment_model.pkl", "rb") as f:
    model, vectorizer, encoder = pickle.load(f)

app = FastAPI(title="Customer Experience Analytics Dashboard")

# --- CORS setup ---
origins = [
    "http://localhost:5173",   # Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # or ["*"] for testing only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic model for input ---
class Feedback(BaseModel):
    text: str

# --- API routes ---
@app.post("/analyze/")
def analyze_feedback(feedback: Feedback):
    """
    Takes customer feedback, predicts sentiment, and summarizes text.
    """
    try:
        processed_text = preprocess_text(feedback.text)
        sentiment = predict_sentiment(processed_text, model, vectorizer, encoder)

        # Simple summary = first sentence
        summary = feedback.text.split(".")[0]

        return {"feedback": feedback.text, "sentiment": sentiment, "summary": summary}
    except Exception as e:
        return {"error": str(e)}

@app.get("/dataset/")
def get_dataset():
    """
    Returns dataset feedback with predicted sentiments for dashboard.
    """
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        DATASET_PATH = os.path.join(BASE_DIR, "..", "dataset", "vodafone_feedbacks.csv")

        df = pd.read_csv(DATASET_PATH)

        if "Feedback" not in df.columns:
            return {"error": f"CSV missing 'Feedback' column. Found: {list(df.columns)}"}

        # Keep original Sentiment column if present
        df["processed"] = df["Feedback"].apply(preprocess_text)
        df["predicted_sentiment"] = df["processed"].apply(
            lambda x: predict_sentiment(x, model, vectorizer, encoder)
        )

        return df.to_dict(orient="records")
    except Exception as e:
        return {"error": str(e)}
