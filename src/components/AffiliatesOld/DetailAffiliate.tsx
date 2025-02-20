import DataModal from "@/mk/components/ui/DataModal/DataModal";
import React from "react";
import style from "./DetailAffiliates.module.css";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import useAxios from "@/mk/hooks/useAxios";
import { Card } from "@/mk/components/ui/Card/Card";
import LoadingScreen from "@/mk/components/ui/LoadingScreen/LoadingScreen";
import { getDateStrMes } from "../../mk/utils/date";
import { SkeletonType } from "../../mk/components/ui/LoadingScreen/SkeletonAdapter";

type PropsDetailUsers = {
  open: boolean;
  close: () => void;
  item?: any;
  id: string;
};

const DetailAffiliate = ({ open, close, item, id }: PropsDetailUsers) => {
  const { data, loaded } = useAxios("/affiliates", "GET", {
    searchBy: id,
    fullType: "DET",
  });

  return (
    <DataModal
      open={open}
      onClose={() => close()}
      title={!loaded ? "Cargando..." : "Detalle del afiliado"}
      buttonText=""
      buttonCancel=""
    >
      <LoadingScreen loaded={loaded} onlyLoading={true}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Avatar
            name={getFullName(data?.data?.data)}
            src={getUrlImages(
              "/AFF-" +
                data?.data?.data?.id +
                ".webp?d=" +
                data?.data?.data?.updated_at
            )}
            h={88}
            w={88}
          />
          <div>
            <div
              style={{
                fontSize: "var(--sXl)",
                color: "var(--cWhite)",
                fontWeight: "var(--bSemibold)",
              }}
            >
              {getFullName(data?.data?.data)}
            </div>
            <div style={{ color: "var(--cWhiteV1)", fontSize: "var(--sL)" }}>
              {data?.data?.data?.barrio}
            </div>
            {data?.data?.data?.created_at && (
              <div style={{ color: "var(--cWhiteV1)" }}>
                Afiliado el {getDateStrMes(data?.data?.data?.created_at)}
              </div>
            )}
          </div>
        </div>
        <Card
          style={{ backgroundColor: "var(--cHover)", color: "var(--cWhiteV2)" }}
        >
          <div className={style.cardContent}>
            <p>Departamento</p>
            <p style={{ color: "var(--cWhite)" }}>
              {data?.data?.data?.dpto || "No proporcionado"}
            </p>
          </div>
          {/* <div className={style.cardContent}>
            <p>Cédula de identidad</p>
            <p style={{ color: "var(--cWhite)" }}>{data?.data?.data?.ci}</p>
          </div> */}
          <div className={style.cardContent}>
            <p>Correo electrónico</p>
            <p style={{ color: "var(--cWhite)" }}>
              {data?.data?.data?.email
                ? data.data.data.email
                : "No proporcionado"}
            </p>
          </div>
          <div className={style.cardContent}>
            <p>Número de Whatsapp</p>
            <div
              style={{
                display: "flex",
              }}
            >
              {data?.data?.data?.prefix_phone && (
                <p style={{ color: "var(--cWhite)" }}>
                  +{data?.data?.data?.prefix_phone}
                </p>
              )}
              {data?.data?.data?.phone && (
                <p style={{ color: "var(--cWhite)", marginLeft: 8 }}>
                  {data?.data?.data?.phone || "No proporcionado"}
                </p>
              )}
            </div>
          </div>
        </Card>
      </LoadingScreen>
    </DataModal>
  );
};

export default DetailAffiliate;
