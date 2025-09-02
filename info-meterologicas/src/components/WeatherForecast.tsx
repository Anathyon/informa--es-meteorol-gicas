import React from 'react';

// Definindo a tipagem para os dados de previsão
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

interface WeatherForecastProps {
    hourlyData: HourlyForecastData[];
    dailyData: DailyForecastData[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ hourlyData, dailyData }) => {
    // Função utilitária para converter o código do ícone da API para o nome da classe do Bootstrap Icons
    const mapIconToBootstrap = (apiIconCode: string): string => {
        // Exemplo de mapeamento, você pode adicionar mais conforme a necessidade
        if (apiIconCode.includes('01d')) return 'sun-fill';
        if (apiIconCode.includes('01n')) return 'moon-fill';
        if (apiIconCode.includes('02d')) return 'cloud-sun-fill';
        if (apiIconCode.includes('02n')) return 'cloud-moon-fill';
        if (apiIconCode.includes('03') || apiIconCode.includes('04')) return 'cloud-fill';
        if (apiIconCode.includes('09')) return 'cloud-rain-heavy-fill';
        if (apiIconCode.includes('10d')) return 'cloud-sun-fill';
        if (apiIconCode.includes('10n')) return 'cloud-moon-fill';
        if (apiIconCode.includes('11')) return 'cloud-lightning-fill';
        if (apiIconCode.includes('13')) return 'cloud-snow-fill';
        if (apiIconCode.includes('50')) return 'cloud-haze2-fill';
        return 'cloud'; // Ícone padrão
    };

    return (
        <div className="forecast-container">
            {/* Seção de Previsão por Horas */}
            <h3 className="forecast-title">Previsão por Horas</h3>
            <div className="row flex-nowrap g-3 overflow-x-auto">
                {hourlyData.map((data, index) => (
                    <div key={index} className="col">
                        <div className="forecast-card">
                            <p className="forecast-time">{data.time}</p>
                            <i className={`bi bi-${mapIconToBootstrap(data.icon)} forecast-icon`}></i>
                            <p className="forecast-temp">{Math.round(data.temp)}°</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Seção de Previsão para 7 Dias */}
            <h3 className="forecast-title mt-4">Previsão para 7 Dias</h3>
            <div className="row flex-nowrap g-3 justify-content-between overflow-x-auto">
                {dailyData.map((data, index) => (
                    <div key={index} className="col">
                        <div className="forecast-card">
                            <p className="forecast-day">{data.day}</p>
                            <i className={`bi bi-${mapIconToBootstrap(data.icon)} forecast-icon`}></i>
                            <p className="forecast-temp">{Math.round(data.temp)}°</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherForecast;