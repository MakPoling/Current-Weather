/*
    JavaScript Current Weather Web Application - Displays current weather
    conditions and a 6-day future forecast based on the user's geolocation
    using OpenWeather API

    - Mak Poling

*/

"use strict";

// Initializes DOM elements
document.addEventListener("DOMContentLoaded", () => {
  const timeEl = document.getElementById("time");
  const ampmEl = document.getElementById("am-pm");
  const dateEl = document.getElementById("date");
  const locationEl = document.getElementById("location");

  const currentConditionsEl = document.querySelector(".current-conditions");
  const currentTempEl = document.querySelector(".current-temp");
  const highTempEl = document.querySelector(".high-low .temp:nth-child(1)");
  const lowTempEl = document.querySelector(".high-low .temp:nth-child(2)");
  const humidityEl = document.querySelector("#other-currents > .other-currents:nth-child(1) > div");
  const pressureEl = document.querySelector("#other-currents > .other-currents:nth-child(2) > div");
  const windSpeedEl = document.querySelector("#other-currents > .other-currents:nth-child(3) > div");
  const sunriseEl = document.querySelector("#sunrise-sunset > .other-currents:nth-child(1) > div");
  const sunsetEl = document.querySelector("#sunrise-sunset > .other-currents:nth-child(2) > div");

  const forecastItems = document.querySelectorAll(".weather-forecast-item");

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Retrieves date (weekday, month, day, and year)
  function updateDate() {
    const now = new Date();
    const weekday = days[now.getDay()];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    // Update HTML content to display the date
    if (window.innerWidth <= 600) {
      dateEl.innerHTML = `<div class="weekday">${weekday}</div><div class="rest-date">${month} ${day}, ${year}</div>`;
    } else {
      dateEl.textContent = `${weekday}, ${month} ${day}, ${year}`;
    }
  }

  // Gets the time and date in hours and minutes
  setInterval(() => {
    const now = new Date();
    let hour = now.getHours();
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Update HTML content to display the current time
    timeEl.childNodes[0].nodeValue = `${hour}:${minutes} `;
    ampmEl.textContent = ampm;

    updateDate();
  }, 1000);

  // Display a message to the user if their geolocation is not supported
  function getWeatherData() {
    if (!navigator.geolocation) {
      locationEl.textContent = "Geolocation not supported";
      return;
    }

    // Fetches the user's current geolocation (latitude and longitude)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;

        fetch(`/api/location?lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            if (data[0]) {
              const { name, state, country } = data[0];
              locationEl.textContent = `${name}, ${state || country}`;
            }
          })
          // Display message to user if their geolocation is unavailable
          .catch(() => locationEl.textContent = "Location unavailable");

        fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            if (data.current && data.daily) {
              updateTodayWeather(data.current, data.daily[0]);
              updateForecast(data.daily.slice(1, 7));
            }
          })
          // Display message to user if the weather data cannot be fetched
          .catch(() => console.error("Weather fetch failed"));
      },
      () => {
        // Default to the New York location 
        locationEl.textContent = "Defaulting to New York, NY";
        fetch(`/api/weather?lat=40.7128&lon=-74.0060`)
          .then(res => res.json())
          .then(data => {
            if (data.current && data.daily) {
              updateTodayWeather(data.current, data.daily[0]);
              updateForecast(data.daily.slice(1, 7));
            }
          });
      }
    );
  }

  // Update the current condition HTML elements with data from API
  function updateTodayWeather(current, today) {
    currentConditionsEl.textContent = capitalizeWords(current.weather[0].description);
    currentTempEl.textContent = `${Math.round(current.temp)}° F`;
    highTempEl.textContent = `High: ${Math.round(today.temp.max)}° F`;
    lowTempEl.textContent = `Low: ${Math.round(today.temp.min)}° F`;
    humidityEl.textContent = `Humidity: ${current.humidity}%`;
    pressureEl.textContent = `Pressure: ${current.pressure} hPa`;
    windSpeedEl.textContent = `Wind Speed: ${Math.round(current.wind_speed)} mph`;
    sunriseEl.textContent = `Sunrise: ${moment.unix(current.sunrise).format("h:mm a")}`;
    sunsetEl.textContent = `Sunset: ${moment.unix(current.sunset).format("h:mm a")}`;
  }

  // Update 6-day forecast elements with data from the API
  function updateForecast(daily) {
    daily.forEach((day, i) => {
      if (forecastItems[i]) {
        forecastItems[i].querySelector(".day").textContent = moment.unix(day.dt).format("dddd");
        forecastItems[i].querySelector(".w-icon").src = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        forecastItems[i].querySelector(".w-icon").alt = day.weather[0].description;
        const temps = forecastItems[i].querySelectorAll(".temp");
        temps[0].textContent = `High: ${Math.round(day.temp.max)}° F`;
        temps[1].textContent = `Low: ${Math.round(day.temp.min)}° F`;
      }
    });
  }

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
  }

  getWeatherData();
  window.addEventListener("resize", updateDate);
});
