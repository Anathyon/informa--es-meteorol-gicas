import React from 'react';

// Interface que define o formato de dados que este componente espera
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
    airQualityData: AirQualityData;
}

const AirQualityAndMap: React.FC<AirQualityAndMapProps> = ({ airQualityData }) => {
    const aqiDescription = (aqi: number): string => {
        if (aqi === 1) return 'Boa';
        if (aqi === 2) return 'Razoável';
        if (aqi === 3) return 'Moderada';
        if (aqi === 4) return 'Pobre';
        if (aqi === 5) return 'Muito Pobre';
        return 'N/A';
    };

    const getAqiColor = (aqi: number): string => {
        if (aqi === 1) return 'green';
        if (aqi === 2) return 'yellow';
        if (aqi === 3) return 'orange';
        if (aqi === 4) return 'red';
        if (aqi === 5) return 'purple';
        return 'gray';
    };

    const formattedComponents = [
        { name: 'PM2.5', value: airQualityData.components.pm2_5.toFixed(2) },
        { name: 'PM10', value: airQualityData.components.pm10.toFixed(2) },
        { name: 'O₃', value: airQualityData.components.o3.toFixed(2) },
        { name: 'CO', value: airQualityData.components.co.toFixed(2) },
    ];

    return (
        // Removi completamente a div "map-card" cenográfica que estava aqui.
        // Este componente agora lida EXCLUSIVAMENTE com a qualidade do ar.
        <div className="air-quality-content-wrapper"> {/* Adicionei um wrapper para os estilos */}
            <div className="air-quality-left">
                <div className="aqi-circle" style={{ backgroundColor: getAqiColor(airQualityData.aqi) }}>
                    <span>{airQualityData.aqi}</span>
                </div>
                <p>{aqiDescription(airQualityData.aqi)}</p>
            </div>
            <div className="air-quality-right">
                {formattedComponents.map((component, index) => (
                    <div key={index} className="air-quality-item">
                        <span className="component-name">{component.name}</span>
                        <span className="component-value">{component.value} µg/m³</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AirQualityAndMap;