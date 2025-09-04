import { useState, useEffect, useCallback } from 'react';
import HistoryModal from './HistoryModal';
import ConfigModal from './ConfigModal';
import WeatherDetails from './WeatherDetails'; 
import WeatherForecast from './WeatherForecast';
import InteractiveMap from './InteractiveMap';
import ReactCountryFlag from "react-country-flag";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../index.css';

// Definindo a tipagem para os dados da API do OpenWeatherMap
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

// Interfaces para os dados de previsão
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

// Interface para a resposta completa da API de Qualidade do Ar
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

// Interface que define o formato de dados que o componente AirQualityAndMap espera
export interface AirQualityData {
    aqi: number;
    components: {
        co: number;
        o3: number;
        pm2_5: number;
        pm10: number;
    };
}

// Interface para o objeto de previsão retornado pela API
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

// Definindo coordenadas padrão para renderização inicial
const defaultCoords = {
    lat: -23.5505, // Coordenadas de São Paulo
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
    
    // Funções para lidar com o histórico
    const handleClearHistory = () => setSearchHistory([]);
    const handleRemoveSelected = (cityToRemove: string) => {
        setSearchHistory(prevHistory => prevHistory.filter(city => city !== cityToRemove));
    };
    const handleSelectCity = (city: string) => {
        handleCloseHistory();
        fetchWeatherData({ city: city });
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

    const fetchWeatherData = useCallback(async (location: { city: string } | { lat: number; lon: number }) => {
        setLoading(true);
        setError(null);

        let url = '';

        if ('city' in location) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${location.city}&appid=${apiKey}&units=metric&lang=pt_br`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&lang=pt_br`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 401) throw new Error('Chave de API inválida.');
                throw new Error('Localização não encontrada.');
            }
            const data: WeatherData = await response.json();
            setWeatherData(data);
            setCityName(data.name);
            setMapCoords({ lat: data.coord.lat, lon: data.coord.lon }); // Atualiza as coordenadas do mapa
            setSearchHistory(prevHistory => {
                if (!prevHistory.includes(data.name)) return [...prevHistory, data.name];
                return prevHistory;
            });
            fetchUnsplashImage(data.name);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Ocorreu um erro desconhecido.');
        } finally {
            setLoading(false);
        }
    }, [apiKey, fetchUnsplashImage]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('weatherSearchHistory');
        if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData({ lat: latitude, lon: longitude });
        };

        const handleError = () => {
            console.log("Permissão de localização negada. Buscando cidade aleatória.");
            const randomCity = brazilianCapitals[Math.floor(Math.random() * brazilianCapitals.length)];
            fetchWeatherData({ city: randomCity });
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        } else {
            handleError();
        }
    }, [fetchWeatherData]);

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

    useEffect(() => {
        const fetchForecastData = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=pt_br`);
                if (!response.ok) throw new Error('Previsão não encontrada.');
                const data = await response.json();
                
                const newHourlyData = data.list.slice(0, 5).map((item: ForecastItem) => ({
                    time: new Date(item.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    temp: item.main.temp,
                    icon: item.weather[0].icon,
                }));
                setHourlyForecast(newHourlyData);

                const newDailyData = [
                    { day: 'Ter.', temp: 23, icon: '02d' }, { day: 'Qua.', temp: 24, icon: '01d' },
                    { day: 'Qui.', temp: 22, icon: '09d' }, { day: 'Sex.', temp: 25, icon: '01d' },
                    { day: 'Sáb.', temp: 21, icon: '10d' }, { day: 'Dom.', temp: 20, icon: '04d' },
                    { day: 'Seg.', temp: 23, icon: '03d' },
                ];
                setDailyForecast(newDailyData);
            } catch (err: unknown) {
                console.error('Erro ao buscar a previsão:', err);
            }
        };

        if (cityName) fetchForecastData();
    }, [cityName, apiKey]);

    useEffect(() => {
        const fetchAirQualityData = async (lat: number, lon: number) => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
                if (!response.ok) throw new Error('Dados de qualidade do ar não encontrados.');
                const data: AirQualityAPIResponse = await response.json();
                
                if (data.list.length > 0) {
                    setAirQualityData({
                        aqi: data.list[0].main.aqi,
                        components: data.list[0].components,
                    });
                }
            } catch (err: unknown) {
                console.error('Erro ao buscar a qualidade do ar:', err);
                setAirQualityData(null);
            }
        };

        if (weatherData && weatherData.coord) {
            fetchAirQualityData(weatherData.coord.lat, weatherData.coord.lon);
        }
    }, [weatherData, apiKey]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (cityName) fetchWeatherData({ city: cityName });
    };
    
    // Funções de qualidade do ar
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

    return (
        <div
            className={`weather-container ${theme}`}
            style={{
                backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'linear-gradient(to top, #6a85b6 0%, #bac8e0 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                transition: 'background-image 0.5s ease-in-out',
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
                    <div className="glass-card map-card-full">
                        <h2>Mapa Interativo</h2>
                        <div className="map-container">
                            <InteractiveMap lat={mapCoords.lat} lon={mapCoords.lon} />
                        </div>
                    </div>

                    <div className="glass-card air-quality-card-full">
                        <h2>Qualidade do Ar</h2>
                        {airQualityData && (
                            <div className="air-quality-content-wrapper">
                                <div className="air-quality-left">
                                    <div className="aqi-circle" style={{ backgroundColor: getAqiColor(airQualityData.aqi) }}>
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
                        placeholder="Digite outra cidade..."
                        className="glass-input"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                    />
                    <button type="submit" className="glass-button">
                        <i className="bi bi-search" style={{color:"var(--letter-color)"}}></i>
                    </button>
                </form>

                <div className="d-flex justify-content-center gap-2 mt-3">
                    <button className="btn btn-secondary glass-btn" onClick={handleShowHistory}>
                        <i className="bi bi-clock-history"></i> Histórico
                    </button>
                    <button className="btn btn-secondary glass-btn" onClick={handleShowConfig}>
                        <i className="bi bi-gear-fill"></i> Config
                    </button>
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