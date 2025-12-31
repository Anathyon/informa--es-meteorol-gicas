// src/components/WeatherForecast.tsx

import type { HourlyForecastData, DailyForecastData } from '../types';

interface WeatherForecastProps {
    hourlyData: HourlyForecastData[];
    dailyData: DailyForecastData[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ hourlyData, dailyData }) => {
    return (
        <div className="forecast-layout">
            {/* Seção de Previsão por Horas */}
            <div className="hourly-forecast-row">
                {hourlyData.map((item, index) => (
                    <div key={index} className="forecast-item">
                        <span className="forecast-time">{item.time}</span>
                        <img src={`https://openweathermap.org/img/wn/${item.icon}.png`} alt="Ícone do clima" />
                        <span className="forecast-temp">{Math.round(item.temp)}°</span>
                    </div>
                ))}
            </div>

            {/* Seção de Previsão para 7 Dias (um card grande abaixo) */}
            <div className="daily-forecast-card">
                <h2>Previsão para 7 Dias</h2>
                <div className="daily-forecast-row">
                    {dailyData.map((item, index) => (
                        <div key={index} className="daily-forecast-item">
                            <span className="daily-day">{item.day}</span>
                            <img src={`https://openweathermap.org/img/wn/${item.icon}.png`} alt="Ícone do clima" />
                            <span className="daily-temp">{Math.round(item.temp)}°</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeatherForecast;