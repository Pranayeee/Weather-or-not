import React, { useEffect, useState } from "react";
import "../css/Weather.css"
import "bootstrap/dist/css/bootstrap.min.css";
import clearIcon from "../assets/1.png";
import cloudyIcon from "../assets/2.png";
import drizzleIcon from "../assets/3.png";
import rainIcon from "../assets/4.png";
import snowIcon from "../assets/5.png";
import "../css/WeatherAnimation.css";

const Weather = () => {
  const [city, setCity] = useState("Mumbai");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to match weather conditions with your custom icons
  const getWeatherIcon = (condition) => {
    if (!condition) return clearIcon;
    
    const weatherCondition = condition.toLowerCase();
    
    if (weatherCondition.includes("clear") || weatherCondition.includes("sunny")) {
      return clearIcon;
    }
    if (weatherCondition.includes("cloud")) {
      return cloudyIcon;
    }
    if (weatherCondition.includes("drizzle") || weatherCondition.includes("mist")) {
      return drizzleIcon;
    }
    if (weatherCondition.includes("rain") || weatherCondition.includes("shower")) {
      return rainIcon;
    }
    if (weatherCondition.includes("snow") || weatherCondition.includes("ice")) {
      return snowIcon;
    }
    return clearIcon;
  };

  const search = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const apiUrl = encodeURIComponent(
        `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${cityName}`
      );
      
      const response = await fetch(proxyUrl + apiUrl);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      
      // Parse the contents from the proxy response
      const weatherData = JSON.parse(data.contents);
      
      if (weatherData.error) {
        throw new Error(weatherData.error.message);
      }
      
      setWeatherData({
        city: weatherData.location.name,
        country: weatherData.location.country,
        temperature: `${weatherData.current.temp_c}°C`,
        condition: weatherData.current.condition.text,
        humidity: weatherData.current.humidity,
        wind: weatherData.current.wind_kph,
        icon: weatherData.current.condition.icon
      });
    } catch (error) {
      setError(error.message || "Could not fetch weather data. Please try another city.");
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      search(city);
    }
  };

  useEffect(() => { 
    search(city);
  }, []);

  return (
    <div className="weather">
      <form onSubmit={handleSubmit} className="search-bar">
        <input 
         id="search"
          type="text" 
          placeholder="Search for a city..." 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
             
              className="bi bi-search"
              viewBox="0 0 16 16" 
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          )}
        </button>
      </form>

      {loading && <div className="loading">Loading weather data...</div>}
      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={() => setError(null)} className="close-btn">
            &times;
          </button>
        </div>
      )}

      {weatherData && !error && (
        <div className="weather-container">
          <div className="weather-icon">
            <img 
              src={getWeatherIcon(weatherData.condition)} 
              alt={weatherData.condition} 
              className="weather-img"
            />
          </div>
          
          <div className="weather-info">
            <h1 className="temperature">{weatherData.temperature}</h1>
            <h1 className="location">
              {weatherData.city}, {weatherData.country}
            </h1>
            <div className="condition">{weatherData.condition}</div>
          </div>



          <div className="weather-details">
            <div className="detail">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z"/>
              </svg>
              <span>{weatherData.humidity}% Humidity</span>
            </div>
            
            <div className="detail">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5m-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2M0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5"/>
              </svg>
              <span>{weatherData.wind} km/h Wind</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;