import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

interface Props {
  locations: Location[];
  destination: string;
}

// Fix marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function ItineraryMap({ locations }: Props) {
  if (!locations || locations.length === 0) return null;

  const center = [locations[0].lat, locations[0].lng];
  const path = locations.map((loc) => [loc.lat, loc.lng]);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow">
      <MapContainer
        center={center as any}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.name}</strong>
              <br />
              {loc.description}
            </Popup>
          </Marker>
        ))}

        {locations.length > 1 && (
          <Polyline positions={path as any} color="orange" />
        )}
      </MapContainer>
    </div>
  );
}