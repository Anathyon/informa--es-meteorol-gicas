import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
    WeatherData,
    HourlyForecastData,
    DailyForecastData,
    AirQualityData
} from '../types';
import {
    fetchCurrentWeather,
    fetchForecastData,
    fetchUnsplashImage,
    fetchAirQuality
} from '../services/weatherApi';

interface WeatherState {
    // Data
    weatherData: WeatherData | null;
    hourlyForecast: HourlyForecastData[];
    dailyForecast: DailyForecastData[];
    airQuality: AirQualityData | null;
    backgroundImageUrl: string | null;

    // UI State
    loading: boolean;
    error: string | null;
    theme: string;

    // Config & History
    searchHistory: string[];
    isAutoUpdateEnabled: boolean;

    // Actions
    setTheme: (theme: string) => void;
    toggleAutoUpdate: (enabled: boolean) => void;
    addToHistory: (city: string) => void;
    removeFromHistory: (city: string) => void;
    clearHistory: () => void;

    // Async Actions
    fetchWeatherData: (location: { city?: string; lat?: number; lon?: number }) => Promise<void>;
}

export const useWeatherStore = create<WeatherState>()(
    persist(
        (set, get) => ({
            // Initial State
            weatherData: null,
            hourlyForecast: [],
            dailyForecast: [],
            airQuality: null,
            backgroundImageUrl: null,
            loading: false,
            error: null,
            theme: 'automatico',
            searchHistory: [],
            isAutoUpdateEnabled: true,

            // Actions
            setTheme: (theme) => set({ theme }),

            toggleAutoUpdate: (enabled) => set({ isAutoUpdateEnabled: enabled }),

            addToHistory: (city) => set((state) => {
                if (!state.searchHistory.includes(city)) {
                    return { searchHistory: [...state.searchHistory, city] };
                }
                return {};
            }),

            removeFromHistory: (cityToRemove) => set((state) => ({
                searchHistory: state.searchHistory.filter(c => c !== cityToRemove)
            })),

            clearHistory: () => set({ searchHistory: [] }),

            /**
             * Fetches weather data for a given location (City name or Lat/Lon).
             * Updates the store state with current weather, forecast, air quality, and background image.
             * @param location Object containing city or lat/lon coordinates
             */
            fetchWeatherData: async (location) => {
                set({ loading: true, error: null });
                try {
                    const query = location.city
                        ? `q=${location.city}`
                        : `lat=${location.lat}&lon=${location.lon}`;

                    // Fetch Current Weather
                    const weatherData = await fetchCurrentWeather(query);

                    // Parallel Requests for secondary data
                    const [bgUrl, forecastData, airQuality] = await Promise.all([
                        fetchUnsplashImage(weatherData.name),
                        fetchForecastData(`lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`),
                        fetchAirQuality(weatherData.coord.lat, weatherData.coord.lon)
                    ]);

                    // Update State
                    set({
                        weatherData,
                        hourlyForecast: forecastData.hourly,
                        dailyForecast: forecastData.daily,
                        airQuality,
                        backgroundImageUrl: bgUrl,
                        loading: false,
                        error: null
                    });

                    // Add to history automatically on successful fetch
                    get().addToHistory(weatherData.name);

                } catch (err: unknown) {
                    let errorMessage = 'Ocorreu um erro desconhecido.';
                    if (err instanceof Error) errorMessage = err.message;
                    set({ loading: false, error: errorMessage });
                    throw err;
                }
            },
        }),
        {
            name: 'weather-app-storage', // Key in localStorage
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                theme: state.theme,
                searchHistory: state.searchHistory,
                isAutoUpdateEnabled: state.isAutoUpdateEnabled
            }), // Only persist specific fields
        }
    )
);
