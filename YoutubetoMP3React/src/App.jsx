import { useState } from "react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [mp3Link, setMp3Link] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Extrae el video ID de URL o devuelve el mismo si ya es ID
  const getVideoId = (input) => {
    try {
      // Si es un ID simple (11 caracteres)
      if (input.length === 11) return input;

      // Si es una URL de YouTube
      const url = new URL(input);
      if (url.hostname.includes("youtube.com")) {
        return url.searchParams.get("v");
      } else if (url.hostname.includes("youtu.be")) {
        return url.pathname.slice(1);
      }
    } catch {
      return null;
    }
    return null;
  };

  const handleDownload = async () => {
    const videoId = getVideoId(input);
    if (!videoId) {
      setError("Please enter a valid YouTube URL or video ID.");
      return;
    }

    setLoading(true);
    setError("");
    setTitle("");
    setMp3Link("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/download/${videoId}`
      );
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      if (!data.link) throw new Error("MP3 link not ready");

      setTitle(data.title);
      setMp3Link(data.link);
    } catch (err) {
      setError("Failed to get MP3. Make sure the video ID is correct.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>YouTube to MP3 Downloader</h1>

      <input
        type="text"
        placeholder="Enter YouTube URL or video ID"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Processing..." : "Get MP3"}
      </button>

      {error && <p className="error">{error}</p>}

      {title && mp3Link && (
        <div className="result">
          <h2>{title}</h2>
          <a href={mp3Link} target="_blank" rel="noopener noreferrer">
            Download MP3
          </a>
        </div>
      )}
    </div>
  );
}
