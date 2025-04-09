import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import WidgetBase from "@/components/Widgets/WidgetBase/WidgetBase";
import WidgetGeneralResults from "@/components/Widgets/WidgetGeneralResults/WidgetGeneralResults";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { categories } from "../CategorizationEnclosures/CategorizationEnclosures";
import Image from "next/image";
import creemos from "../../../public/images/creemos.png";
import mas from "../../../public/images/mas.png";
import { formatNumber } from "../../mk/utils/numbers";

type TypeProps = {
  data: any;
  formState: any;
};

// Icono personalizado para los marcadores
const customIcon = new L.Icon({
  iconUrl:
    "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
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
            center: { lat: -17.77, lng: -63.1769 },
            locations: [
              { id: 1, name: "Localidad A", lat: -17.77, lng: -63.1769 },
              { id: 2, name: "Localidad B", lat: -17.7832, lng: -63.1875 },
            ],
          },
          "Distrito 2": {
            center: { lat: -17.795, lng: -63.165 },
            locations: [
              { id: 3, name: "Localidad C", lat: -17.795, lng: -63.165 },
            ],
          },
          "Distrito 3": {
            center: { lat: -17.775, lng: -63.155 },
            locations: [
              { id: 4, name: "Localidad D", lat: -17.775, lng: -63.155 },
            ],
          },
        },
      },
      Cotoca: {
        center: { lat: -17.7167, lng: -62.9833 },
        districts: {
          "Distrito 1": {
            center: { lat: -17.716, lng: -62.983 },
            locations: [
              { id: 5, name: "Localidad A", lat: -17.716, lng: -62.983 },
            ],
          },
          "Distrito 2": {
            center: { lat: -17.718, lng: -62.985 },
            locations: [
              { id: 6, name: "Localidad B", lat: -17.718, lng: -62.985 },
            ],
          },
        },
      },
      Porongo: {
        center: { lat: -17.8333, lng: -63.2833 },
        districts: {
          "Distrito Único": {
            center: { lat: -17.8333, lng: -63.2833 },
            locations: [
              { id: 7, name: "Localidad A", lat: -17.8333, lng: -63.2833 },
            ],
          },
        },
      },
    },
  },
  Warnes: {
    center: { lat: -17.5166, lng: -63.1666 },
    locations: {
      Warnes: {
        center: { lat: -17.5166, lng: -63.1666 },
        districts: {
          "Distrito 1": {
            center: { lat: -17.516, lng: -63.166 },
            locations: [
              { id: 8, name: "Localidad A", lat: -17.516, lng: -63.166 },
            ],
          },
          "Distrito 2": {
            center: { lat: -17.518, lng: -63.168 },
            locations: [
              { id: 9, name: "Localidad B", lat: -17.518, lng: -63.168 },
            ],
          },
        },
      },
      "Okinawa Uno": {
        center: { lat: -17.2247, lng: -62.893 },
        districts: {
          "Distrito Único": {
            center: { lat: -17.2247, lng: -62.893 },
            locations: [
              { id: 10, name: "Localidad A", lat: -17.2247, lng: -62.893 },
            ],
          },
        },
      },
    },
  },
  Chiquitos: {
    center: { lat: -17.8667, lng: -60.7333 },
    locations: {
      "San José de Chiquitos": {
        center: { lat: -17.8667, lng: -60.7333 },
        districts: {
          "Distrito 1": {
            center: { lat: -17.8667, lng: -60.7333 },
            locations: [
              { id: 11, name: "Localidad A", lat: -17.8667, lng: -60.7333 },
            ],
          },
        },
      },
      Roboré: {
        center: { lat: -18.3333, lng: -59.7333 },
        districts: {
          "Distrito 1": {
            center: { lat: -18.3333, lng: -59.7333 },
            locations: [
              { id: 12, name: "Localidad A", lat: -18.3333, lng: -59.7333 },
            ],
          },
        },
      },
    },
  },
  Guarayos: {
    center: { lat: -15.8833, lng: -63.3333 },
    locations: {
      "Ascensión de Guarayos": {
        center: { lat: -15.8833, lng: -63.3333 },
        districts: {
          "Distrito 1": {
            center: { lat: -15.8833, lng: -63.3333 },
            locations: [
              { id: 13, name: "Localidad A", lat: -15.8833, lng: -63.3333 },
            ],
          },
        },
      },
    },
  },
};

// Componente que mueve el mapa al centro seleccionado
const MapUpdater = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  map.flyTo(center, 14, { animate: true }); // Animación suave
  return null;
};

const GeolocationEnclosures = ({ formState, data }: TypeProps) => {
  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Función para obtener el centro y los marcadores según la selección
  const getMapData = () => {
    const defaultCenter = { lat: -17.78, lng: -63.18 };
    let markers = [];
    let center = defaultCenter;

    if (formState.prov_id && locationData[formState?.prov_id]) {
      center = locationData[formState?.prov_id].center;

      if (
        formState?.mun_id &&
        locationData[formState?.prov_id].locations[formState?.mun_id]
      ) {
        center =
          locationData[formState?.prov_id].locations[formState?.mun_id].center;

        if (
          formState?.dmun_id &&
          locationData[formState?.prov_id].locations[formState?.mun_id]
            .districts[formState?.dmun_id]
        ) {
          const district =
            locationData[formState?.prov_id].locations[formState?.mun_id]
              .districts[formState?.dmun_id];
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

  console.log(data?.data?.grals?.creemos_votes);
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "var(--cBlackV1)",
        borderRadius: 8,
        height: "calc(100vh - 350px)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 440,
          position: "relative",
        }}
      >
        <WidgetBase title="Resultados generales">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              overflowY: "auto",
              height: "calc(100vh - 530px)",
            }}
          >
            <WidgetGeneralResults
              text="Recintos habilitados"
              value={formatNumber(data?.data?.grals?.enabled_recints, 0)}
            />
            <WidgetGeneralResults
              text="Mesas habilitadas"
              value={formatNumber(data?.data?.grals?.enabled_tables, 0)}
            />
            <WidgetGeneralResults
              text="Votos habilitados"
              value={formatNumber(data?.data?.grals?.enabled_votes, 0)}
            />
            <WidgetGeneralResults
              text="Votos válidos"
              value={formatNumber(data?.data?.grals?.valid_votes, 0)}
            />
            <WidgetGeneralResults
              icon={
                <Image
                  src={creemos}
                  alt=""
                  priority
                  style={{ width: 40, height: 40 }}
                />
              }
              styleValue={{ color: "#91268E" }}
              text="Votos obtenidos por creemos"
              value={formatNumber(data?.data?.grals?.creemos_votes, 0)}
            />
            <WidgetGeneralResults
              text="Votos obtenidos por MAS-IPSP"
              value={formatNumber(data?.data?.grals?.mas_votes, 0)}
              styleValue={{ color: "var(--cInfo)" }}
              icon={
                <Image
                  src={mas}
                  alt=""
                  priority
                  style={{ width: 40, height: 40 }}
                />
              }
            />
          </div>
        </WidgetBase>
        <div
          style={{
            position: "absolute",
            bottom: 24,
            width: "100%",
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <p
            style={{
              color: "var(--cBlackV2)",
              fontWeight: 400,
              marginBottom: 14,
            }}
          >
            Categorías de recintos
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {categories.map((category, i) => (
              <Avatar
                key={i}
                style={{ backgroundColor: category.color }}
                name={category.name}
                h={38}
                w={38}
              />
            ))}
          </div>
        </div>
      </div>

      <MapContainer
        key={`${formState?.prov_id}-${formState?.mun_id}-${formState?.dmun_id}`}
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
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
