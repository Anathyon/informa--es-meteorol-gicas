/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useCallback } from 'react';
import HistoryModal from './HistoryModal';
import ConfigModal from './ConfigModal';
import WeatherDetails from './WeatherDetails';
import WeatherForecast from './WeatherForecast';
import InteractiveMap from './InteractiveMap';
import ReactCountryFlag from "react-country-flag";
import { Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/index.css';

// Interfaces... (mantêm-se as mesmas)
export interface WeatherData {
name: string;
sys: {
    country: string;
    sunrise: number;
    sunset: number;
};
main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
};
weather: [{
    description: string;
    icon: string;
}];
wind: {
    speed: number;
};
visibility: number;
dt: number;
coord: {
    lat: number;
    lon: number;
};
}

export interface HourlyForecastData {
    time: string;
    temp: number;
    icon: string;
}

export interface DailyForecastData {
    day: string;
    temp: number;
    icon: string;
}

interface AirQualityAPIResponse {
coord: {
    lon: number;
    lat: number;
};
list: [{
main: {
    aqi: number;
};
components: {
    co: number;
    o3: number;
    pm2_5: number;
    pm10: number;
};
}];
}

export interface AirQualityData {
aqi: number;
components: {
   co: number;
   o3: number;
   pm2_5: number;
   pm10: number;
};
}

interface ForecastItem {
dt: number;
main: {
  temp: number;
};
weather: [{
  icon: string;
}];
}

const brazilianCapitals = [
'Rio Branco', 'Maceió', 'Macapá', 'Manaus', 'Salvador', 'Fortaleza', 'Brasília', 'Vitória', 'Goiânia',
'São Luís', 'Cuiabá', 'Campo Grande', 'Belo Horizonte', 'Belém', 'João Pessoa', 'Curitiba', 'Recife',
'Teresina', 'Rio de Janeiro', 'Natal', 'Porto Alegre', 'Porto Velho', 'Boa Vista', 'Florianópolis',
'São Paulo', 'Aracaju', 'Palmas'
];

const defaultCoords = {
lat: -23.5505,
lon: -46.6333,
};

