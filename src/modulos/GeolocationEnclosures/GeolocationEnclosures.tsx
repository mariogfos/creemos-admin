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
    map.flyTo(center, zoom, { animate: true, duration: 1.5 });
  }, [center, map, zoom]);
  return null;
};

const GeolocationEnclosures = ({ formState, data }: TypeProps) => {
  console.log('data recibida:', data);
  console.log('formState recibido:', formState);

  // Estados para el mapa
  const [mapCenter, setMapCenter] = useState<[number, number]>([-17.783, -63.182]);
  const [mapZoom, setMapZoom] = useState(7);
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [prevFormState, setPrevFormState] = useState<any>(null);
  const [initialDataReceived, setInitialDataReceived] = useState(false);

  // Detectar la carga inicial de datos
  useEffect(() => {
    if (data && !initialDataReceived) {
      setInitialDataReceived(true);
      setLoading(true);
      console.log("Datos iniciales recibidos, esperando 4 segundos...");

      // Esperar 4 segundos antes de procesar los datos iniciales
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  }, [data, initialDataReceived]);

  // Detectar cambios en formState para mostrar transición
  useEffect(() => {
    if (prevFormState && JSON.stringify(prevFormState) !== JSON.stringify(formState)) {
      setTransitioning(true);
      setLoading(true);

      console.log("formState cambió, esperando 4 segundos para actualizar...");

      // Esperar 4 segundos antes de actualizar la vista
      setTimeout(() => {
        setTransitioning(false);
        setLoading(false);
      }, 4000);
    }

    setPrevFormState(formState);
  }, [formState, prevFormState]);

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

    if (transitioning) {
      // Si estamos en transición, no procesar aún los marcadores
      return;
    }

    try {
      console.log("Generando marcadores según selección:", formState);
      const newMarkers: any[] = [];
      let newCenter: [number, number] = [-17.783, -63.182];
      let newZoom = 7;

      // Estrategia: Primero intentar encontrar y centrarse en el nivel más específico seleccionado
      // y luego mostrar todos los marcadores relevantes para ese nivel

      // Caso 1: Selección de distrito específico
      if (formState.prov_id && formState.mun_id && formState.dmun_id &&
        normalizedData.areas[formState.prov_id]?.locations?.[formState.mun_id]?.districts?.[formState.dmun_id]) {

        console.log(`Navegando al distrito ${formState.dmun_id} del municipio ${formState.mun_id} en provincia ${formState.prov_id}`);
        const province = normalizedData.areas[formState.prov_id];
        const municipality = province.locations[formState.mun_id];
        const district = municipality.districts[formState.dmun_id];

        if (district.center) {
          const lat = parseCoordinate(district.center.lat);
          const lng = parseCoordinate(district.center.lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            newCenter = [lat, lng];
            newZoom = 15;

            // Añadir marcador para el distrito seleccionado
            newMarkers.push({
              id: `dist-${formState.dmun_id}`,
              name: `Distrito ${formState.dmun_id}`,
              position: newCenter,
              type: 'district'
            });

            // Mostrar locations del distrito si existen
            if (district.locations && district.locations.length > 0) {
              district.locations.forEach((location: any, index: number) => {
                if (location.lat && location.lng) {
                  const locLat = parseCoordinate(location.lat);
                  const locLng = parseCoordinate(location.lng);

                  if (!isNaN(locLat) && !isNaN(locLng)) {
                    newMarkers.push({
                      id: `loc-${index}`,
                      name: location.name || `Ubicación ${index + 1}`,
                      position: [locLat, locLng] as [number, number],
                      type: 'location'
                    });
                  }
                }
              });
            }
          }
        }
      }
      // Caso 2: Selección de municipio específico
      else if (formState.prov_id && formState.mun_id &&
        normalizedData.areas[formState.prov_id]?.locations?.[formState.mun_id]) {

        console.log(`Navegando al municipio ${formState.mun_id} en provincia ${formState.prov_id}`);
        const province = normalizedData.areas[formState.prov_id];
        const municipality = province.locations[formState.mun_id];

        if (municipality.center) {
          const lat = parseCoordinate(municipality.center.lat);
          const lng = parseCoordinate(municipality.center.lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            newCenter = [lat, lng];
            newZoom = 11;

            // Añadir marcador para el municipio seleccionado
            newMarkers.push({
              id: `mun-${formState.mun_id}`,
              name: formState.mun_id,
              position: newCenter,
              type: 'municipality'
            });

            // Mostrar distritos del municipio
            if (municipality.districts && Object.keys(municipality.districts).length > 0) {
              Object.entries(municipality.districts).forEach(([distName, distData]: [string, any]) => {
                if (distData?.center) {
                  const distLat = parseCoordinate(distData.center.lat);
                  const distLng = parseCoordinate(distData.center.lng);

                  if (!isNaN(distLat) && !isNaN(distLng)) {
                    newMarkers.push({
                      id: `dist-${distName}`,
                      name: `Distrito ${distName}`,
                      position: [distLat, distLng] as [number, number],
                      type: 'district'
                    });
                  }
                }
              });
            }
          }
        }
      }
      // Caso 3: Selección de provincia específica
      else if (formState.prov_id && normalizedData.areas[formState.prov_id]) {

        console.log(`Navegando a la provincia ${formState.prov_id}`);
        const province = normalizedData.areas[formState.prov_id];

        if (province.center) {
          const lat = parseCoordinate(province.center.lat);
          const lng = parseCoordinate(province.center.lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            newCenter = [lat, lng];
            newZoom = 9;

            // Añadir marcador para la provincia seleccionada
            newMarkers.push({
              id: `prov-${formState.prov_id}`,
              name: formState.prov_id,
              position: newCenter,
              type: 'province'
            });

            // Mostrar todas las locations (municipios) de la provincia
            if (province.locations && Object.keys(province.locations).length > 0) {
              console.log(`Mostrando ${Object.keys(province.locations).length} locations para provincia ${formState.prov_id}`);

              Object.entries(province.locations).forEach(([locationName, locationData]: [string, any]) => {
                if (locationData?.center) {
                  const locLat = parseCoordinate(locationData.center.lat);
                  const locLng = parseCoordinate(locationData.center.lng);

                  if (!isNaN(locLat) && !isNaN(locLng)) {
                    newMarkers.push({
                      id: `mun-${locationName}`,
                      name: locationName,
                      position: [locLat, locLng] as [number, number],
                      type: 'municipality',
                      prov_id: formState.prov_id
                    });
                    console.log(`Añadido marcador para location: ${locationName} en [${locLat}, ${locLng}]`);
                  }
                }
              });
            }
          }
        }
      }
      // Caso 4: Sin selección específica, mostrar todas las provincias
      else {
        console.log("Mostrando todas las provincias");

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

        newZoom = 6;
      }

      console.log(`Generados ${newMarkers.length} marcadores con zoom ${newZoom} para coordenadas [${newCenter[0]}, ${newCenter[1]}]`);
      setMarkers(newMarkers);
      setMapCenter(newCenter);
      setMapZoom(newZoom);
    } catch (error) {
      console.error("Error al generar marcadores:", error);
    }
  }, [normalizedData, formState, transitioning]);

  // Manejar clic en marcador
  const handleMarkerClick = (marker: any) => {
    console.log("Marcador seleccionado:", marker);

    // Implementar lógica para navegar al hacer clic en un marcador
    // Por ejemplo, si se hace clic en un marcador de municipio, podríamos actualizar formState
    if (marker.type === 'municipality' && marker.prov_id) {
      // Aquí podrías implementar la lógica para cambiar la selección en los selects
      // Por ejemplo, emitir un evento o actualizar directamente el formState
      console.log(`Navegar a municipio ${marker.name} en provincia ${marker.prov_id}`);
    }
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
        {(loading || transitioning) ? (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            minWidth: "200px"
          }}>
            <div className="spinner" style={{
              width: "40px",
              height: "40px",
              margin: "0 auto 15px",
              border: "4px solid rgba(255,255,255,0.3)",
              borderRadius: "50%",
              borderTop: "4px solid white",
              animation: "spin 1s linear infinite",
            }}></div>
            <div>Cargando mapa...</div>
            <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.8 }}>
              {transitioning ? 'Actualizando datos...' : 'Preparando visualización...'}
            </div>
          </div>
        ) : (
          <>
            <style jsx global>{`
              @keyframes fadeInOut {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>

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
                    <div style={{
                      minWidth: "250px",
                      maxWidth: "300px",
                      padding: "5px",
                      fontFamily: "Arial, sans-serif"
                    }}>
                      <h3 style={{
                        marginTop: "0",
                        marginBottom: formState.prov_code  ? "10px" : "0",
                        padding: "5px 0",
                        borderBottom: formState.prov_code  ? "2px solid #eee" : "none",
                        color: marker.type === 'province' ? '#2A81CB' :
                          marker.type === 'municipality' ? '#36AE3D' :
                            marker.type === 'district' ? '#F99824' : '#CB2B2A'
                      }}>
                        {marker.name}
                        <span style={{
                          fontSize: "12px",
                          fontWeight: "normal",
                          display: "block",
                          marginTop: "3px",
                          color: "#666"
                        }}>
                          {marker.type === 'province' ? 'Provincia' :
                            marker.type === 'municipality' ? 'Municipio' :
                              marker.type === 'district' ? 'Distrito' : 'Ubicación'}
                        </span>
                      </h3>

                      {/* Solo mostrar datos si el formState tiene prov_code */}
                      {formState.prov_code && (
                        <div style={{ marginBottom: "15px" }}>
                          <div style={{ marginBottom: "15px" }}>
                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "5px 0",
                              borderBottom: "1px solid #f0f0f0"
                            }}>
                              <span style={{ fontWeight: "bold", fontSize: "13px" }}>Mesas habilitadas:</span>
                              <span style={{
                                backgroundColor: "#f5f5f5",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: "500"
                              }}>
                                {formatNumber(data?.data?.grals?.enabled_tables || 0, 0)}
                              </span>
                            </div>

                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "5px 0",
                              borderBottom: "1px solid #f0f0f0"
                            }}>
                              <span style={{ fontWeight: "bold", fontSize: "13px" }}>Votos habilitados:</span>
                              <span style={{
                                backgroundColor: "#f5f5f5",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: "500"
                              }}>
                                {formatNumber(data?.data?.grals?.enabled_votes || 0, 0)}
                              </span>
                            </div>

                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "5px 0",
                              borderBottom: "1px solid #f0f0f0"
                            }}>
                              <span style={{ fontWeight: "bold", fontSize: "13px" }}>Votos válidos:</span>
                              <span style={{
                                backgroundColor: "#f5f5f5",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: "500"
                              }}>
                                {formatNumber(data?.data?.grals?.valid_votes || 0, 0)}
                              </span>
                            </div>
                          </div>

                          <div style={{
                            backgroundColor: "#f9f9f9",
                            padding: "8px",
                            borderRadius: "6px",
                            marginBottom: "5px"
                          }}>
                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "5px 0",
                              borderBottom: "1px solid #eee"
                            }}>
                              <span style={{
                                fontWeight: "bold",
                                fontSize: "13px",
                                color: "#91268E"
                              }}>
                                Votos CREEMOS:
                              </span>
                              <span style={{
                                backgroundColor: "#91268E20",
                                color: "#91268E",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: "bold"
                              }}>
                                {formatNumber(data?.data?.grals?.creemos_votes || 0, 0)}
                              </span>
                            </div>

                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "5px 0"
                            }}>
                              <span style={{
                                fontWeight: "bold",
                                fontSize: "13px",
                                color: "var(--cInfo)"
                              }}>
                                Votos MAS-IPSP:
                              </span>
                              <span style={{
                                backgroundColor: "rgba(0, 124, 186, 0.1)",
                                color: "var(--cInfo)",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: "bold"
                              }}>
                                {formatNumber(data?.data?.grals?.mas_votes || 0, 0)}
                              </span>
                            </div>
                          </div>

                          {/* Calcular porcentajes */}
                          {data?.data?.grals?.valid_votes > 0 && (
                            <div style={{ fontSize: "11px", color: "#666", textAlign: "center", marginTop: "5px" }}>
                              Participación: {formatNumber(data?.data?.grals?.valid_votes * 100 / (data?.data?.grals?.enabled_votes || 1), 1)}%
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </>
        )}
      </div>
    </div >
  );
};

export default GeolocationEnclosures;
