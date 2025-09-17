import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch dataset from FastAPI backend
    axios
      .get("http://127.0.0.1:8000/dataset/")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching dataset:", err));
  }, []);

  return (
    <div>
      <h2>Feedback Dashboard</h2>
      <table border="1" cellPadding="8" style={{ margin: "auto" }}>
        <thead>
          <tr>
            <th>Feedback</th>
            <th>Processed Text</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.feedback}</td>
              <td>{row.processed}</td>
              <td>{row.sentiment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
