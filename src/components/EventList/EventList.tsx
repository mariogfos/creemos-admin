import React, { use, useEffect, useState } from "react";
import styles from "./EventList.module.css";
import useAxios from "@/mk/hooks/useAxios";
import CardEvent from "./CardEvent";
import DetailEvent from "./DetailEvent";
import LoadingScreen from "@/mk/components/ui/LoadingScreen/LoadingScreen";

const EventList = () => {
  const [idEvent, setIdEvent]: any = useState("");
  const { data, loaded, reLoad } = useAxios("/events", "GET", {
    fullType: "CE",
  });

  useEffect(() => {
    reLoad();
  }, []);

  return (
    <>
      <LoadingScreen loaded={loaded}>
        {data?.data.length === 0 ? (
          <div className={styles.containerTitle}>
            <h1>No hay eventos disponibles para este dia.</h1>
          </div>
        ) : (
          <>
            <div className={styles.containerTitle}>
              <h1>Eventos disponibles para hoy</h1>
              Selecciona el evento al que has sido asignado para proceder con el
              registro de participantes.
            </div>
            {data?.data.map((event: any) => (
              <CardEvent
                key={event.id}
                event={event}
                onClick={() => setIdEvent(event.id)}
              />
            ))}
            {idEvent && (
              <DetailEvent
                id={idEvent}
                open={true}
                close={() => setIdEvent("")}
              />
            )}
          </>
        )}
      </LoadingScreen>
    </>
  );
};

export default EventList;
