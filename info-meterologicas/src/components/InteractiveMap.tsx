import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Importa os ícones padrão do Leaflet para corrigir o problema de renderização
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Define o ícone padrão do Leaflet para todos os marcadores
L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
    lat: number;
    lon: number;
}

// Componente auxiliar para centralizar o mapa quando as coordenadas mudam
const MapController: React.FC<InteractiveMapProps> = ({ lat, lon }) => {
    const map = useMap();

    useEffect(() => {
        // Verifica se as coordenadas são válidas antes de mover o mapa
        if (lat && lon) {
            map.setView([lat, lon], map.getZoom());
        }
    }, [map, lat, lon]);

    return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lon }) => {
    // Usa useMemo para garantir que o mapa só seja re-renderizado se a posição mudar
    const position = useMemo(() => [lat, lon], [lat, lon]) as [number, number];

    return (
        <MapContainer
            center={position}
            zoom={10}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', borderRadius: '15px' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
            {/* O componente MapController garante que o mapa se mova com as novas coordenadas */}
            <MapController lat={lat} lon={lon} />
        </MapContainer>
    );
};

export default InteractiveMap;