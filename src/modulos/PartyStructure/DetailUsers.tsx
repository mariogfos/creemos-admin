"use client";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import React from "react";
import style from "./users.module.css";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import useAxios from "@/mk/hooks/useAxios";
import { Card } from "@/mk/components/ui/Card/Card";
import LoadingScreen from "@/mk/components/ui/LoadingScreen/LoadingScreen";

type PropsDetailUsers = {
  open: boolean;
  close: () => void;
  item?: any;
  id: string;
};

const DetailUsers = ({ open, close, item, id }: PropsDetailUsers) => {
  const { data, loaded } = useAxios("/users", "GET", {
    searchBy: id,
    fullType: "DET",
  });

  return (
    <DataModal
      open={open}
      onClose={() => close()}
      title={!loaded ? "Cargando..." : "Detalle"}
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
            name={getFullName(data?.data?.user?.[0])}
            src={getUrlImages(
              "/ADM-" +
                data?.data?.user?.[0]?.id +
                ".webp?d=" +
                data?.data?.user?.[0]?.updated_at
            )}
            h={88}
            w={88}
          />
          <div>
            <div style={{ fontSize: "var(--sL)", color: "var(--cWhite)" }}>
              {getFullName(data?.data?.user?.[0])}
            </div>
            <div style={{ color: "var(--cWhiteV1)" }}>
              {data?.data?.user?.[0]?.role[0]?.name}{" "}
              {data?.data?.user?.[0]?.role[0]?.level > 1 && " del "}
              {data?.data?.user?.[0]?.role[0]?.level === 2
                ? data?.data?.user?.[0]?.lista
                : data?.data?.user?.[0]?.role[0]?.level === 3
                ? data?.data?.user?.[0]?.dpto
                : data?.data?.user?.[0]?.role[0]?.level === 4
                ? data?.data?.user?.[0]?.mun
                : data?.data?.user?.[0]?.role[0]?.level === 5
                ? data?.data?.user?.[0]?.barrio
                : ""}
            </div>
          </div>
        </div>
        <Card
          style={{ backgroundColor: "var(--cHover)", color: "var(--cWhiteV2)" }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <p>Cédula de identidad</p>
            <p style={{ color: "var(--cWhite)" }}>
              {data?.data?.user?.[0]?.ci}
            </p>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <p>Correo electrónico</p>
            <p style={{ color: "var(--cWhite)" }}>
              {data?.data?.user?.[0]?.email}
            </p>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <p>Número de Whatsapp</p>
            <p style={{ color: "var(--cWhite)" }}>
              {data?.data?.user?.[0]?.phone}
            </p>
          </div>
          {/* <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <p>Provincia</p>
            <p style={{ color: "var(--cWhite)" }}>{data?.data?.user?.[0]?.prov}</p>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <p>Cantón</p>
            <p style={{ color: "var(--cWhite)" }}>{data?.data?.user?.[0]?.canton}</p>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <p>Parroquia</p>
            <p style={{ color: "var(--cWhite)" }}>{data?.data?.user?.[0]?.parish}</p>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <p>Barrio</p>
            <p style={{ color: "var(--cWhite)" }}>{data?.data?.user?.[0]?.barrio}</p>
          </div> */}
        </Card>
      </LoadingScreen>
    </DataModal>
  );
};

export default DetailUsers;
