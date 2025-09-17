import React from "react";
import "./App.css";
import FeedbackForm from "./feedbackform";
import Dashboard from "./dashboard";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer Experience Analytics Dashboard</h1>
        <p>Submit your feedback below:</p>
        <FeedbackForm />

        <hr style={{ margin: "20px 0" }} />

        <Dashboard />
      </header>
    </div>
  );
}

export default App;
