import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapController from './MapController'; // Importe o novo componente

// Interface para as propriedades do componente
interface InteractiveMapProps {
    lat: number;
    lon: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lon }) => {
    return (
        <MapContainer 
            center={[lat, lon]} // O centro inicial é definido aqui
            zoom={7} 
            scrollWheelZoom={false}
            style={{ height: '400px', width: '100%', borderRadius: '15px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <TileLayer
                url="https://tiles.open-meteo.com/v1/rain/{z}/{x}/{y}.png"
                attribution='Rain data &copy; <a href="https://www.open-meteo.com/">Open-Meteo</a>'
            />

            {/* Este componente irá centralizar o mapa quando as coordenadas mudarem */}
            <MapController lat={lat} lon={lon} />

        </MapContainer>
    );
};

export default InteractiveMap;