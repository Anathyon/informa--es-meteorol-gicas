import { render, screen } from '@testing-library/react';
import WeatherApp from './WeatherApp';
import { useWeatherStore } from '../store/weatherStore';

// Mock do Zustand com Factory para evitar importação do arquivo real (e suas dependências)
const mockUseWeatherStore = jest.fn();
jest.mock('../store/weatherStore', () => ({
  useWeatherStore: mockUseWeatherStore
}));

describe('WeatherApp', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock implementation of the store
        (useWeatherStore as unknown as jest.Mock).mockReturnValue({
            // Data
            weatherData: {
                name: 'São Paulo',
                sys: { country: 'BR', sunrise: 1600000000, sunset: 1600040000 },
                main: { temp: 25, feels_like: 26, temp_min: 22, temp_max: 28, pressure: 1013, humidity: 60 },
                weather: [{ description: 'céu limpo', icon: '01d' }],
                wind: { speed: 5 },
                visibility: 10000,
                dt: 1600020000,
                coord: { lat: -23.55, lon: -46.63 }
            },
            hourlyForecast: [
                { dt: 1600023600, temp: 24, time: '14:00', icon: '01d', main: { temp: 24 }, weather: [{icon: '01d'}] },
                { dt: 1600027200, temp: 23, time: '15:00', icon: '02d', main: { temp: 23 }, weather: [{icon: '02d'}] }
            ],
            dailyForecast: [],
            airQuality: { aqi: 1, components: { pm2_5: 10, pm10: 20, o3: 30, co: 40 } },
            backgroundImageUrl: 'http://example.com/image.jpg',
            
            // Status
            loading: false,
            error: null,
            theme: 'automatico',
            searchHistory: [],
            isAutoUpdateEnabled: true,

            // Actions
            fetchWeatherData: jest.fn(),
            addToHistory: jest.fn(),
            clearHistory: jest.fn(),
            removeFromHistory: jest.fn(),
            setTheme: jest.fn(),
            toggleAutoUpdate: jest.fn()
        });
    });

    test('renders weather data correcty from store', async () => {
        render(<WeatherApp />);
        
        // Verifica se os dados mockados aparecem na tela
        expect(screen.getByText(/São Paulo, BR/i)).toBeInTheDocument();
        expect(screen.getByText(/25/)).toBeInTheDocument(); // Temperatura
        expect(screen.getByText(/Boa/i)).toBeInTheDocument(); // Qualidade do Ar (AQI 1 = Boa)
    });
});
