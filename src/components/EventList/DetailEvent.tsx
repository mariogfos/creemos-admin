import DataModal from "@/mk/components/ui/DataModal/DataModal";
import useAxios from "@/mk/hooks/useAxios";
import React, { useState } from "react";
import CardEvent from "./CardEvent";
import EventTypeRegister from "@/mk/components/ui/EventTypeRegister/EventTypeRegister";
import styles from "./EventList.module.css";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getHourStr } from "@/mk/utils/date";
import {
  IconNewAfilliate,
  IconRegisterNoID,
  IconScanner,
} from "@/components/layout/icons/IconsBiblioteca";
import LoadingScreen from "@/mk/components/ui/LoadingScreen/LoadingScreen";
import DetailAffiliate from "../AffiliatesOld/DetailAffiliate";
import Input from "@/mk/components/forms/Input/Input";

type PropsType = {
  id: number;
  open: boolean;
  close: () => void;
};

const DetailEvent = ({ id, open, close }: PropsType) => {
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const { data, waiting, error } = useAxios("/events", "GET", {
    searchBy: id,
    fullType: "DET",
  });

  return (
    <>
      <DataModal
        open={open}
        onClose={() => close()}
        title="Detalle del evento"
        fullScreen={true}
        buttonText=""
        buttonCancel=""
      >
        <div className={styles.detailEvent}>
          {waiting ? (
            <LoadingScreen type="CardSkeleton" />
          ) : error ? (
            <p>Error al cargar los detalles del evento.</p>
          ) : (
            <>
              <CardEvent
                event={data?.data?.data}
                style={{ cursor: "none", transform: "none" }}
              />
            </>
          )}
          <EventTypeRegister id={id} />
          <div>
            <a href="#" onClick={() => setParticipantsModalOpen(true)}>
              Ver lista de participantes
            </a>
          </div>
        </div>
        {participantsModalOpen && (
          <DataModal
            open={participantsModalOpen}
            onClose={() => setParticipantsModalOpen(false)}
            title="Lista de participantes"
            fullScreen={true}
            buttonText=""
            buttonCancel=""
          >
            <ParticipantsList eventId={id} />
          </DataModal>
        )}
      </DataModal>
    </>
  );
};

const ParticipantsList = ({ eventId }: any) => {
  const { data, loaded } = useAxios("/attendance", "GET", {
    event_id: eventId,
    fullType: "L",
    perPage: -1,
  });
  const [userId, setUserId]: any = useState(null);
  const [search, setSearch] = useState(""); // Estado para la búsqueda

  // Filtrar participantes según la búsqueda
  const filteredParticipants = data?.data?.filter((participant: any) =>
    getFullName(participant?.affiliate)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // if (waiting) return <p>Cargando participantes...</p>;
  // if (error) return <p>Error al cargar participantes.</p>;

  return (
    <>
      <LoadingScreen loaded={loaded}>
        <>
          <div className={styles.participantList}>
            <div>
              <Input
                name="search"
                type="text"
                placeholder="Buscar participante..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div>
              <p
                style={{
                  color: "var(--cWhiteV2)",
                  fontWeight: "thin",
                  marginBottom: "1rem",
                }}
              >
                <span>
                  <span
                    style={
                      {
                        // color: "var(--cWhiteV1)",
                        // fontWeight: "bold",
                      }
                    }
                  >
                    {filteredParticipants?.length}
                  </span>
                </span>
                {"  "}
                {filteredParticipants?.length === 1
                  ? " persona registrada"
                  : " personas registradas"}{" "}
                hasta el momento
              </p>
            </div>
            {/* Campo de búsqueda */}
            <div className={styles.participantItem}>
              {filteredParticipants?.map((participant: any) => (
                <div key={participant.id}>
                  <div>
                    <Avatar
                      name={getFullName(participant?.affiliate)}
                      src={getUrlImages(
                        "/AFF-" +
                          participant?.affiliate_id +
                          ".webp?d=" +
                          participant?.affiliate?.update_at
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        setUserId(participant.affiliate_id);
                      }}
                      style={{ cursor: "pointer" }}
                      w={48}
                      h={48}
                    />
                    <div>
                      <p>{getFullName(participant?.affiliate)}</p>
                      {/* <p>CI: {participant?.affiliate?.ci}</p> */}
                      <p>
                        Hora de ingreso:{" "}
                        {getHourStr(participant?.created_at, true)}
                      </p>
                    </div>
                  </div>
                  <div>
                    {participant?.type === "Q" && (
                      <div>
                        <IconScanner size={20} />
                        <p
                          style={{
                            color: "var(--cAccent)",
                          }}
                        >
                          Elekta QR
                        </p>
                      </div>
                    )}
                    {participant?.type === "S" && (
                      <div>
                        <IconRegisterNoID size={20} />
                        <p
                          style={{
                            color: "var(--cSuccess)",
                          }}
                        >
                          Sin QR
                        </p>
                      </div>
                    )}
                    {participant?.type === "N" && (
                      <div
                        style={{
                          color: "var(--cInfo)",
                        }}
                      >
                        <IconNewAfilliate size={20} />
                        <p>Nuevo afiliado</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      </LoadingScreen>
      {userId && (
        <DetailAffiliate
          open={true}
          close={() => setUserId(null)}
          id={userId}
        />
      )}
    </>
  );
};

export default DetailEvent;
