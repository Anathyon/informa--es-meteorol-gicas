// Tipagem para os dados de qualidade do ar
interface AirQualityData {
    aqi: number;
    components: {
        co: number;
        o3: number;
        pm2_5: number;
        pm10: number;
    };
}

interface AirQualityAndMapProps {
    airQualityData: AirQualityData | null;
}

const AirQualityAndMap: React.FC<AirQualityAndMapProps> = ({ airQualityData }) => {
    // Determina a descrição do AQI (Índice de Qualidade do Ar)
    const getAqiDescription = (aqi: number): string => {
        if (aqi === 1) return 'Boa';
        if (aqi === 2) return 'Moderada';
        if (aqi === 3) return 'Ruim para grupos sensíveis';
        if (aqi === 4) return 'Ruim';
        if (aqi === 5) return 'Muito Ruim';
        return 'N/A';
    };

    return (
        <div className="air-quality-container">
            {/* Seção de Mapa Interativo */}
            <h3 className="air-quality-title">Mapa Interativo</h3>
            <div className="map-card d-flex flex-column align-items-center justify-content-center text-center">
                <i className="bi bi-geo-alt-fill map-icon"></i>
                <p className="mt-2">Mapa de radar meteorológico</p>
            </div>

            {/* Seção de Qualidade do Ar */}
            <h3 className="air-quality-title mt-4">Qualidade do Ar</h3>
            <div className="air-quality-content row g-3">
                {/* Indicador principal da qualidade do ar */}
                <div className="col-12 col-md-4 d-flex flex-column align-items-center justify-content-center text-center">
                    <div className="aqi-indicator" style={{ backgroundColor: getAqiColor(airQualityData?.aqi) }}>
                        <span>{airQualityData?.aqi || 'N/A'}</span>
                    </div>
                    <p className="mt-2">{getAqiDescription(airQualityData?.aqi || 0)}</p>
                </div>

                {/* Detalhes dos poluentes */}
                <div className="col-12 col-md-8">
                    <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            PM2.5 <span className="badge text-bg-secondary">{airQualityData?.components.pm2_5 || 'N/A'} µg/m³</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            PM10 <span className="badge text-bg-secondary">{airQualityData?.components.pm10 || 'N/A'} µg/m³</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            O₃ <span className="badge text-bg-secondary">{airQualityData?.components.o3 || 'N/A'} µg/m³</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            CO <span className="badge text-bg-secondary">{airQualityData?.components.co || 'N/A'} µg/m³</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Função para obter a cor com base no AQI
const getAqiColor = (aqi: number | undefined): string => {
    if (aqi === 1) return 'green';
    if (aqi === 2) return 'yellow';
    if (aqi === 3) return 'orange';
    if (aqi === 4) return 'red';
    if (aqi === 5) return 'purple';
    return '#ccc';
};

export default AirQualityAndMap;