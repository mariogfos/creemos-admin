import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Definir icono de marcador personalizado
const customIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Datos de Santa Cruz con circunscripciones y barrios
const santaCruzData = [
  {
    id: 1,
    name: "Circunscripción 1",
    neighborhoods: [
      { id: 101, name: "Barrio Equipetrol", lat: -17.7700, lng: -63.1769 },
      { id: 102, name: "Barrio Urbarí", lat: -17.7832, lng: -63.1875 },
    ],
  },
  {
    id: 2,
    name: "Circunscripción 2",
    neighborhoods: [
      { id: 201, name: "Barrio Hamacas", lat: -17.8012, lng: -63.1648 },
      { id: 202, name: "Barrio Sirari", lat: -17.7886, lng: -63.1595 },
    ],
  },
  {
    id: 3,
    name: "Circunscripción 3",
    neighborhoods: [
      { id: 301, name: "Barrio Las Palmas", lat: -17.7804, lng: -63.2105 },
      { id: 302, name: "Barrio El Pari", lat: -17.7936, lng: -63.2130 },
    ],
  },
  {
    id: 4,
    name: "Circunscripción 4",
    neighborhoods: [
      { id: 401, name: "Barrio Los Cusis", lat: -17.7756, lng: -63.1493 },
      { id: 402, name: "Barrio La Morita", lat: -17.7612, lng: -63.1429 },
    ],
  },
  {
    id: 5,
    name: "Circunscripción 5",
    neighborhoods: [
      { id: 501, name: "Barrio El Trompillo", lat: -17.7910, lng: -63.2193 },
      { id: 502, name: "Barrio La Cuchilla", lat: -17.8025, lng: -63.2250 },
    ],
  },
];

const initialCenter = { lat: -17.7833, lng: -63.1821 }; // Centro de Santa Cruz

const MapComponent = () => {
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [selectedCirc, setSelectedCirc] = useState(1);

  const handleSelectChange = (event: any) => {
    const circId = parseInt(event.target.value, 10);
    setSelectedCirc(circId);
    const firstNeighborhood = santaCruzData.find((c) => c.id === circId)?.neighborhoods[0];
    if (firstNeighborhood) {
      setMapCenter({ lat: firstNeighborhood.lat, lng: firstNeighborhood.lng });
    }
  };

  return (
    <div>
      <select onChange={handleSelectChange} value={selectedCirc}>
        {santaCruzData.map((circ) => (
          <option key={circ.id} value={circ.id}>
            {circ.name}
          </option>
        ))}
      </select>

      <MapContainer center={mapCenter} zoom={13} style={{ width: "100%", height: "500px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {santaCruzData
          .find((circ) => circ.id === selectedCirc)
          ?.neighborhoods.map((neighborhood) => (
            <Marker
              key={neighborhood.id}
              position={[neighborhood.lat, neighborhood.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => setMapCenter({ lat: neighborhood.lat, lng: neighborhood.lng }),
              }}
            >
              <Popup>
                <b>{neighborhood.name}</b>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
