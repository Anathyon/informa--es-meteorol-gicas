import { useState, useCallback } from 'react';
import {
    fetchCurrentWeather,
    fetchForecast,
    fetchUnsplashImage,
    fetchAirQuality,
    getDailyForecastMock
} from '../services/weatherApi';
import type { WeatherData, HourlyForecastData, DailyForecastData, AirQualityData } from '../types';

interface WeatherState {
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
    hourlyForecast: HourlyForecastData[];
    dailyForecast: DailyForecastData[];
    airQuality: AirQualityData | null;
    backgroundImageUrl: string | null;
}

export const useWeather = () => {
    const [weatherState, setWeatherState] = useState<WeatherState>({
        data: null,
        loading: false,
        error: null,
        hourlyForecast: [],
        dailyForecast: [],
        airQuality: null,
        backgroundImageUrl: null
    });

    /**
     * Busca todos os dados meteorológicos para uma localização.
     */
    const fetchWeatherData = useCallback(async (location: { city?: string; lat?: number; lon?: number }) => {
        setWeatherState(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Construção da query
            const query = location.city
                ? `q=${location.city}`
                : `lat=${location.lat}&lon=${location.lon}`;

            // 1. Clima Atual
            const weatherData = await fetchCurrentWeather(query);

            // 2. Imagem de Fundo (Paralelo)
            // 3. Previsão (Paralelo)
            // 4. Qualidade do Ar (Paralelo)

            const [bgUrl, hourlyData, airQuality] = await Promise.all([
                fetchUnsplashImage(weatherData.name),
                fetchForecast(weatherData.name),
                fetchAirQuality(weatherData.coord.lat, weatherData.coord.lon)
            ]);

            const dailyData = getDailyForecastMock();

            setWeatherState({
                data: weatherData,
                loading: false,
                error: null,
                hourlyForecast: hourlyData,
                dailyForecast: dailyData,
                airQuality: airQuality,
                backgroundImageUrl: bgUrl
            });

            return weatherData.name; // Retorna o nome da cidade para uso no histórico

        } catch (err: unknown) {
            let errorMessage = 'Ocorreu um erro desconhecido.';
            if (err instanceof Error) errorMessage = err.message;

            setWeatherState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage
            }));
            throw err; // Re-throw para que o componente possa lidar se necessário
        }
    }, []);

    return {
        ...weatherState,
        fetchWeatherData
    };
};
