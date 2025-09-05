import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapControllerProps {
  lat: number;
  lon: number;
}

// Solução para o problema de ícone ausente do Leaflet.
// @ts-expect-error: A propriedade _getIconUrl não existe nas definições de tipo do Leaflet,
// mas é necessária para corrigir um problema de ícone quebrado que acontece em alguns ambientes.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapController: React.FC<MapControllerProps> = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {
    // A cada vez que 'lat' ou 'lon' mudam, o mapa é atualizado para a nova localização.
    if (map) {
      map.setView([lat, lon], map.getZoom());
    }
  }, [map, lat, lon]);

  return null;
};

export default MapController;