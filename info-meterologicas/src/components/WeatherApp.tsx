// src/components/WeatherApp.tsx

import { useState, useEffect, useCallback } from 'react';
import HistoryModal from './HistoryModal';
import ConfigModal from './ConfigModal';
import WeatherDetails from './WeatherDetails';
import WeatherForecast from './WeatherForecast';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AirQualityAndMap from './AirQualityAndMap';
import '../index.css'; // Usando o caminho relativo correto

// Definindo a tipagem para os dados da API do OpenWeatherMap
interface WeatherData {
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
interface HourlyForecastData {
    time: string;
    temp: number;
    icon: string;
}

interface DailyForecastData {
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

const WeatherApp: React.FC = () => {
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [showConfig, setShowConfig] = useState<boolean>(false);
    const [cityName, setCityName] = useState<string>('São Paulo');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [theme, setTheme] = useState<string>('');

    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData[]>([]);
    const [dailyForecast, setDailyForecast] = useState<DailyForecastData[]>([]);
    // Usando a tipagem correta para o estado
    const [airQualityData, setAirQualityData] = useState<AirQualityAPIResponse['list'][0] | null>(null);

    const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

    const handleShowHistory = () => setShowHistory(true);
    const handleCloseHistory = () => setShowHistory(false);
    const handleShowConfig = () => setShowConfig(true);
    const handleCloseConfig = () => setShowConfig(false);
    const handleClearHistory = () => setSearchHistory([]);

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
            setSearchHistory(prevHistory => {
                if (!prevHistory.includes(data.name)) return [...prevHistory, data.name];
                return prevHistory;
            });
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Ocorreu um erro desconhecido.');
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    // Efeito 1: Busca a localização inicial do usuário ou uma cidade aleatória
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

    // Efeito 2: Salva o histórico no localStorage
    useEffect(() => {
        localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    // Efeito 3: Atualiza a hora e o tema a cada segundo
    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString('pt-BR'));
            setTheme(getThemeByTime());
        };
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // Efeito 4: Busca a previsão horária e diária
    useEffect(() => {
        const fetchForecastData = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=pt_br`);
                if (!response.ok) throw new Error('Previsão não encontrada.');
                const data = await response.json();
                
                // Correção: Tipando o item corretamente
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

    // Efeito 5: Busca a qualidade do ar
    useEffect(() => {
        const fetchAirQualityData = async (lat: number, lon: number) => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
                if (!response.ok) throw new Error('Dados de qualidade do ar não encontrados.');
                const data: AirQualityAPIResponse = await response.json();
                setAirQualityData(data.list[0]);
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

    return (
        <div className={`weather-container ${theme}`}>
            <i className="bi bi-gear-fill gear-icon" onClick={handleShowConfig}></i>
            <div className="glass-container">
                {loading && <p>Carregando...</p>}
                {error && <p className="text-danger">{error}</p>}
                {weatherData && (
                    <>
                        <h1>{weatherData.name}, {weatherData.sys.country}</h1>
                        <p>{formatarData(weatherData.dt)}</p>
                        <p>Relógio: {currentTime}</p>
                        <div className="glass-temperature">
                            {Math.round(weatherData.main.temp)}<span className="glass-temperature-small">°C</span>
                            <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Clima" style={{ width: '80px', height: '80px', marginLeft: '20px' }} />
                        </div>
                        <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />
                        <WeatherDetails data={weatherData} />
                    </>
                )}

                <form onSubmit={handleSearch} className="glass-search-bar">
                    <input
                        type="text"
                        placeholder="Digite outra cidade..."
                        className="glass-input"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                    />
                    <button type="submit" className="glass-button">
                        <i className="bi bi-search"></i>
                    </button>
                </form>

                {weatherData && <WeatherForecast hourlyData={hourlyForecast} dailyData={dailyForecast} />}
                {airQualityData && <AirQualityAndMap airQualityData={{ aqi: airQualityData.main.aqi, components: airQualityData.components }} />}

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
            />
            <ConfigModal show={showConfig} handleClose={handleCloseConfig} />
        </div>
    );
};

export default WeatherApp;