import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/download/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;

  try {
    // First call
    await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "YOUR_KEY",
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      },
    });

    // Wait 6 seconds
    await new Promise((resolve) => setTimeout(resolve, 6000));

    // Second call
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "your-api-key",
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      },
    });

    const data = await response.json();
    res.json({ title: data.title, link: data.link });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch MP3" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
