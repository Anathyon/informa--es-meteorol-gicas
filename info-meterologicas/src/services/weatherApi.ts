import type {
    WeatherData,
    ForecastItem,
    HourlyForecastData,
    DailyForecastData,
    AirQualityAPIResponse,
    AirQualityData
} from '../types';

import { OPENWEATHERMAP_API_KEY as API_KEY, UNSPLASH_API_KEY } from '../env';

// URLs Base
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const UNSPLASH_URL = 'https://api.unsplash.com/search/photos';

/**
 * Busca a imagem de fundo baseada na cidade usando a API do Unsplash.
 * @param query Nome da cidade ou termo de busca.
 * @returns URL da imagem ou null se não encontrar.
 */
export const fetchUnsplashImage = async (query: string): Promise<string | null> => {
    if (!UNSPLASH_API_KEY) {
        console.error('Chave de API do Unsplash não encontrada.');
        return null;
    }
    const url = `${UNSPLASH_URL}?query=${query}&client_id=${UNSPLASH_API_KEY}&orientation=landscape&per_page=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.results.length > 0) {
            return data.results[0].urls.regular;
        } else {
            console.error('Nenhuma imagem encontrada para a cidade.');
            return null;
        }
    } catch (err) {
        console.error('Erro ao buscar imagem no Unsplash:', err);
        return null;
    }
};

/**
 * Busca os dados meteorológicos atuais.
 * @param query Query string formatada (ex: "q=London" ou "lat=...&lon=...")
 * @returns Dados meteorológicos.
 */
export const fetchCurrentWeather = async (query: string): Promise<WeatherData> => {
    const response = await fetch(`${BASE_URL}/weather?${query}&appid=${API_KEY}&units=metric&lang=pt_br`);
    if (!response.ok) {
        if (response.status === 401) throw new Error('Chave de API inválida.');
        throw new Error('Localização não encontrada.');
    }
    return response.json();
};

/**
 * Busca a previsão do tempo (5 dias / 3 horas).
 * @param cityName Nome da cidade.
 * @returns Lista de previsões horárias formatadas.
 */
export const fetchForecast = async (cityName: string): Promise<HourlyForecastData[]> => {
    const response = await fetch(`${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=pt_br`);
    if (!response.ok) throw new Error('Erro ao buscar previsão.');

    const data = await response.json();
    // Pega as primeiras 5 previsões (próximas horas)
    return data.list.slice(0, 5).map((item: ForecastItem) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        temp: item.main.temp,
        icon: item.weather[0].icon,
    }));
};

/**
 * Retorna dados mockados para previsão diária.
 * TODO: Implementar lógica real de agragação se necessário.
 */
export const getDailyForecastMock = (): DailyForecastData[] => [
    { day: 'Ter.', temp: 23, icon: '02d' },
    { day: 'Qua.', temp: 24, icon: '01d' },
    { day: 'Qui.', temp: 22, icon: '09d' },
    { day: 'Sex.', temp: 25, icon: '01d' },
    { day: 'Sáb.', temp: 21, icon: '10d' },
    { day: 'Dom.', temp: 20, icon: '04d' },
    { day: 'Seg.', temp: 23, icon: '03d' },
];

/**
 * Busca dados de qualidade do ar.
 * @param lat Latitude
 * @param lon Longitude
 * @returns Dados de qualidade do ar ou null.
 */
export const fetchAirQuality = async (lat: number, lon: number): Promise<AirQualityData | null> => {
    const response = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (!response.ok) return null;

    const data: AirQualityAPIResponse = await response.json();
    if (data.list.length > 0) {
        return {
            aqi: data.list[0].main.aqi,
            components: data.list[0].components,
        };
    }
    return null;
};
