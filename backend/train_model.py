import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
from preprocess import preprocess_text

# Load dataset
df = pd.read_csv("../dataset/feedback.csv")

# Preprocess text
df["processed"] = df["feedback"].apply(preprocess_text)

# Encode labels
encoder = LabelEncoder()
y = encoder.fit_transform(df["sentiment"])

# Stratified train-test split (to keep balance in train/test)
X_train, X_test, y_train, y_test = train_test_split(
    df["processed"], y, test_size=0.2, random_state=42, stratify=y
)

# Vectorize text
vectorizer = TfidfVectorizer()
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# Accuracy
print("Training Accuracy:", model.score(X_train_vec, y_train))
print("Test Accuracy:", model.score(X_test_vec, y_test))

# Detailed metrics
print("\nClassification Report:")
print(classification_report(y_test, model.predict(X_test_vec), target_names=encoder.classes_))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, model.predict(X_test_vec)))

# Save model, vectorizer, and encoder
with open("models/sentiment_model.pkl", "wb") as f:
    pickle.dump((model, vectorizer, encoder), f)

print("✅ Model + vectorizer + encoder saved to models/sentiment_model.pkl")