const WeatherApp: React.FC = () => {
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [showConfig, setShowConfig] = useState<boolean>(false);
    const [cityName, setCityName] = useState<string>('São Paulo');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hours, setHours] = useState<string>('00');
    const [minutes, setMinutes] = useState<string>('00');
    const [seconds, setSeconds] = useState<string>('00');
    const [theme, setTheme] = useState<string>('automatico');
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData[]>([]);
    const [dailyForecast, setDailyForecast] = useState<DailyForecastData[]>([]);
    const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
    const [mapCoords, setMapCoords] = useState<{ lat: number; lon: number }>(defaultCoords);

    const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
    const unsplashApiKey = import.meta.env.VITE_UNSPLASH_API_KEY;

    const handleShowHistory = () => setShowHistory(true);
    const handleCloseHistory = () => setShowHistory(false);
    const handleShowConfig = () => setShowConfig(true);
    const handleCloseConfig = () => setShowConfig(false);
    
    const handleClearHistory = () => setSearchHistory([]);
    const handleRemoveSelected = (cityToRemove: string) => {
        setSearchHistory(prevHistory => prevHistory.filter(city => city !== cityToRemove));
    };
    const handleSelectCity = (city: string) => {
        handleCloseHistory();
        setCityName(city);
        fetchWeatherDataAndForecast({ city });
    };

    const formatarData = (timestamp: number): string => {
        const data = new Date(timestamp * 1000);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return data.toLocaleDateString('pt-BR', options);
    };

    const getThemeByTime = (): string => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'manha';
        if (hour >= 12 && hour < 18) return 'tarde';
        return 'noite';
    };
    
    const setAppTheme = useCallback((newTheme: string) => {
        if (newTheme === 'automatico') {
            setTheme(getThemeByTime());
        } else {
            setTheme(newTheme);
        }
    }, []);

    const fetchUnsplashImage = useCallback(async (query: string) => {
        if (!unsplashApiKey) {
            console.error('Chave de API do Unsplash não encontrada.');
            return;
        }
        const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashApiKey}&orientation=landscape&per_page=1`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok && data.results.length > 0) {
                setBackgroundImageUrl(data.results[0].urls.regular);
            } else {
                setBackgroundImageUrl(null);
                console.error('Nenhuma imagem encontrada para a cidade.');
            }
        } catch (err) {
            console.error('Erro ao buscar imagem no Unsplash:', err);
            setBackgroundImageUrl(null);
        }
    }, [unsplashApiKey]);

    const fetchWeatherDataAndForecast = useCallback(async (location: { city?: string; lat?: number; lon?: number }) => {
        setLoading(true);
        setError(null);

        try {
            const weatherQuery = location.city ? `q=${location.city}` : `lat=${location.lat}&lon=${location.lon}`;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${weatherQuery}&appid=${apiKey}&units=metric&lang=pt_br`;
            const weatherResponse = await fetch(weatherUrl);

            if (!weatherResponse.ok) {
                if (weatherResponse.status === 401) throw new Error('Chave de API inválida.');
                throw new Error('Localização não encontrada.');
            }

            const weatherData: WeatherData = await weatherResponse.json();
            setWeatherData(weatherData);
            setCityName(weatherData.name);
            setMapCoords({ lat: weatherData.coord.lat, lon: weatherData.coord.lon });
            setSearchHistory(prevHistory => {
                if (!prevHistory.includes(weatherData.name)) return [...prevHistory, weatherData.name];
                return prevHistory;
            });
            fetchUnsplashImage(weatherData.name);

            // Fetch forecast data
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${weatherData.name}&appid=${apiKey}&units=metric&lang=pt_br`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
            const newHourlyData = forecastData.list.slice(0, 5).map((item: ForecastItem) => ({
                time: new Date(item.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                temp: item.main.temp,
                icon: item.weather[0].icon,
            }));
            setHourlyForecast(newHourlyData);

            // Lógica para previsão diária (pode ser ajustada para buscar dados reais se necessário)
            const newDailyData = [
                { day: 'Ter.', temp: 23, icon: '02d' }, { day: 'Qua.', temp: 24, icon: '01d' },
                { day: 'Qui.', temp: 22, icon: '09d' }, { day: 'Sex.', temp: 25, icon: '01d' },
                { day: 'Sáb.', temp: 21, icon: '10d' }, { day: 'Dom.', temp: 20, icon: '04d' },
                { day: 'Seg.', temp: 23, icon: '03d' },
            ];
            setDailyForecast(newDailyData);

            // Fetch air quality data
            const airQualityResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`);
            if (airQualityResponse.ok) {
                const airQualityData: AirQualityAPIResponse = await airQualityResponse.json();
                if (airQualityData.list.length > 0) {
                    setAirQualityData({
                        aqi: airQualityData.list[0].main.aqi,
                        components: airQualityData.list[0].components,
                    });
                } else {
                    setAirQualityData(null);
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Ocorreu um erro desconhecido.');
        } finally {
            setLoading(false);
        }
    }, [apiKey, fetchUnsplashImage]);
    

    // O useEffect agora só busca a localização inicial do usuário
    // e o histórico salvo no localStorage na primeira renderização.
    useEffect(() => {
        const savedHistory = localStorage.getItem('weatherSearchHistory');
        if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDataAndForecast({ lat: latitude, lon: longitude });
        };

        const handleError = () => {
            console.log("Permissão de localização negada. Buscando cidade aleatória.");
            const randomCity = brazilianCapitals[Math.floor(Math.random() * brazilianCapitals.length)];
            fetchWeatherDataAndForecast({ city: randomCity });
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        } else {
            handleError();
        }
    }, [fetchWeatherDataAndForecast]);

    useEffect(() => {
        localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            
            setHours(h);
            setMinutes(m);
            setSeconds(s);
        };
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);
    
    useEffect(() => {
        const savedTheme = localStorage.getItem('appTheme');
        if (savedTheme) {
            setAppTheme(savedTheme);
        } else {
            setAppTheme('automatico');
        }
        
        const timer = setInterval(() => {
            const currentSavedTheme = localStorage.getItem('appTheme');
            if (currentSavedTheme === 'automatico') {
                setTheme(getThemeByTime());
            }
        }, 1000);
        
        return () => clearInterval(timer);
    }, [setAppTheme]);
    
    useEffect(() => {
        localStorage.setItem('appTheme', theme);
    }, [theme]);


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (cityName) fetchWeatherDataAndForecast({ city: cityName });
    };
    
    const aqiDescription = (aqi: number): string => {
        if (aqi === 1) return 'Boa';
        if (aqi === 2) return 'Razoável';
        if (aqi === 3) return 'Moderada';
        if (aqi === 4) return 'Pobre';
        if (aqi === 5) return 'Muito Pobre';
        return 'N/A';
    };

    const getAqiColor = (aqi: number): string => {
        if (aqi === 1) return 'green';
        if (aqi === 2) return 'yellow';
        if (aqi === 3) return 'orange';
        if (aqi === 4) return 'red';
        if (aqi === 5) return 'purple';
        return 'gray';
    };

    const getTextColorByAqi = (aqi: number): string => {
        if (aqi <= 2) {
            return 'black';
        }
        return 'white';
    };

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
                                <div className="clock-display">
                                    <div className="clock-segment">{hours}</div>
                                    <div className="clock-segment">{minutes}</div>
                                    <div className="clock-segment">{seconds}</div>
                                </div>
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
                            <InteractiveMap lat={mapCoords.lat} lon={mapCoords.lon} />
                        </div>
                    )}
                    
                    <div className="glass-card air-quality-card-full">
                        <h2>Qualidade do Ar</h2>
                        {airQualityData && (
                            <div className="air-quality-content-wrapper">
                                <div className="air-quality-left">
                                    <div className="aqi-circle" 
                                        style={{ 
                                            backgroundColor: getAqiColor(airQualityData.aqi),
                                            color: getTextColorByAqi(airQualityData.aqi)
                                        }}
                                    >
                                        <span>{airQualityData.aqi}</span>
                                    </div>
                                    <p>{aqiDescription(airQualityData.aqi)}</p>
                                </div>
                                <div className="air-quality-right">
                                    {airQualityData.components && [
                                        { name: 'PM2.5', value: airQualityData.components.pm2_5.toFixed(2) },
                                        { name: 'PM10', value: airQualityData.components.pm10.toFixed(2) },
                                        { name: 'O₃', value: airQualityData.components.o3.toFixed(2) },
                                        { name: 'CO', value: airQualityData.components.co.toFixed(2) },
                                    ].map((component, index) => (
                                        <div key={index} className="air-quality-item">
                                            <span className="component-name">{component.name}</span>
                                            <span className="component-value">{component.value} µg/m³</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSearch} className="glass-search-bar mt-4">
                    <input
                        type="text"
                        id="city-search"
                        placeholder="Digite outro local..."
                        className="glass-input"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                    />
                    <button type="submit" className="glass-button">
                        <i className="bi bi-search" style={{color:"#000"}}></i>
                    </button>
                </form>

                <div className="d-flex justify-content-center gap-2 mt-3">
                    <Button className="btn btn-secondary glass-btn" onClick={handleShowHistory}>
                        <i className="bi bi-clock-history"></i> Histórico
                    </Button>
                    <Button className="btn btn-secondary glass-btn" onClick={handleShowConfig}>
                        <i className="bi bi-gear-fill"></i> Config
                    </Button>
                </div>
            </div>

            <HistoryModal
                show={showHistory}
                handleClose={handleCloseHistory}
                history={searchHistory}
                onClearHistory={handleClearHistory}
                onSelectCity={handleSelectCity}
                onRemoveSelected={handleRemoveSelected}
            />
            <ConfigModal show={showConfig} handleClose={handleCloseConfig} currentTheme={theme} setAppTheme={setAppTheme} />
        </div>
    );
};

export default WeatherApp;