import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HistoryModal from './HistoryModal';
import ConfigModal from './ConfigModal';
import type { AirQualityData } from './WeatherApp';

// Define o ícone de marcador do Leaflet
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AirQualityAndMapProps {
    airQualityData: AirQualityData | null;
    mapCoords: { lat: number; lon: number };
    theme: string;
    setAppTheme: (theme: string) => void;
    searchHistory: string[];
    onClearHistory: () => void;
    onSelectCity: (city: string) => void;
    onRemoveSelected: (city: string) => void;
}

const AirQualityAndMap: React.FC<AirQualityAndMapProps> = ({
    airQualityData,
    mapCoords,
    theme,
    setAppTheme,
    searchHistory,
    onClearHistory,
    onSelectCity,
    onRemoveSelected,
}) => {
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [showConfig, setShowConfig] = useState<boolean>(false);

    const handleShowHistory = () => setShowHistory(true);
    const handleCloseHistory = () => setShowHistory(false);
    const handleShowConfig = () => setShowConfig(true);
    const handleCloseConfig = () => setShowConfig(false);

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

    return (
        <>
            <div className="glass-card map-card-full">
                <h2>Mapa Interativo</h2>
                <div className="map-container">
                    <MapContainer center={[mapCoords.lat, mapCoords.lon]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[mapCoords.lat, mapCoords.lon]}>
                            <Popup>
                                Localização atual do clima.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>

            <div className="glass-card air-quality-card-full">
                <h2>Qualidade do Ar</h2>
                {airQualityData && (
                    <div className="air-quality-content-wrapper">
                        <div className="air-quality-left">
                            <div className="aqi-circle" style={{ backgroundColor: getAqiColor(airQualityData.aqi) }}>
                                <span>{airQualityData.aqi}</span>
                            </div>
                            <p>{aqiDescription(airQualityData.aqi)}</p>
                        </div>
                        <div className="air-quality-right">
                            {airQualityData.components && [
                                { name: 'PM2.5', value: airQualityData.components.pm2_5.toFixed(2) },
                                { name: 'PM10', value: airQualityData.components.pm10.toFixed(2) },
                                { name: 'O₃', value: airQualityData.components.o3.toFixed(2) },
                                { name: 'CO', value: airQualityData.components.co.toFixed(2) },
                            ].map((component, index) => (
                                <div key={index} className="air-quality-item">
                                    <span className="component-name">{component.name}</span>
                                    <span className="component-value">{component.value} µg/m³</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="d-flex justify-content-center gap-2 mt-3">
                <Button className="btn btn-secondary glass-btn" onClick={handleShowHistory}>
                    <i className="bi bi-clock-history"></i> Histórico
                </Button>
                <Button className="btn btn-secondary glass-btn" onClick={handleShowConfig}>
                    <i className="bi bi-gear-fill"></i> Config
                </Button>
            </div>

            <HistoryModal
                show={showHistory}
                handleClose={handleCloseHistory}
                history={searchHistory}
                onClearHistory={onClearHistory}
                onSelectCity={onSelectCity}
                onRemoveSelected={onRemoveSelected}
            />

            <ConfigModal
                show={showConfig}
                handleClose={handleCloseConfig}
                currentTheme={theme}
                setAppTheme={setAppTheme}
            />
        </>
    );
};

export default AirQualityAndMap;