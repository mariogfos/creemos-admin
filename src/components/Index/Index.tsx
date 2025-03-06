import { useEffect, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import useAxios from "@/mk/hooks/useAxios";
import { useAuth } from "@/mk/contexts/AuthProvider";
import NotAccess from "../auth/NotAccess/NotAccess";
import styles from "./index.module.css";

const places = [
  { id: 1, name: "Montevideo, Uruguay", lat: -34.9011, lng: -56.1645 },
  { id: 2, name: "Buenos Aires, Argentina", lat: -34.6037, lng: -58.3816 },
  { id: 3, name: "Santiago, Chile", lat: -33.4489, lng: -70.6693 },
  { id: 4, name: "Lima, Perú", lat: -12.0464, lng: -77.0428 },
];

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = places[0];

const HomePage = () => {
  const { userCan } = useAuth();
  const { user } = useAuth();
  const [selectedPlace, setSelectedPlace] = useState(defaultCenter);

  // if (!userCan("home", "R")) return <NotAccess />;

  return (
    <div className={styles.container}>
      <select
        onChange={(e) => {
          const place: any = places.find((p) => p.id === Number(e.target.value));
          setSelectedPlace(place);
        }}
        value={selectedPlace.id}
      >
        {places.map((place) => (
          <option key={place.id} value={place.id}>
            {place.name}
          </option>
        ))}
      </select>

      <LoadScript googleMapsApiKey={process.env.NEXT_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
          zoom={12}
        />
      </LoadScript>
    </div>
  );
};

export default HomePage;