import DataModal from "@/mk/components/ui/DataModal/DataModal";
import React, { useState } from "react";
import styles from "./NewAffiliate.module.css";
import { Card } from "@/mk/components/ui/Card/Card";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import RegisterAffiliate from "./RegisterAffiliate";
import SponsorCard from "./SponsorCard";

type PropsType = {
  open: boolean;
  close: (e?: any) => any;
  data: any;
  eventId: number;
};

const ListAffiliates = ({ open, close, data, eventId }: PropsType) => {
  const [sponsorData, setSponsorData]: any = useState({});
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <>
      <DataModal
        open={open}
        onClose={() => {
          setSponsorData({});
          close();
        }}
        title="Nuevo afilliado"
        fullScreen={true}
        buttonText={sponsorData.id ? "Continuar" : ""}
        buttonCancel=""
        onSave={() => {
          setOpenRegister(true);
        }}
      >
        <div className={styles.containerNewAffiliate}>
          <h1>Patrocinadores que coincidieron</h1>
          <p>
            Selecciona al patrocinador que recomendó a este nuevo afiliado para
            continuar con el registro
          </p>
        </div>

        {data?.data?.map((sponsor: any) => (
          <SponsorCard
            key={sponsor.id}
            sponsor={sponsor}
            isSelected={sponsorData.id === sponsor.id}
            onClick={() => setSponsorData(sponsor)}
          />
        ))}
        {openRegister && (
          <RegisterAffiliate
            open={openRegister}
            close={(e: any = "") => {
              if (e === "C") {
                close(e);
              }
              setOpenRegister(e);
              setSponsorData({});
            }}
            sponsorData={sponsorData}
            eventId={eventId}
          />
        )}
      </DataModal>
    </>
  );
};

export default ListAffiliates;
