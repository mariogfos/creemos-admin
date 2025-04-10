import React, { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
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

// Componente que actualiza la vista del mapa
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true });
  }, [center, map, zoom]);
  return null;
};

const GeolocationEnclosures = ({ formState, data }: TypeProps) => {
  console.log('data recibida:', data);
  
  // Estados para el mapa
  const [mapCenter, setMapCenter] = useState<[number, number]>([-17.783, -63.182]);
  const [mapZoom, setMapZoom] = useState(7);
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mover el useEffect para los íconos AQUÍ, dentro del componente
  // Solución para los íconos de Leaflet en Next.js
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      // Configurar iconos manualmente usando una aproximación más segura para TypeScript
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    }
  }, []);

  // Función para convertir coordenadas con comas a números
  const parseCoordinate = (coordStr: string): number => {
    if (!coordStr) return 0;
    try {
      return parseFloat(coordStr.replace(',', '.'));
    } catch (e) {
      console.error("Error al convertir coordenada:", coordStr, e);
      return 0;
    }
  };

  // Extraer la data normalizada
  const normalizedData = useMemo(() => {
    if (!data) return null;
    
    // Manejar diferentes estructuras de datos posibles
    const actualData = data.data?.data || data.data || data;
    
    return {
      areas: actualData.areas || {},
      grals: actualData.grals || {}
    };
  }, [data]);

  // Generar marcadores basados en la selección actual
  useEffect(() => {
    if (!normalizedData) {
      setLoading(true);
      return;
    }

    try {
      console.log("Generando marcadores según selección:", formState);
      const newMarkers: any[] = [];
      let newCenter: [number, number] = [-17.783, -63.182];
      let newZoom = 7;
      
      // Si no hay selección, mostrar todas las provincias
      if (!formState.prov_id) {
        // Mostrar marcadores para todas las provincias
        Object.entries(normalizedData.areas).forEach(([provinceName, provinceData]: [string, any]) => {
          if (provinceData?.center) {
            const lat = parseCoordinate(provinceData.center.lat);
            const lng = parseCoordinate(provinceData.center.lng);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              newMarkers.push({
                id: `prov-${provinceName}`,
                name: provinceName,
                position: [lat, lng] as [number, number],
                type: 'province'
              });
            }
          }
        });
      } 
      // Si hay provincia seleccionada
      else if (formState.prov_id && normalizedData.areas[formState.prov_id]) {
        const province = normalizedData.areas[formState.prov_id];
        
        // Establecer centro en la provincia
        if (province.center) {
          const lat = parseCoordinate(province.center.lat);
          const lng = parseCoordinate(province.center.lng);
          newCenter = [lat, lng];
          newZoom = 9;
          
          // Añadir marcador para la provincia
          newMarkers.push({
            id: `prov-${formState.prov_id}`,
            name: formState.prov_id,
            position: newCenter,
            type: 'province'
          });
        }
        
        // Si no hay municipio seleccionado, mostrar todos los municipios de la provincia
        if (!formState.mun_id && province.locations) {
          Object.entries(province.locations).forEach(([munName, munData]: [string, any]) => {
            if (munData?.center) {
              const lat = parseCoordinate(munData.center.lat);
              const lng = parseCoordinate(munData.center.lng);
              
              if (!isNaN(lat) && !isNaN(lng)) {
                newMarkers.push({
                  id: `mun-${munName}`,
                  name: munName,
                  position: [lat, lng] as [number, number],
                  type: 'municipality'
                });
              }
            }
          });
        }
        // Si hay municipio seleccionado
        else if (formState.mun_id && province.locations?.[formState.mun_id]) {
          const municipality = province.locations[formState.mun_id];
          
          // Establecer centro en el municipio
          if (municipality.center) {
            const lat = parseCoordinate(municipality.center.lat);
            const lng = parseCoordinate(municipality.center.lng);
            newCenter = [lat, lng];
            newZoom = 11;
            
            // Añadir marcador para el municipio
            newMarkers.push({
              id: `mun-${formState.mun_id}`,
              name: formState.mun_id,
              position: newCenter,
              type: 'municipality'
            });
          }
          
          // Si no hay distrito seleccionado, mostrar todos los distritos del municipio
          if (!formState.dmun_id && municipality.districts) {
            Object.entries(municipality.districts).forEach(([distName, distData]: [string, any]) => {
              if (distData?.center) {
                const lat = parseCoordinate(distData.center.lat);
                const lng = parseCoordinate(distData.center.lng);
                
                if (!isNaN(lat) && !isNaN(lng)) {
                  newMarkers.push({
                    id: `dist-${distName}`,
                    name: `Distrito ${distName}`,
                    position: [lat, lng] as [number, number],
                    type: 'district'
                  });
                }
              }
            });
          }
          // Si hay distrito seleccionado
          else if (formState.dmun_id && municipality.districts?.[formState.dmun_id]) {
            const district = municipality.districts[formState.dmun_id];
            
            // Establecer centro en el distrito
            if (district.center) {
              const lat = parseCoordinate(district.center.lat);
              const lng = parseCoordinate(district.center.lng);
              newCenter = [lat, lng];
              newZoom = 13;
              
              // Añadir marcador para el distrito
              newMarkers.push({
                id: `dist-${formState.dmun_id}`,
                name: `Distrito ${formState.dmun_id}`,
                position: newCenter,
                type: 'district'
              });
            }
            
            // Mostrar locations del distrito si existen
            if (district.locations && district.locations.length > 0) {
              district.locations.forEach((location: any, index: number) => {
                if (location.lat && location.lng) {
                  const lat = parseCoordinate(location.lat);
                  const lng = parseCoordinate(location.lng);
                  
                  if (!isNaN(lat) && !isNaN(lng)) {
                    newMarkers.push({
                      id: `loc-${index}`,
                      name: location.name || `Ubicación ${index + 1}`,
                      position: [lat, lng] as [number, number],
                      type: 'location'
                    });
                  }
                }
              });
            }
          }
        }
      }
      
      console.log(`Generados ${newMarkers.length} marcadores`);
      setMarkers(newMarkers);
      setMapCenter(newCenter);
      setMapZoom(newZoom);
      setLoading(false);
    } catch (error) {
      console.error("Error al generar marcadores:", error);
      setLoading(false);
    }
  }, [normalizedData, formState]);

  // Manejar clic en marcador
  const handleMarkerClick = (marker: any) => {
    console.log("Marcador seleccionado:", marker);
    
    // Aquí podrías implementar la lógica para actualizar formState si es necesario
    // Por ejemplo, si hacen clic en una provincia, actualizar el select de provincia
  };

  // Crear un ícono personalizado según el tipo
  const createCustomIcon = (type: string) => {
    let color = "#2A81CB"; // azul por defecto (provincias)
    
    switch (type) {
      case 'province': 
        color = "#2A81CB"; // azul
        break;
      case 'municipality': 
        color = "#36AE3D"; // verde
        break;
      case 'district': 
        color = "#F99824"; // naranja
        break;
      case 'location': 
        color = "#CB2B2A"; // rojo
        break;
    }
    
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${type === 'province' ? 'blue' : type === 'municipality' ? 'green' : type === 'district' ? 'orange' : 'red'}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  };

  // Renderizar componente
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
              value={formatNumber(normalizedData?.grals?.enabled_recints || 0, 0)}
            />
            <WidgetGeneralResults
              text="Mesas habilitadas"
              value={formatNumber(normalizedData?.grals?.enabled_tables || 0, 0)}
            />
            <WidgetGeneralResults
              text="Votos habilitados"
              value={formatNumber(normalizedData?.grals?.enabled_votes || 0, 0)}
            />
            <WidgetGeneralResults
              text="Votos válidos"
              value={formatNumber(normalizedData?.grals?.valid_votes || 0, 0)}
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
              value={formatNumber(normalizedData?.grals?.creemos_votes || 0, 0)}
            />
            <WidgetGeneralResults
              text="Votos obtenidos por MAS-IPSP"
              value={formatNumber(normalizedData?.grals?.mas_votes || 0, 0)}
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

      <div style={{ height: "100%", width: "100%", position: "relative" }}>
        {loading ? (
          <div style={{ 
            position: "absolute", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)",
            color: "white",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "15px",
            borderRadius: "5px"
          }}>
            Cargando mapa...
          </div>
        ) : (
          <MapContainer
            key={`map-${formState.prov_id || "all"}-${formState.mun_id || "all"}-${formState.dmun_id || "all"}`}
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={createCustomIcon(marker.type)}
                eventHandlers={{
                  click: () => handleMarkerClick(marker),
                }}
              >
                <Popup>
                  <div>
                    <strong>{marker.name}</strong>
                    <div>Tipo: {marker.type}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default GeolocationEnclosures;
