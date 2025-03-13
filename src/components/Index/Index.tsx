import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icono personalizado para los marcadores
const customIcon = new L.Icon({
  iconUrl: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
  iconSize: [32, 32],
  iconAnchor: [12, 12],
  popupAnchor: [1, -34],
});

// Datos de circunscripciones con coordenadas
const santaCruzData = [
  {
    id: 1,
    name: "Circunscripción 1",
    center: { lat: -17.7700, lng: -63.1769 },
    polygon: [
      [-17.765, -63.180], [-17.775, -63.170], [-17.780, -63.185], [-17.770, -63.190], [-17.765, -63.180]
    ],
    neighborhoods: [
      { id: 101, name: "Barrio Equipetrol", lat: -17.7700, lng: -63.1769 },
      { id: 102, name: "Barrio Urbarí", lat: -17.7832, lng: -63.1875 },
    ],
  },
  {
    id: 2,
    name: "Circunscripción 2",
    center: { lat: -17.8012, lng: -63.1648 },
    polygon: [
      [-17.798, -63.168], [-17.805, -63.160], [-17.810, -63.170], [-17.800, -63.175], [-17.798, -63.168]
    ],
    neighborhoods: [
      { id: 201, name: "Barrio Hamacas", lat: -17.8012, lng: -63.1648 },
      { id: 202, name: "Barrio Sirari", lat: -17.7886, lng: -63.1595 },
    ],
  },
];

// Componente que mueve el mapa al centro seleccionado
const MapUpdater = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  map.flyTo(center, 14, { animate: true }); // Animación suave
  return null;
};

const MapComponent = () => {
  const [selectedCirc, setSelectedCirc] = useState(santaCruzData[0]);
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);

  // Manejo del cambio de circunscripción
  const handleSelectChange = (event: any) => {
    const circId = parseInt(event.target.value, 10);
    const newCirc = santaCruzData.find((c) => c.id === circId);
    if (newCirc) {
      setSelectedCirc(newCirc);
      setSelectedMarker(null); // Reiniciar marcador seleccionado
    }
  };

  // Manejo de clic en marcador
  const handleMarkerClick = (lat: number, lng: number) => {
    setSelectedMarker({ lat, lng });
  };

  return (
    <div>
      <label>Seleccionar Circunscripción:</label>
      <select onChange={handleSelectChange} value={selectedCirc.id}>
        {santaCruzData.map((circ) => (
          <option key={circ.id} value={circ.id}>{circ.name}</option>
        ))}
      </select>

      <MapContainer center={selectedCirc.center} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Centrar mapa cuando cambia la circunscripción */}
        <MapUpdater center={selectedMarker || selectedCirc.center} />

        {/* Dibujar la circunscripción */}
        <Polygon positions={selectedCirc.polygon} color="#c1121f" fillColor="rgba(0, 0, 255, 0.2)" />

        {/* Renderizar marcadores de barrios */}
        {selectedCirc.neighborhoods.map((neighborhood) => (
          <Marker
            key={neighborhood.id}
            position={[neighborhood.lat, neighborhood.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(neighborhood.lat, neighborhood.lng),
            }}
          >
            <Popup>{neighborhood.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
