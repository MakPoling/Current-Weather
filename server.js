const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/location", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Location error:", err);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${process.env.API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Weather error:", err);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
