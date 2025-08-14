import { useState, FormEvent } from 'react';
import './App.css'; 
import axios from 'axios';

interface WeatherData {
  location: {
    name: string,
    country: string,
  };
  current: {
    temperature: number,
    weather_descriptions: string[],
    weather_icons: string[],
    wind_speed: number,
    humidity: number,
    pressure: number,
  }
}

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (e: FormEvent) => {
    e.preventDefault();
    if (!city) {
      setError('Please enter the name of city')
      return
    };
    setLoading(false);
    setError(null);
    setWeatherData(null);

    try {
      const response = await axios.post<WeatherData>('/api/weather/', {name: city})
      const data = response.data

      if (!data) {
        throw new Error("Cannot find the weather")
      }

      setWeatherData(data)

    } catch(err) {
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data?.detail || "something went wrong"
        setError(serverError)
        setLoading(false)
      } else {
        setError("Unknown error")
      };
    };
  };

  return(
    <div className="container">
      <h1>Weather Report</h1>
      <form onSubmit={fetchWeather} className='weather-form'>
        <input
          onChange={(e) => setCity(e.target.value)}
          placeholder='Enter the name of city'
          value={city}
          type='text'
          disabled={loading}
        />
      </form>

      {error && <div className="error">{error}</div>}

            {weatherData && (
        <div className="weather-info">
            <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
            <p>Temperature: {weatherData.current.temperature}°C</p>
            <p>Description: {weatherData.current.weather_descriptions.join(', ')}</p>
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Wind Speed: {weatherData.current.wind_speed} km/h</p>
            <p>Pressure: {weatherData.current.pressure} mb</p>
        </div>
      )}
    </div>
  );
};

export default App