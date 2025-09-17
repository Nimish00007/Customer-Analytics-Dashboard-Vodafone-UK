import re
import nltk
from nltk.corpus import stopwords

# Download stopwords if not already present
nltk.download("stopwords")

def preprocess_text(text: str) -> str:
    """
    Preprocess text: lowercase, remove special chars,
    keep important negations like 'not', 'no', 'never'.
    """
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)  # keep only letters

    # Define stopwords
    stop_words = set(stopwords.words("english"))

    # Keep negation words
    negations = {"no", "not", "never"}
    stop_words = stop_words - negations

    # Tokenize and remove stopwords (except negations)
    tokens = [word for word in text.split() if word not in stop_words]

    return " ".join(tokens)
