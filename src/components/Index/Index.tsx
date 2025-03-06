import { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useAuth } from "@/mk/contexts/AuthProvider";
import NotAccess from "../auth/NotAccess/NotAccess";
import styles from "./index.module.css";

const countries: any = [
  {
    country: "Uruguay",
    city: "Montevideo",
    neighborhoods: [
      { id: 1, name: "Pocitos", lat: -34.9094, lng: -56.1368, population: 45000 },
      { id: 2, name: "Ciudad Vieja", lat: -34.9065, lng: -56.2115, population: 12000 },
      { id: 3, name: "Carrasco", lat: -34.8789, lng: -56.0578, population: 18000 },
      { id: 4, name: "Malvín", lat: -34.8856, lng: -56.1267, population: 22000 },
      { id: 5, name: "Centro", lat: -34.9032, lng: -56.1882, population: 35000 },
    ],
  },
  {
    country: "Argentina",
    city: "Buenos Aires",
    neighborhoods: [
      { id: 6, name: "Palermo", lat: -34.5722, lng: -58.4232, population: 250000 },
      { id: 7, name: "Recoleta", lat: -34.5892, lng: -58.3974, population: 150000 },
      { id: 8, name: "San Telmo", lat: -34.6211, lng: -58.3737, population: 30000 },
      { id: 9, name: "Belgrano", lat: -34.5614, lng: -58.4562, population: 160000 },
      { id: 10, name: "La Boca", lat: -34.6345, lng: -58.3631, population: 46000 },
    ],
  },
  {
    country: "Chile",
    city: "Santiago",
    neighborhoods: [
      { id: 11, name: "Providencia", lat: -33.4378, lng: -70.6114, population: 142000 },
      { id: 12, name: "Las Condes", lat: -33.4084, lng: -70.5670, population: 300000 },
      { id: 13, name: "La Florida", lat: -33.5276, lng: -70.5835, population: 365000 },
      { id: 14, name: "Ñuñoa", lat: -33.4538, lng: -70.6010, population: 210000 },
      { id: 15, name: "Santiago Centro", lat: -33.4489, lng: -70.6693, population: 400000 },
    ],
  },
  {
    country: "Perú",
    city: "Lima",
    neighborhoods: [
      { id: 16, name: "Miraflores", lat: -12.1200, lng: -77.0300, population: 100000 },
      { id: 17, name: "San Isidro", lat: -12.0971, lng: -77.0288, population: 60000 },
      { id: 18, name: "Barranco", lat: -12.1439, lng: -77.0193, population: 35000 },
      { id: 19, name: "Surco", lat: -12.1367, lng: -76.9944, population: 450000 },
      { id: 20, name: "La Molina", lat: -12.0871, lng: -76.9493, population: 150000 },
    ],
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: -34.9011, lng: -56.1645 };

const HomePage = () => {
  const { userCan } = useAuth();
  const { user } = useAuth();

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      {/* Selector de país */}
      <select
        onChange={(e) => {
          const country = countries.find((c: any) => c.city === e.target.value);
          if (country) setSelectedCountry(country);
        }}
        value={selectedCountry.city}
      >
        {countries.map((country: any) => (
          <option key={country.city} value={country.city}>
            {country.city}, {country.country}
          </option>
        ))}
      </select>

      {/* Mapa de Google */}
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{
            lat: selectedCountry.neighborhoods[0].lat,
            lng: selectedCountry.neighborhoods[0].lng,
          }}
          zoom={12}
        >
          {/* Marcadores de los barrios */}
          {selectedCountry.neighborhoods.map((neighborhood: any) => (
            <Marker
              key={neighborhood.id}
              position={{ lat: neighborhood.lat, lng: neighborhood.lng }}
              onClick={() => setActiveMarker(neighborhood.id)}
            />
          ))}

          {/* InfoWindow para mostrar detalles del barrio */}
          {activeMarker !== null && (
            <InfoWindow
              position={{
                lat: selectedCountry.neighborhoods.find((n: any) => n.id === activeMarker).lat,
                lng: selectedCountry.neighborhoods.find((n: any) => n.id === activeMarker).lng,
              }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div style={{ color: "#212121", fontSize: 18, fontWeight: 500 }}>
                <p>
                  <strong>Barrio:</strong>{" "}
                  {selectedCountry.neighborhoods.find((n: any) => n.id === activeMarker).name}
                </p>
                <p>
                  <strong>Habitantes:</strong>{" "}
                  {selectedCountry.neighborhoods.find((n: any) => n.id === activeMarker).population}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default HomePage;
