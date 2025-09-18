// frontend/src/api.ts
const API_URL = "http://127.0.0.1:8000/dataset/";

export async function fetchDataset() {
  const res = await fetch(API_URL);
  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    console.error("Failed to parse /dataset/ JSON:", e, await res.text());
    return [];
  }

  console.clear();
  console.log("Raw backend dataset length:", Array.isArray(data) ? data.length : "NOT AN ARRAY", data);

  if (!Array.isArray(data)) {
    console.error("Backend did not return an array. Response:", data);
    return [];
  }

  const badRows: any[] = [];
  const mapped = data.map((item: any, idx: number) => {
    // invalid row guard
    if (!item || typeof item !== "object") {
      badRows.push({ idx, reason: "not-an-object", item });
      return null;
    }

    // ensure predicted_sentiment exists and is string-coercible
    const raw = item.predicted_sentiment;
    if (raw === undefined || raw === null) {
      badRows.push({ idx, reason: "missing-predicted_sentiment", item });
      return null;
    }

    const sentiment = String(raw).toLowerCase(); // safe now
    let rating = 3;
    if (sentiment === "positive") rating = 5;
    else if (sentiment === "negative") rating = 1;

    return {
      text: item.Feedback ?? "",
      sentiment,
      rating,
      __raw: item, // optional: keep original for debugging
    };
  }).filter(Boolean);

  if (badRows.length > 0) {
    console.warn(`Found ${badRows.length} bad rows — showing up to 20:`);
    console.table(badRows.slice(0, 20));
  }

  // return mapped (drop __raw if you want)
  return mapped;
}

export async function analyzeFeedback(text: string) {
  const res = await fetch("http://127.0.0.1:8000/analyze/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
