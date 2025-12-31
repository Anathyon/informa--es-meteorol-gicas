import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Form } from 'react-bootstrap';

import '../styles/map.css';
import MapController from './MapController'; // Importa o componente de controle do mapa

// Solução para o problema de ícone ausente do Leaflet com Webpack/Vite


interface InteractiveMapProps {
    lat: number;
    lon: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lon }) => {
    const [mapType, setMapType] = useState<'normal' | 'heatmap'>('normal');
    const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

    return (
        <div className="map-wrapper">
            <div className="d-flex justify-content-between align-items-center map-header mb-3">
                <h2>Mapa Interativo</h2>
                <Form.Check
                    type="switch"
                    id="map-toggle-switch"
                    label={mapType === 'normal' ? 'Normal' : 'Calor'}
                    checked={mapType === 'heatmap'}
                    onChange={() => setMapType(mapType === 'normal' ? 'heatmap' : 'normal')}
                />
            </div>
            <div className="map-container-leaflet">
                <MapContainer center={[lat, lon]} zoom={13} scrollWheelZoom={false}>
                    {/* Renderiza o MapController como um filho direto */}
                    <MapController lat={lat} lon={lon} />
                    
                    {mapType === 'normal' && (
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    )}
                    {mapType === 'heatmap' && (
                        <>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <TileLayer
                                url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                                attribution='&copy; <a href="http://openweathermap.org">OpenWeatherMap</a>'
                            />
                        </>
                    )}
                    <Marker position={[lat, lon]}>
                        <Popup>
                            Localização atual do clima.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export default InteractiveMap;