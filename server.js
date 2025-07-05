const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const API_KEY = process.env.API_KEY;

app.use(express.static(path.join(__dirname, 'public')));

// Location endpoint
app.get('/api/location', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Location error:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

// Weather endpoint
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
