const axios = require('axios');

const cache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in ms

async function getWeather(location) {
  const now = Date.now();

  // If in cache and valid
  if (cache[location] && now - cache[location].timestamp < CACHE_DURATION) {
    return cache[location].data;
  }

  // Get weather data from Open-Meteo
  try {
    const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`);
    const place = geoRes.data.results?.[0];

    if (!place) throw new Error('Location not found');

    const { latitude, longitude } = place;

    const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude,
        longitude,
        current_weather: true,
      },
    });

    const weatherData = weatherRes.data.current_weather;

    // Save to cache
    cache[location] = {
      data: weatherData,
      timestamp: now,
    };

    return weatherData;
  } catch (err) {
    console.error('Error retrieving weather data:', err.message);
    throw err;
  }
}

module.exports = { getWeather };
