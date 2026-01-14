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
/**
 * Processa a lista de previsões de 3h para obter uma previsão diária agregada.
 * Calcula temperatura mínima e máxima para cada dia e escolhe o ícone mais frequente.
 */
const processDailyForecast = (list: ForecastItem[]): DailyForecastData[] => {
    const dailyMap = new Map<string, { min: number; max: number; icons: string[] }>();

    list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'short' });

        if (!dailyMap.has(date)) {
            dailyMap.set(date, {
                min: item.main.temp_min,
                max: item.main.temp_max,
                icons: [item.weather[0].icon]
            });
        } else {
            const current = dailyMap.get(date)!;
            current.min = Math.min(current.min, item.main.temp_min);
            current.max = Math.max(current.max, item.main.temp_max);
            current.icons.push(item.weather[0].icon);
        }
    });

    return Array.from(dailyMap.entries()).map(([day, data]) => {
        // Encontra o ícone mais frequente (moda)
        const iconCounts = data.icons.reduce((acc, icon) => {
            acc[icon] = (acc[icon] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostFrequentIcon = Object.keys(iconCounts).reduce((a, b) => iconCounts[a] > iconCounts[b] ? a : b);

        return {
            day: day.charAt(0).toUpperCase() + day.slice(1), // Capitaliza o dia
            minTemp: data.min,
            maxTemp: data.max,
            icon: mostFrequentIcon
        };
    }).slice(0, 7); // Garante no máximo 7 dias
};

/**
 * Busca a previsão do tempo completa e retorna dados horários e diários.
 * @param query Query string formatada (city ou lat/lon). *Alterado para aceitar query genérica para ser consistente*
 * @returns Objeto com previsões horárias e diárias.
 */
export const fetchForecastData = async (query: string): Promise<{ hourly: HourlyForecastData[], daily: DailyForecastData[] }> => {
    const response = await fetch(`${BASE_URL}/forecast?${query}&appid=${API_KEY}&units=metric&lang=pt_br`);
    if (!response.ok) throw new Error('Erro ao buscar previsão.');

    const data = await response.json();

    // Previsão Horária (próximas 5 entradas = 15 horas aprx, mas mantendo 5 itens como antes)
    const hourly: HourlyForecastData[] = data.list.slice(0, 5).map((item: ForecastItem) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        temp: item.main.temp,
        icon: item.weather[0].icon,
    }));

    // Previsão Diária Agregada
    const daily = processDailyForecast(data.list);

    return { hourly, daily };
};

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
