import React, { useState, useEffect } from "react";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaWind,
} from "react-icons/fa";
import axios from "axios";
import {
  nepaliDayNames,
  nepaliMonthNames,
  nepaliNumbers,
} from "@/utils/translations";
// Adjust the path according to your project structure

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        setWeather(weatherResponse.data);
        setLocation(weatherResponse.data.name);

        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        setForecast(
          forecastResponse.data.list
            .filter((entry: any, index: number) => index % 8 === 0)
            .slice(1, 4)
        );
        setLoading(false);
      } catch (error) {
        setError("मौसमको डाटा लोड गर्न असफल भयो।");
        setLoading(false);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          (error) => {
            setError("तपाईंको स्थान प्राप्त गर्न असफल भयो।");
            setLoading(false);
          }
        );
      } else {
        setError("यस ब्राउजरले भू-स्थान समर्थन गर्दैन।");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  if (loading)
    return <div className="text-center text-lg">मौसम लोड हुँदैछ...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (!weather) return null;

  const weatherIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return <FaSun className="text-yellow-500 animate-bounce" />;
      case "Clouds":
        return <FaCloud className="text-blue-200 animate-bounce" />;
      case "Rain":
        return <FaCloudRain className="text-blue-500 animate-bounce" />;
      case "Snow":
        return <FaSnowflake className="text-blue-300 animate-bounce" />;
      case "Wind":
        return <FaWind className="text-gray-400 animate-bounce" />;
      default:
        return <FaCloud className="text-blue-200 animate-bounce" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    const monthIndex = date.getMonth();

    // Format date using helper functions
    const nepaliDay = nepaliDayNames(dayIndex);
    const nepaliMonth = nepaliMonthNames(monthIndex);
    const dayNumber = nepaliNumbers(date.getDate());

    return `${nepaliDay}, ${dayNumber} ${nepaliMonth}`;
  };

  return (
    <div className="w-full bg-white rounded border p-6">
      <h2 className="text-lg font-medium mb-4">मौसम पूर्वानुमान</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="text-5xl">{weatherIcon(weather.weather[0].main)}</div>
        <div className="text-right">
          <div className="text-2xl font-medium">
            {nepaliNumbers(Math.round(weather.main.temp))}°C
          </div>
          <div className="capitalize text-gray-700">
            {weather.weather[0].description}
          </div>
        </div>
      </div>
      <div className="flex justify-between text-md text-gray-700 mb-4">
        <div>
          <strong>आर्द्रता:</strong> {nepaliNumbers(weather.main.humidity)}%
        </div>
        <div>
          <strong>हावा:</strong> {nepaliNumbers(Math.round(weather.wind.speed))}{" "}
          m/s
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        {forecast.map((day: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-green-50 rounded border hover:bg-green-100 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="text-xl">{weatherIcon(day.weather[0].main)}</div>
              <div className="flex flex-col">
                <div className="text-xs font-medium">
                  {formatDate(day.dt_txt)}
                </div>
                <div className="capitalize text-xs text-gray-600">
                  {day.weather[0].description}
                </div>
              </div>
            </div>
            <div className="">{nepaliNumbers(Math.round(day.main.temp))}°C</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
