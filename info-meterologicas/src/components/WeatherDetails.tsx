import React from 'react';
import type { WeatherData } from './WeatherApp';

interface WeatherDetailsProps {
    data: WeatherData;
}

const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
    return (
        <div className="weather-details-card">
            <div className="top-details">
                <div className="main-description">
                    <h3 className="text-capitalize">{data.weather[0].description}</h3>
                    <p className="sensation">Sensação: {Math.round(data.main.feels_like)}°C</p>
                </div>
                <div className="additional-details">
                    <div className="detail-item">
                        <i className="bi bi-droplet-half"></i>
                        <span>{data.main.humidity}%</span>
                    </div>
                    <div className="detail-item">
                        <i className="bi bi-wind"></i>
                        <span>{Math.round(data.wind.speed * 3.6)} km/h</span> 
                    </div>
                    <div className="detail-item">
                        <i className="bi bi-eye"></i>
                        <span>{(data.visibility / 1000).toFixed(1)} km</span>
                    </div>
                </div>
            </div>

            <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

            <div className="mini-cards-row">
                <div className="mini-card">
                    <i className="bi bi-thermometer-half"></i>
                    <span className="mini-card-label">Min/Máx</span>
                    <span className="mini-card-value">{Math.round(data.main.temp_min)}° / {Math.round(data.main.temp_max)}°</span>
                </div>
                <div className="mini-card">
                    <i className="bi bi-speedometer"></i>
                    <span className="mini-card-label">Pressão</span>
                    <span className="mini-card-value">{data.main.pressure} hPa</span>
                </div>
                <div className="mini-card">
                    <i className="bi bi-brightness-high"></i>
                    <span className="mini-card-label">Nascer do Sol</span>
                    <span className="mini-card-value">{formatTime(data.sys.sunrise)}</span>
                </div>
                <div className="mini-card">
                    <i className="bi bi-moon"></i>
                    <span className="mini-card-label">Pôr do Sol</span>
                    <span className="mini-card-value">{formatTime(data.sys.sunset)}</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherDetails;