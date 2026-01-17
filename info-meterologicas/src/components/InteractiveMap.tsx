import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Form } from 'react-bootstrap';

import '../styles/map.css';
import MapController from './MapController';

/**
 * Type for available weather map layers.
 */
type MapLayerType = 'none' | 'temp' | 'precipitation' | 'pressure' | 'wind';

interface InteractiveMapProps {
    lat: number;
    lon: number;
}

/**
 * InteractiveMap Component
 * Displays a Leaflet map with various weather overlays from OpenWeatherMap.
 */
const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lon }) => {
    const [layerType, setLayerType] = useState<MapLayerType>('none');
    const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

    // Map layer configuration
    const layers = {
        temp: { name: 'Temperatura', code: 'temp_new' },
        precipitation: { name: 'Precipitação', code: 'precipitation_new' },
        pressure: { name: 'Pressão', code: 'pressure_new' },
        wind: { name: 'Vento', code: 'wind_new' }
    };

    return (
        <div className="map-wrapper">
            <div className="d-flex justify-content-between align-items-center map-header mb-3">
                <h2 className="m-0">Mapa Interativo</h2>
                <div className="d-flex align-items-center gap-2">
                    <span className="small text-white-50 d-none d-sm-inline">Camada:</span>
                    <Form.Select 
                        size="sm" 
                        className="bg-dark text-white border-secondary w-auto"
                        value={layerType}
                        onChange={(e) => setLayerType(e.target.value as MapLayerType)}
                        aria-label="Selecionar camada do mapa"
                    >
                        <option value="none">Nenhuma (Padrão)</option>
                        <option value="temp">Temperatura</option>
                        <option value="precipitation">Precipitação</option>
                        <option value="pressure">Pressão</option>
                        <option value="wind">Vento</option>
                    </Form.Select>
                </div>
            </div>
            
            <div className="map-container-leaflet">
                <MapContainer center={[lat, lon]} zoom={7} scrollWheelZoom={false}>
                    <MapController lat={lat} lon={lon} />
                    
                    {/* Base layer always present */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Weather Overlay Layer */}
                    {layerType !== 'none' && (
                        <TileLayer
                            key={layerType} // Force re-render when layer changes
                            url={`https://tile.openweathermap.org/map/${layers[layerType].code}/{z}/{x}/{y}.png?appid=${apiKey}`}
                            attribution='&copy; <a href="http://openweathermap.org">OpenWeatherMap</a>'
                            opacity={0.65} // Balanced opacity to see base map and weather data
                        />
                    )}

                    <Marker position={[lat, lon]}>
                        <Popup>
                            Sua localização meteorológica.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export default InteractiveMap;
