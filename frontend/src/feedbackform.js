import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze/", {
        text: feedback,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing feedback:", error);
      setResult({ error: "Failed to analyze feedback. Check backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-form">
      <h2>Customer Feedback Analyzer</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          placeholder="Enter your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Feedback"}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>Result</h3>
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <>
              <p><strong>Feedback:</strong> {result.feedback}</p>
              <p><strong>Sentiment:</strong> {result.sentiment}</p>
              <p><strong>Summary:</strong> {result.summary}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
