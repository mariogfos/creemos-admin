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

  // Solución para los íconos de Leaflet en Next.js
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      // Configurar iconos manualmente
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

  // Obtener la data normalizada de manera más simple
  const normalizedData = useMemo(() => {
    if (!data) return null;

    let actualData;
    if (data.data && data.data.data) {
      actualData = data.data.data;
    } else if (data.data) {
      actualData = data.data;
    } else {
      actualData = data;
    }

    return {
      areas: actualData.areas || {},
      grals: actualData.grals || {}
    };
  }, [data]);

  // NUEVA IMPLEMENTACIÓN SIMPLIFICADA PARA GENERAR MARCADORES
  useEffect(() => {
    if (!normalizedData || transitioning) {
      return;
    }

    try {
      // Limpiar marcadores anteriores
      setMarkers([]);

      const newMarkers: any[] = [];
      let newCenter: [number, number] = [-17.783, -63.182];
      let newZoom = 6;

      // Extraer los IDs/códigos de la selección actual
      const provinciaId = formState.prov_id || formState.prov_code || null;
      const municipioId = formState.mun_id || formState.mun_code || null;
      const distritoId = formState.dmun_id || formState.dmun_code || null;
      const localidadId = formState.local_id || formState.local_code || null;
      const recintoId = formState.recint_id || formState.recint_code || null;



      // Opción 1: Usando Object.entries para encontrar la provincia
      let provincia: any = null;
      let provinciaName: any = null;

      if (provinciaId) {


        // Recorrer todas las provincias para encontrar la que coincide con el ID
        Object.entries(normalizedData.areas).forEach(([nombre, datos]) => {
          provincia = datos;
          provinciaName = nombre;
        });

      }

      // CASO 1: NO HAY SELECCIÓN - Mostrar todas las provincias
      if (!provinciaId) {

        Object.entries(normalizedData.areas).forEach(([nombreProvincia, datosProvincia]: [string, any]) => {
          if (datosProvincia?.center) {
            const lat = parseCoordinate(datosProvincia.center.lat);
            const lng = parseCoordinate(datosProvincia.center.lng);

            if (!isNaN(lat) && !isNaN(lng)) {
              newMarkers.push({
                id: `prov-${nombreProvincia}`,
                name: nombreProvincia,
                position: [lat, lng],
                type: 'province'
              });
            }
          }
        });
        // Zoom para ver todo Santa Cruz
        newZoom = 6.8;
      }

      // CASO 2: HAY SELECCIÓN DE PROVINCIA
      else if (provincia) {


        // Centrar en la provincia
        if (provincia.center) {
          const latProv = parseCoordinate(provincia.center.lat);
          const lngProv = parseCoordinate(provincia.center.lng);

          if (!isNaN(latProv) && !isNaN(lngProv)) {
            newCenter = [latProv, lngProv];
            newZoom = 9.2;
          }
        }

        // CASO 2.1: Mostrar todos los municipios de la provincia
        if (provincia.locations) {


          Object.entries(provincia.locations).forEach(([nombreMunicipio, datosMunicipio]: [string, any]) => {
            if (datosMunicipio && datosMunicipio.center) {
              const latMun = parseCoordinate(datosMunicipio.center.lat);
              const lngMun = parseCoordinate(datosMunicipio.center.lng);

              if (!isNaN(latMun) && !isNaN(lngMun)) {
                // Agregar marcador para el municipio si no esta seleccionado
                if (municipioId == null) {
                  newMarkers.push({
                    id: `mun-${nombreMunicipio}`,
                    name: nombreMunicipio,
                    position: [latMun, lngMun],
                    type: 'municipality',
                    prov_id: provinciaId
                  });
                }


                // CASO 2.2: Si este municipio está seleccionado
                if (municipioId) {


                  // Centrar en el municipio seleccionado
                  newCenter = [latMun, lngMun];
                  newZoom = 12;

                  // Siempre mostrar todos los distritos del municipio seleccionado
                  if (datosMunicipio.districts && Object.keys(datosMunicipio.districts).length > 0) {


                    Object.entries(datosMunicipio.districts).forEach(([nombreDistrito, datosDistrito]: [string, any]) => {
                      if (datosDistrito && datosDistrito.center) {
                        const latDist = parseCoordinate(datosDistrito.center.lat);
                        const lngDist = parseCoordinate(datosDistrito.center.lng);

                        if (!isNaN(latDist) && !isNaN(lngDist)) {
                          // Comprobar si este es el distrito seleccionado


                          // Agregar marcador para el distrito (siempre)
                          newMarkers.push({
                            id: `dist-${nombreDistrito}`,
                            name: `Distrito ${nombreDistrito}`,
                            position: [latDist, lngDist],
                            type: 'district',
                            mun_id: nombreMunicipio,
                            prov_id: provinciaName || provinciaId
                          });

                          // CASO adicional: Si este distrito está seleccionado
                          if (distritoId) {


                            // Centrar en el distrito seleccionado
                            newCenter = [latDist, lngDist];
                            newZoom = 14;

                            // Mostrar localidades del distrito seleccionado
                            if (datosDistrito.locations && datosDistrito.locations.length > 0) {


                              datosDistrito.locations.forEach((ubicacion: any, index: number) => {
                                if (ubicacion.lat && ubicacion.lng) {
                                  const latUbic = parseCoordinate(ubicacion.lat);
                                  const lngUbic = parseCoordinate(ubicacion.lng);

                                  if (!isNaN(latUbic) && !isNaN(lngUbic)) {
                                    // Solo agregar marcador si no es la localidad seleccionada
                                    if (localidadId !== ubicacion.id && localidadId !== ubicacion.code) {
                                      newMarkers.push({
                                        id: `loc-${ubicacion.id || index}`,
                                        name: ubicacion.name || `Localidad ${index + 1}`,
                                        position: [latUbic, lngUbic],
                                        type: 'location',
                                        district_id: nombreDistrito,
                                        mun_id: nombreMunicipio,
                                        prov_id: provinciaId
                                      });
                                    }

                                    // Si esta localidad está seleccionada, mostrar sus recintos
                                    if (localidadId === ubicacion.id || localidadId === ubicacion.code) {


                                      // Centrar en la localidad seleccionada
                                      newCenter = [latUbic, lngUbic];
                                      newZoom = 15;

                                      // Mostrar recintos de la localidad seleccionada
                                      if (ubicacion.recints && ubicacion.recints.length > 0) {


                                        ubicacion.recints.forEach((recinto: any, recIndex: number) => {
                                          if (recinto.lat && recinto.lng) {
                                            const latRec = parseCoordinate(recinto.lat);
                                            const lngRec = parseCoordinate(recinto.lng);

                                            if (!isNaN(latRec) && !isNaN(lngRec)) {
                                              // Solo agregar marcador si no es el recinto seleccionado
                                              if (recintoId !== recinto.id && recintoId !== recinto.code) {
                                                newMarkers.push({
                                                  id: `rec-${recinto.id || recIndex}`,
                                                  name: recinto.name || `Recinto ${recIndex + 1}`,
                                                  position: [latRec, lngRec],
                                                  type: 'recint',
                                                  location_id: ubicacion.id,
                                                  district_id: nombreDistrito,
                                                  mun_id: nombreMunicipio,
                                                  prov_id: provinciaId
                                                });
                                              }

                                              // Si este recinto está seleccionado, centrar en él
                                              if (recintoId === recinto.id || recintoId === recinto.code) {

                                                newCenter = [latRec, lngRec];
                                                newZoom = 16;
                                              }
                                            }
                                          }
                                        });
                                      }
                                    }
                                  }
                                }
                              });
                            }
                          }
                        }
                      }
                    });
                  }
                }
              }
            }
          });
        }
      }
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
    // Aquí se podría implementar la lógica para navegar al hacer clic en un marcador
  };

  // Crear un ícono personalizado según el tipo
  const createCustomIcon = (type: string) => {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${type === 'province' ? 'blue' : type === 'municipality' ? 'green' : type === 'district' ? 'orange' : type === 'location' ? 'purple' : 'red'}.png`,
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
            minWidth: "200px",
            backdropFilter: "blur(5px)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            <div className="spinner" style={{
              width: "50px",
              height: "50px",
              margin: "0 auto 15px",
              border: "4px solid rgba(255,255,255,0.3)",
              borderRadius: "50%",
              borderTop: "4px solid white",
              animation: "spin 1s linear infinite, pulse 2s ease-in-out infinite",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "20px",
                height: "20px",
                background: "white",
                borderRadius: "50%",
                animation: "pulse 2s ease-in-out infinite"
              }}></div>
            </div>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "500",
              marginBottom: "8px",
              animation: "fadeInOut 2s ease-in-out infinite"
            }}>
              {transitioning ? 'Actualizando datos...' : 'Preparando visualización...'}
            </div>
            <div style={{ 
              fontSize: "14px", 
              opacity: 0.8,
              animation: "fadeInOut 2s ease-in-out infinite"
            }}>
              {transitioning ? 'Cargando nueva información...' : 'Configurando el mapa...'}
            </div>
          </div>
        ) : (
          <>
            <style jsx global>{`
              @keyframes fadeInOut {
                0% { opacity: 0.6; }
                50% { opacity: 1; }
                100% { opacity: 0.6; }
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.5; }
                50% { transform: scale(1.05); opacity: 1; }
                100% { transform: scale(0.95); opacity: 0.5; }
              }
            `}</style>

            <MapContainer
              key={`map-${formState.prov_id || formState.prov_code || "all"}-${formState.mun_id || formState.mun_code || "all"}-${formState.dmun_id || formState.dmun_code || "all"}`}
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
                        marginBottom: "10px",
                        padding: "5px 0",
                        borderBottom: "2px solid #eee",
                        color: marker.type === 'province' ? '#2A81CB' :
                          marker.type === 'municipality' ? '#36AE3D' :
                            marker.type === 'district' ? '#F99824' :
                              marker.type === 'location' ? '#800080' : '#CB2B2A'
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
                              marker.type === 'district' ? 'Distrito' :
                                marker.type === 'location' ? 'Localidad' : 'Recinto'}
                        </span>
                      </h3>

                      {/* Mostrar estadísticas si hay selección */}
                      {(formState.prov_id || formState.prov_code) && (
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
                              {formatNumber(normalizedData?.grals?.enabled_tables || 0, 0)}
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
                              {formatNumber(normalizedData?.grals?.enabled_votes || 0, 0)}
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
                              {formatNumber(normalizedData?.grals?.valid_votes || 0, 0)}
                            </span>
                          </div>

                          <div style={{
                            backgroundColor: "#f9f9f9",
                            padding: "8px",
                            borderRadius: "6px",
                            marginBottom: "5px",
                            marginTop: "15px"
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
                                {formatNumber(normalizedData?.grals?.creemos_votes || 0, 0)}
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
                                {formatNumber(normalizedData?.grals?.mas_votes || 0, 0)}
                              </span>
                            </div>
                          </div>

                          {/* Calcular porcentajes */}
                          {normalizedData?.grals?.valid_votes > 0 && (
                            <div style={{ fontSize: "11px", color: "#666", textAlign: "center", marginTop: "5px" }}>
                              Participación: {formatNumber(normalizedData?.grals?.valid_votes * 100 / (normalizedData?.grals?.enabled_votes || 1), 1)}%
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
    </div>
  );
};

export default GeolocationEnclosures;
