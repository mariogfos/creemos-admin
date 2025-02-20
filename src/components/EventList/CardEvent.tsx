import { convertirFechaUTCaLocal, getDateStr } from "@/mk/utils/date";
import React, { CSSProperties } from "react";
import styles from "./EventList.module.css";
import { getUrlImages } from "@/mk/utils/string";

import {
  IconAdress,
  IconAffliate,
  IconCircleCheck,
  IconLocation,
  IconSucess,
} from "@/components/layout/icons/IconsBiblioteca";

type PropsType = {
  event: any;
  onClick?: any;
  style?: CSSProperties;
};

const CardEvent = ({ event, onClick, style }: PropsType) => {
  const isToday = (dateStr: string | null) => {
    if (!dateStr) return false;

    const givenDate = convertirFechaUTCaLocal(dateStr)
      ?.toISOString()
      .substring(0, 10);
    const todayDate = convertirFechaUTCaLocal(new Date().toISOString())
      ?.toISOString()
      .substring(0, 10);

    return givenDate === todayDate;
  };

  return (
    <div
      key={event?.id}
      style={style}
      className={styles.eventContainer}
      onClick={onClick}
    >
      <div>
        <img
          alt="Evento"
          src={getUrlImages(
            `/EVENT-${event?.id}.${event?.ext}?d=${event?.updated_at}`
          )}
          width="100%"
          height="100%"
        />
      </div>

      <div>
        <p
          style={{
            color: isToday(event?.date_at || "")
              ? "var(--cError)"
              : "var(--cWhiteV1)",
          }}
        >
          {isToday(event?.date_at || "")
            ? "Evento comienza a las " + event.date_at.substring(11, 16)
            : getDateStr(event?.date_at || "")}
        </p>

        <h1 style={{ marginBottom: 4, fontSize: "var(--sXl)" }}>
          {event?.name}
        </h1>

        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 8,
            textAlign: "left",
          }}
        >
          <IconLocation size={16} reverse={true} color="#656f78" />
          <p
            style={{ color: "var(--cWhiteV1)" }}
            // href={event?.location}
            // onClick={(e) => e.stopPropagation()}
            // target="_blank"
            className="truncatedText"
          >
            {event?.address || "Sin dirección"}
          </p>
        </div>

        {/* Asistentes confirmados */}

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <IconCircleCheck reverse={true} size={14} color="#656f78" />
          <div className="truncatedText" style={{ textAlign: "start" }}>
            {event?.assists === 1
              ? "1 afiliado asistirá"
              : `${event?.assists} afiliados asistirán`}
          </div>
        </div>

        {/* Afiliados registrados */}

        <div style={{ display: "flex", gap: 4}}>
          <IconAffliate size={20} style={{marginLeft: -2}} color="#656f78" />
          <div className="truncatedText" style={{ textAlign: "start" }}>
            {event?.attendances === 1
              ? "1 asistente registrado"
              : `${event?.attendances || "Sin"} asistentes registrados`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEvent;
