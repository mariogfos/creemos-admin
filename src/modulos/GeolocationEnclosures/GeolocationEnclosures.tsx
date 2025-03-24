import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type TypeProps = {
  data: {
    prov_id?: string;
    mun_id?: string;
    dmun_id?: string;
    local_id?: string;
    recinto_id?: string;
  };
};

// Icono personalizado para los marcadores
const customIcon = new L.Icon({
  iconUrl: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
  iconSize: [32, 32],
  iconAnchor: [12, 12],
  popupAnchor: [1, -34],
});

// Datos de ejemplo organizados por niveles (esto deberías reemplazarlo con datos reales)
const locationData: any = {
  "Andrés Ibáñez": {
    center: { lat: -17.7833, lng: -63.1667 },
    locations: {
      "Santa Cruz de la Sierra": {
        center: { lat: -17.7863, lng: -63.1745 },
        districts: {
          "Distrito 1": {
            center: { lat: -17.7700, lng: -63.1769 },
            locations: [
              { id: 1, name: "Localidad A", lat: -17.7700, lng: -63.1769 },
              { id: 2, name: "Localidad B", lat: -17.7832, lng: -63.1875 }
            ]
          },
          "Distrito 2": {
            center: { lat: -17.7950, lng: -63.1650 },
            locations: [
              { id: 3, name: "Localidad C", lat: -17.7950, lng: -63.1650 }
            ]
          },
          "Distrito 3": {
            center: { lat: -17.7750, lng: -63.1550 },
            locations: [
              { id: 4, name: "Localidad D", lat: -17.7750, lng: -63.1550 }
            ]
          }
        }
      },
      "Cotoca": {
        center: { lat: -17.7167, lng: -62.9833 },
        districts: {
          "Distrito 1": {
            center: { lat: -17.7160, lng: -62.9830 },
            locations: [
              { id: 5, name: "Localidad A", lat: -17.7160, lng: -62.9830 }
            ]
          },
          "Distrito 2": {
            center: { lat: -17.7180, lng: -62.9850 },
            locations: [
              { id: 6, name: "Localidad B", lat: -17.7180, lng: -62.9850 }
            ]
          }
        }
      },
      "Porongo": {
        center: { lat: -17.8333, lng: -63.2833 },
        districts: {
          "Distrito Único": {
            center: { lat: -17.8333, lng: -63.2833 },
            locations: [
              { id: 7, name: "Localidad A", lat: -17.8333, lng: -63.2833 }
            ]
          }
        }
      }
    }
  },
  "Warnes": {
    center: { lat: -17.5166, lng: -63.1666 },
    locations: {
      "Warnes": {
        center: { lat: -17.5166, lng: -63.1666 },
        districts: {
          "Distrito 1": {
            center: { lat: -17.5160, lng: -63.1660 },
            locations: [
              { id: 8, name: "Localidad A", lat: -17.5160, lng: -63.1660 }
            ]
          },
          "Distrito 2": {
            center: { lat: -17.5180, lng: -63.1680 },
            locations: [
              { id: 9, name: "Localidad B", lat: -17.5180, lng: -63.1680 }
            ]
          }
        }
      },
      "Okinawa Uno": {
        center: { lat: -17.2247, lng: -62.8930 },
        districts: {
          "Distrito Único": {
            center: { lat: -17.2247, lng: -62.8930 },
            locations: [
              { id: 10, name: "Localidad A", lat: -17.2247, lng: -62.8930 }
            ]
          }
        }
      }
    }
  },
  "Chiquitos": {
    center: { lat: -17.8667, lng: -60.7333 },
    locations: {
      "San José de Chiquitos": {
        center: { lat: -17.8667, lng: -60.7333 },
        districts: {
          "Distrito 1": {
            center: { lat: -17.8667, lng: -60.7333 },
            locations: [
              { id: 11, name: "Localidad A", lat: -17.8667, lng: -60.7333 }
            ]
          }
        }
      },
      "Roboré": {
        center: { lat: -18.3333, lng: -59.7333 },
        districts: {
          "Distrito 1": {
            center: { lat: -18.3333, lng: -59.7333 },
            locations: [
              { id: 12, name: "Localidad A", lat: -18.3333, lng: -59.7333 }
            ]
          }
        }
      }
    }
  },
  "Guarayos": {
    center: { lat: -15.8833, lng: -63.3333 },
    locations: {
      "Ascensión de Guarayos": {
        center: { lat: -15.8833, lng: -63.3333 },
        districts: {
          "Distrito 1": {
            center: { lat: -15.8833, lng: -63.3333 },
            locations: [
              { id: 13, name: "Localidad A", lat: -15.8833, lng: -63.3333 }
            ]
          }
        }
      }
    }
  }
};

// Componente que mueve el mapa al centro seleccionado
const MapUpdater = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  map.flyTo(center, 14, { animate: true }); // Animación suave
  return null;
};

const GeolocationEnclosures = ({ data }: TypeProps) => {
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);

  // Función para obtener el centro y los marcadores según la selección
  const getMapData = () => {
    const defaultCenter = { lat: -17.7800, lng: -63.1800 };
    let markers = [];
    let center = defaultCenter;

    if (data.prov_id && locationData[data.prov_id]) {
      center = locationData[data.prov_id].center;
      
      if (data.mun_id && locationData[data.prov_id].locations[data.mun_id]) {
        center = locationData[data.prov_id].locations[data.mun_id].center;
        
        if (data.dmun_id && 
            locationData[data.prov_id].locations[data.mun_id].districts[data.dmun_id]) {
          const district = locationData[data.prov_id].locations[data.mun_id].districts[data.dmun_id];
          center = district.center;
          markers = district.locations;
        }
      }
    }

    return { center, markers };
  };

  const { center, markers } = getMapData();

  // Manejo de clic en marcador
  const handleMarkerClick = (lat: number, lng: number) => {
    setSelectedMarker({ lat, lng });
  };

  return (
    <div>
      <MapContainer 
        key={`${data.prov_id}-${data.mun_id}-${data.dmun_id}`} 
        center={center} 
        zoom={13} 
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapUpdater center={selectedMarker || center} />

        {markers.map((location: any) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(location.lat, location.lng),
            }}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GeolocationEnclosures;
