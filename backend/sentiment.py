def predict_sentiment(text: str, model, vectorizer, encoder) -> str:
    """
    Predict sentiment (positive/negative/neutral).
    """
    X = vectorizer.transform([text])
    pred = model.predict(X)[0]
    sentiment = encoder.inverse_transform([pred])[0]
    return sentiment

