import { useEffect } from 'react';
import { useMap } from 'react-leaflet';


interface MapControllerProps {
  lat: number;
  lon: number;
}



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