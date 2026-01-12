import { render, screen } from '@testing-library/react';
import WeatherApp from './WeatherApp';
import * as useWeatherHook from '../hooks/useWeather';
import * as useWeatherHistoryHook from '../hooks/useWeatherHistory';
import * as useThemeHook from '../hooks/useTheme';

// Mock dos hooks
jest.mock('../hooks/useWeather');
jest.mock('../hooks/useWeatherHistory');
jest.mock('../hooks/useTheme');

describe('WeatherApp', () => {
    beforeEach(() => {
        // Mock implementations
        (useWeatherHook.useWeather as jest.Mock).mockReturnValue({
            data: {
                name: 'São Paulo',
                sys: { country: 'BR', sunrise: 1600000000, sunset: 1600040000 },
                main: { temp: 25, feels_like: 26, temp_min: 22, temp_max: 28, pressure: 1013, humidity: 60 },
                weather: [{ description: 'céu limpo', icon: '01d' }],
                wind: { speed: 5 },
                visibility: 10000,
                dt: 1600020000,
                coord: { lat: -23.55, lon: -46.63 }
            },
            loading: false,
            error: null,
            hourlyForecast: [],
            dailyForecast: [],
            airQuality: { aqi: 1, components: { pm2_5: 10, pm10: 20, o3: 30, co: 40 } },
            backgroundImageUrl: 'http://example.com/image.jpg',
            fetchWeatherData: jest.fn().mockResolvedValue('São Paulo')
        });

        (useWeatherHistoryHook.useWeatherHistory as jest.Mock).mockReturnValue({
            searchHistory: [],
            showHistory: false,
            addToHistory: jest.fn(),
            clearHistory: jest.fn(),
            removeCityFromHistory: jest.fn(),
            openHistoryModal: jest.fn(),
            closeHistoryModal: jest.fn()
        });

        (useThemeHook.useTheme as jest.Mock).mockReturnValue({
            theme: 'automatico',
            setTheme: jest.fn()
        });
    });

    test('renders weather data', async () => {
        render(<WeatherApp />);
        
        // Agora verificamos se os dados mockados aparecem
        expect(screen.getByText(/São Paulo, BR/i)).toBeInTheDocument();
        expect(screen.getByText(/25/)).toBeInTheDocument();
        // Verifica se a qualidade do ar aparece (mockado)
        expect(screen.getByText(/Qualidade do Ar/i)).toBeInTheDocument();
    });
});
