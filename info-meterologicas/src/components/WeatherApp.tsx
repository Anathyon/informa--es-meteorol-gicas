/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from 'react';
import ReactCountryFlag from "react-country-flag";
import { Button } from 'react-bootstrap';

// Components
import HistoryModal from './HistoryModal';
import ConfigModal from './ConfigModal';
import WeatherDetails from './WeatherDetails';
import WeatherForecast from './WeatherForecast';
import InteractiveMap from './InteractiveMap';
import Clock from './Clock';

// Hooks
import { useWeather } from '../hooks/useWeather';
import { useWeatherHistory } from '../hooks/useWeatherHistory';
import { useTheme } from '../hooks/useTheme';

// Utils
import { BRAZILIAN_CAPITALS } from '../constants/cities';

const WeatherApp: React.FC = () => {
    // Hooks
    const { 
        data: weatherData, 
        loading, 
        error, 
        hourlyForecast, 
        dailyForecast, 
        airQuality, 
        backgroundImageUrl, 
        fetchWeatherData 
    } = useWeather();

    const { 
        searchHistory, 
        showHistory, 
        addToHistory, 
        clearHistory, 
        removeCityFromHistory, 
        openHistoryModal, 
        closeHistoryModal 
    } = useWeatherHistory();

    const { theme, setTheme } = useTheme();

    // Local state for UI
    const [showConfig, setShowConfig] = useState<boolean>(false);
    const [citySearchInput, setCitySearchInput] = useState<string>('');

    // Handlers
    const handleShowConfig = () => setShowConfig(true);
    const handleCloseConfig = () => setShowConfig(false);

    const handleSelectCity = (city: string) => {
        closeHistoryModal();
        setCitySearchInput(city);
        fetchWeatherData({ city }).then(() => addToHistory(city)).catch(() => {});
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (citySearchInput) {
            fetchWeatherData({ city: citySearchInput })
                .then((cityName) => addToHistory(cityName))
                .catch(() => {}); // Erro já tratado no hook
        }
    };

    // Helpers para UI de Qualidade do Ar
    const aqiDescription = (aqi: number): string => {
        const descriptions = ['Boa', 'Razoável', 'Moderada', 'Pobre', 'Muito Pobre'];
        return descriptions[aqi - 1] || 'N/A';
    };

    const getAqiColor = (aqi: number): string => {
        const colors = ['green', 'yellow', 'orange', 'red', 'purple'];
        return colors[aqi - 1] || 'gray';
    };

    const getTextColorByAqi = (aqi: number): string => aqi <= 2 ? 'black' : 'white';

    const formatarData = (timestamp: number): string => {
        const data = new Date(timestamp * 1000);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return data.toLocaleDateString('pt-BR', options);
    };

    // Initial Load (Geolocation)
    useEffect(() => {
        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData({ lat: latitude, lon: longitude })
                .then((cityName) => addToHistory(cityName));
        };

        const handleError = () => {
            console.log("Permissão de localização negada. Buscando cidade aleatória.");
            const randomCity = BRAZILIAN_CAPITALS[Math.floor(Math.random() * BRAZILIAN_CAPITALS.length)];
            fetchWeatherData({ city: randomCity }).then(() => setCitySearchInput(randomCity));
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        } else {
            handleError();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Executar apenas uma vez na montagem

    return (
        <div
            className={`weather-container ${theme}`}
            style={{
                backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'linear-gradient(to top, #6a85b6 0%, #bac8e0 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <i className="bi bi-gear-fill gear-icon" onClick={handleShowConfig}></i>
            <div className="glass-container">
                {loading && <p>Carregando...</p>}
                {error && <p className="text-danger">{error}</p>}
                
                {weatherData && (
                    <>
                        <div className="glass-card main-weather-card">
                            <div className="main-info">
                                <h1>
                                    {weatherData.name}, {weatherData.sys.country}
                                    <ReactCountryFlag
                                        countryCode={weatherData.sys.country}
                                        svg
                                        style={{ width: '2em', height: '1.5em', marginLeft: '10px' }}
                                        title={weatherData.sys.country}
                                    />
                                </h1>
                                <p>{formatarData(weatherData.dt)}</p>
                                
                                <Clock />

                                <div className="glass-temperature">
                                    {Math.round(weatherData.main.temp)}<span className="glass-temperature-small">°C</span>
                                    <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Clima" style={{ width: '80px', height: '80px', marginLeft: '20px' }} />
                                </div>
                            </div>
                        </div>

                        <div className="content-grid-wrapper">
                            <div className="glass-card details-card">
                                <h2>Detalhes do Clima</h2>
                                <WeatherDetails data={weatherData} />
                            </div>

                            <div className="glass-card forecast-card">
                                <WeatherForecast hourlyData={hourlyForecast} dailyData={dailyForecast} />
                            </div>
                        </div>
                    </>
                )}

                <div className="content-grid-wrapper">
                    {weatherData && (
                        <div className="glass-card map-card-full">
                            <InteractiveMap lat={weatherData.coord.lat} lon={weatherData.coord.lon} />
                        </div>
                    )}
                    
                    <div className="glass-card air-quality-card-full">
                        <h2>Qualidade do Ar</h2>
                        {airQuality ? (
                            <div className="air-quality-content-wrapper">
                                <div className="air-quality-left">
                                    <div className="aqi-circle" 
                                        style={{ 
                                            backgroundColor: getAqiColor(airQuality.aqi),
                                            color: getTextColorByAqi(airQuality.aqi)
                                        }}
                                    >
                                        <span>{airQuality.aqi}</span>
                                    </div>
                                    <p>{aqiDescription(airQuality.aqi)}</p>
                                </div>
                                <div className="air-quality-right">
                                    {airQuality.components && [
                                        { name: 'PM2.5', value: airQuality.components.pm2_5.toFixed(2) },
                                        { name: 'PM10', value: airQuality.components.pm10.toFixed(2) },
                                        { name: 'O₃', value: airQuality.components.o3.toFixed(2) },
                                        { name: 'CO', value: airQuality.components.co.toFixed(2) },
                                    ].map((component, index) => (
                                        <div key={index} className="air-quality-item">
                                            <span className="component-name">{component.name}</span>
                                            <span className="component-value">{component.value} µg/m³</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>Dados de qualidade do ar indisponíveis.</p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSearch} className="glass-search-bar mt-4">
                    <input
                        type="text"
                        id="city-search"
                        placeholder="Digite outro local..."
                        className="glass-input"
                        value={citySearchInput}
                        onChange={(e) => setCitySearchInput(e.target.value)}
                    />
                    <button type="submit" className="glass-button">
                        <i className="bi bi-search" style={{color:"#000"}}></i>
                    </button>
                </form>

                <div className="d-flex justify-content-center gap-2 mt-3">
                    <Button className="btn btn-secondary glass-btn" onClick={openHistoryModal}>
                        <i className="bi bi-clock-history"></i> Histórico
                    </Button>
                    <Button className="btn btn-secondary glass-btn" onClick={handleShowConfig}>
                        <i className="bi bi-gear-fill"></i> Config
                    </Button>
                </div>
            </div>

            <HistoryModal
                show={showHistory}
                handleClose={closeHistoryModal}
                history={searchHistory}
                onClearHistory={clearHistory}
                onSelectCity={handleSelectCity}
                onRemoveSelected={removeCityFromHistory}
            />
            <ConfigModal 
                show={showConfig} 
                handleClose={handleCloseConfig} 
                currentTheme={theme} 
                setAppTheme={setTheme} 
            />
        </div>
    );
};

export default WeatherApp;