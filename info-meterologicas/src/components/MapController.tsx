import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet'; // Importe a biblioteca Leaflet

interface MapControllerProps {
  lat: number;
  lon: number;
}

// @ts-expect-error: A propriedade _getIconUrl não existe nas definições de tipo do Leaflet.
// No entanto, é necessária para corrigir um problema de ícone quebrado.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapController: React.FC<MapControllerProps> = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setView([lat, lon], map.getZoom());
    }
  }, [map, lat, lon]);

  return null;
};

export default MapController;