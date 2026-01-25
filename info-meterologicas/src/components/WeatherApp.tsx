/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from 'react';
import ReactCountryFlag from "react-country-flag";
import { Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import HistoryModal from './HistoryModal';
import ConfigModal from './ConfigModal';
import VoiceSearchModal from './VoiceSearchModal';
import WeatherDetails from './WeatherDetails';
import WeatherForecast from './WeatherForecast';
import InteractiveMap from './InteractiveMap';
import Clock from './Clock';
import TemperatureChart from './TemperatureChart';
import SolarCycle from './SolarCycle';
import MoonPhase from './MoonPhase';

// Store
import { useWeatherStore } from '../store/weatherStore';

// Hooks
import useVoiceSearch from '../hooks/useVoiceSearch';

// Utils
import { BRAZILIAN_CAPITALS } from '../constants/cities';

// Styles
import '../styles/index.css';

const WeatherApp: React.FC = () => {
    // Store State and Actions
    const { 
        weatherData, 
        loading, 
        error, 
        hourlyForecast, 
        dailyForecast, 
        airQuality, 
        backgroundImageUrl, 
        theme,
        searchHistory,
        isAutoUpdateEnabled,
        fetchWeatherData,
        clearHistory,
        removeFromHistory
    } = useWeatherStore();

    // Local UI State
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [showConfig, setShowConfig] = useState<boolean>(false);
    const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
    const [citySearchInput, setCitySearchInput] = useState<string>('');

    // Handlers
    const openHistoryModal = () => setShowHistory(true);
    const closeHistoryModal = () => setShowHistory(false);
    const handleShowConfig = () => setShowConfig(true);
    const handleCloseConfig = () => setShowConfig(false);

    const handleSelectCity = (city: string) => {
        closeHistoryModal();
        setCitySearchInput(city);
        fetchWeatherData({ city });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (citySearchInput) {
            fetchWeatherData({ city: citySearchInput });
        }
    };

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData({ lat: latitude, lon: longitude });
                    setCitySearchInput('');
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                    alert("Não foi possível obter sua localização. Verifique se as permissões estão ativadas.");
                }
            );
        } else {
            alert("Seu navegador não suporta geolocalização.");
        }
    };

    // Voice Search Handler
    const handleVoiceResult = React.useCallback((transcript: string) => {
        // Strip punctuation (optional, but good for search)
        const cleanTranscript = transcript.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
        setCitySearchInput(cleanTranscript);
        setShowVoiceModal(false);
        fetchWeatherData({ city: cleanTranscript });
    }, [fetchWeatherData]);

    const handleVoiceError = React.useCallback((err: string) => {
        console.error("Voice search error:", err);
    }, []);

    const { 
        isListening, 
        transcript, 
        startListening, 
        stopListening, 
        error: voiceError 
    } = useVoiceSearch({
        onResult: handleVoiceResult,
        onError: handleVoiceError
    });

    const handleVoiceClick = () => {
        setShowVoiceModal(true);
        startListening();
    };

    const handleCloseVoiceModal = () => {
        stopListening();
        setShowVoiceModal(false);
    };

    // Auto Update Effect
    // Checks every 15 minutes if auto-update is enabled and refreshes data
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        if (isAutoUpdateEnabled && weatherData) {
            console.log("Auto-update enabled. Scheduled for 15 minutes.");
            intervalId = setInterval(() => {
                 console.log("Triggering auto-update...");
                 // Re-fetch using current coordinates to get latest data
                 fetchWeatherData({ lat: weatherData.coord.lat, lon: weatherData.coord.lon });
            }, 15 * 60 * 1000); // 15 minutes
        }

        return () => {
             if (intervalId) clearInterval(intervalId);
        };
    }, [isAutoUpdateEnabled, weatherData, fetchWeatherData]);

    // Initial Load (Geolocation)
    // Tries to get user location immediately on mount
    useEffect(() => {
        // If we already have data, don't trigger automatic fetch again 
        // (e.g. if returning from another page/modal state)
        if (weatherData) return;

        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            console.log("Localização obtida com sucesso:", latitude, longitude);
            fetchWeatherData({ lat: latitude, lon: longitude });
        };

        const handleError = (error: GeolocationPositionError) => {
            console.warn("Erro ou permissão negada para localização:", error.message);
            // Fallback to a random capital if geolocation is not available
            const randomCity = BRAZILIAN_CAPITALS[Math.floor(Math.random() * BRAZILIAN_CAPITALS.length)];
            fetchWeatherData({ city: randomCity })
                .then(() => setCitySearchInput(randomCity))
                .catch((err) => console.error("Erro no fallback de cidade:", err));
        };

        if (navigator.geolocation) {
            // Options for high accuracy and timeout
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            handleError({ code: 0, message: "Geolocalização não suportada", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

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

    // Resolvendo tema visual para o CSS
    const getVisualTheme = () => {
        if (theme !== 'automatico') return theme;
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'manha';
        if (hour >= 12 && hour < 18) return 'tarde';
        return 'noite';
    };

    const visualTheme = getVisualTheme();

    return (
        <div
            className={`weather-container ${visualTheme}`}
            style={{
                backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'linear-gradient(to top, #6a85b6 0%, #bac8e0 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <i className="bi bi-gear-fill gear-icon" onClick={handleShowConfig}></i>
            <motion.div 
                className="glass-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {loading && <p>Carregando...</p>}
                {error && <p className="text-danger">{error}</p>}
                
                <AnimatePresence>
                {weatherData && (
                    <motion.div 
                         key="content"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         style={{ width: '100%' }}
                    >
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
                            <motion.div 
                                className="glass-card details-card"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <h2>Detalhes do Clima</h2>
                                <WeatherDetails data={weatherData} />
                            </motion.div>

                            <div className="glass-card forecast-card">
                                <h2>Previsão</h2>
                                <WeatherForecast hourlyData={hourlyForecast} dailyData={dailyForecast} />
                            </div>
                        </div>

                        {/* Chart Card */}
                        <div className="glass-card chart-card-full mb-4">
                            <TemperatureChart data={hourlyForecast} visualTheme={visualTheme} />
                        </div>

                        <div className="content-grid-wrapper">
                            <div className="glass-card">
                                <SolarCycle 
                                    sunrise={weatherData.sys.sunrise} 
                                    sunset={weatherData.sys.sunset} 
                                />
                            </div>
                            <div className="glass-card">
                                <MoonPhase />
                            </div>
                        </div>

                        <div className="content-grid-wrapper">
                            <div className="glass-card map-card-full">
                                <InteractiveMap lat={weatherData.coord.lat} lon={weatherData.coord.lon} />
                            </div>
                            
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
                    </motion.div>
                )}
                </AnimatePresence>

                <form onSubmit={handleSearch} className="glass-search-bar mt-4">
                    <input
                        type="text"
                        id="city-search"
                        placeholder="Digite outro local..."
                        className="glass-input"
                        value={citySearchInput}
                        onChange={(e) => setCitySearchInput(e.target.value)}
                    />
                    <div className="search-actions">
                        <button type="button" className="glass-button" onClick={handleVoiceClick} title="Pesquisa por voz">
                            <i className="bi bi-mic p-2"></i>
                        </button>
                        <button type="submit" className="glass-button">
                            <i className="bi bi-search icon-color"></i>
                        </button>
                    </div>
                </form>

                <div className="d-flex justify-content-center gap-2 mt-3">
                    <Button className="btn btn-secondary glass-btn" onClick={handleLocationClick}>
                        <i className="bi bi-geo-alt-fill"></i> Localização Atual
                    </Button>
                    <Button className="btn btn-secondary glass-btn" onClick={openHistoryModal}>
                        <i className="bi bi-clock-history"></i> Histórico
                    </Button>
                    <Button className="btn btn-secondary glass-btn" onClick={handleShowConfig}>
                        <i className="bi bi-gear-fill"></i> Config
                    </Button>
                </div>
            </motion.div>

            <HistoryModal
                show={showHistory}
                handleClose={closeHistoryModal}
                history={searchHistory}
                onClearHistory={clearHistory}
                onSelectCity={handleSelectCity}
                onRemoveSelected={removeFromHistory}
            />
            <ConfigModal 
                show={showConfig} 
                handleClose={handleCloseConfig} 
            />
            <VoiceSearchModal
                show={showVoiceModal}
                onHide={handleCloseVoiceModal}
                transcript={transcript}
                isListening={isListening}
                error={voiceError}
                onRetry={startListening}
            />
        </div>
    );
};

export default WeatherApp;