// src/components/WeatherDetails.tsx

import React from 'react';

// Nova interface que espera um objeto 'data' com todas as propriedades
interface WeatherDetailsProps {
    data: {
        main: {
            temp_min: number;
            temp_max: number;
            pressure: number;
            humidity: number;
            feels_like: number;
        };
        wind: {
            speed: number;
        };
        sys: {
            sunrise: number;
            sunset: number;
        };
        weather: [{
            description: string;
        }];
        visibility: number;
    };
}

const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
    // Desestruturando o objeto 'data' para facilitar o uso
    const {
        main: { temp_min: minTemp, temp_max: maxTemp, pressure, humidity, feels_like: feelsLike },
        wind: { speed: windSpeed },
        sys: { sunrise, sunset },
        weather,
        visibility
    } = data;

    const description = weather[0].description;

    return (
        <div className="weather-details-container">
            <div className="d-flex flex-column align-items-center mb-4">
                <h3 className="mb-0">{description}</h3>
                <p>Sensação: {Math.round(feelsLike)}°C</p>
            </div>
            
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <div className="details-card d-flex align-items-center gap-2">
                        <i className="bi bi-droplet-half details-card-icon"></i>
                        <div className="details-card-info">
                            <h4>Umidade</h4>
                            <p>{humidity}%</p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="details-card d-flex align-items-center gap-2">
                        <i className="bi bi-wind details-card-icon"></i>
                        <div className="details-card-info">
                            <h4>Velocidade do Vento</h4>
                            <p>{(windSpeed * 3.6).toFixed(1)} km/h</p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="details-card d-flex align-items-center gap-2">
                        <i className="bi bi-eye-fill details-card-icon"></i>
                        <div className="details-card-info">
                            <h4>Visibilidade</h4>
                            <p>{(visibility / 1000).toFixed(1)} km</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="row g-3">
                    <div className="col-6 col-sm-6 col-md-3">
                        <div className="info-card d-flex flex-column align-items-center text-center p-3">
                            <i className="bi bi-thermometer-half"></i>
                            <p>{Math.round(minTemp)}° / {Math.round(maxTemp)}°</p>
                            <span>Min/Máx</span>
                        </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-3">
                        <div className="info-card d-flex flex-column align-items-center text-center p-3">
                            <i className="bi bi-speedometer"></i>
                            <p>{pressure} hPa</p>
                            <span>Pressão</span>
                        </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-3">
                        <div className="info-card d-flex flex-column align-items-center text-center p-3">
                            <i className="bi bi-sunrise"></i>
                            <p>{formatTime(sunrise)}</p>
                            <span>Nascer do Sol</span>
                        </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-3">
                        <div className="info-card d-flex flex-column align-items-center text-center p-3">
                            <i className="bi bi-sunset"></i>
                            <p>{formatTime(sunset)}</p>
                            <span>Pôr do Sol</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherDetails;