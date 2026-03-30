"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useState } from "react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIngest = async () => {
    setStatus("Loading repo...");

    await fetch(`${API_URL}/api/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo_url: repoUrl }),
    });

    setStatus("Repo ready ✅");
  };

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");

    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        
        <h1 className="text-2xl font-bold mb-4 text-center">
          AI Codebase Assistant 🚀
        </h1>

        {/* Repo Input */}
        <input
          className="w-full border border-gray-300 p-3 rounded-lg mb-2"
          placeholder="Paste GitHub repo URL..."
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />

        <button
          onClick={handleIngest}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Ingest Repo
        </button>

        <p className="text-sm mt-2 text-gray-600">{status}</p>

        {/* Query Input */}
        <input
          className="w-full border border-gray-300 p-3 rounded-lg mt-4"
          placeholder="Ask about the code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleAsk}
          className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>

        {/* Answer */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">
          {loading ? "Generating answer..." : answer || "Answer will appear here..."}
        </div>

      </div>
    </div>
  );
}