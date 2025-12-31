import { render, screen, waitFor } from '@testing-library/react';
import WeatherApp from './WeatherApp';


// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
        name: 'São Paulo',
        sys: { country: 'BR', sunrise: 1600000000, sunset: 1600040000 },
        main: { temp: 25, feels_like: 26, temp_min: 22, temp_max: 28, pressure: 1013, humidity: 60 },
        weather: [{ description: 'céu limpo', icon: '01d' }],
        wind: { speed: 5 },
        visibility: 10000,
        dt: 1600020000,
        coord: { lat: -23.55, lon: -46.63 }
    }),
    ok: true
  })
) as jest.Mock;

describe('WeatherApp', () => {
    test('renders weather data after fetch', async () => {
        render(<WeatherApp />);
        
        await waitFor(() => {
            expect(screen.getByText(/São Paulo, BR/i)).toBeInTheDocument();
        });
        
        expect(screen.getByText(/25/)).toBeInTheDocument();
    });
});
