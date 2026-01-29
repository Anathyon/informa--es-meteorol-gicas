import { render } from '@testing-library/react';
import App from '../App';

// Mock dos componentes
jest.mock('./WeatherApp', () => ({
  __esModule: true,
  default: () => <div data-testid="weather-app">WeatherApp</div>
}));

jest.mock('./PWANotification', () => ({
  PWANotification: () => <div data-testid="pwa-notification">PWANotification</div>
}));

describe('App Integration', () => {
  it('deve renderizar o App sem erros', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('deve renderizar WeatherApp', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('weather-app')).toBeTruthy();
  });

  it('deve renderizar a estrutura corretamente', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });
});
