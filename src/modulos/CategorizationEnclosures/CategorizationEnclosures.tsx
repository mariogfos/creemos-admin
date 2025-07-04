import {
  IconMesas,
  IconRecinto,
  IconVotesEnabled,
  IconVotesValid,
} from "@/components/layout/icons/IconsBiblioteca";
import WidgetBase from "@/components/Widgets/WidgetBase/WidgetBase";
import WidgetGeneralResults from "@/components/Widgets/WidgetGeneralResults/WidgetGeneralResults";
import React, {  } from "react";
import styles from "./CategorizationEnclosures.module.css";
import GraphCategories from "@/components/Graphs/GraphCategories/GraphCategories";
import { formatNumber } from "../../mk/utils/numbers";
import Image from "next/image";
import creemos from "../../../public/images/creemos.png";
import mas from "../../../public/images/mas.png";

type TypeProps = {
  data: any;
};
export const categories = [
  {
    name: "A",
    text: "Recintos donde Creemos gana con más del 80%",
    color: "var(--cRandom15)",
  },
  {
    name: "B",
    text: "Recintos donde Creemos gana entre el 50% y 80%",
    color: "var(--cRandom14)",
  },
  {
    name: "C",
    text: "Recintos donde Creemos gana sin superar el 50%",
    color: "var(--cRandom1)",
  },
  {
    name: "D",
    text: "Recintos donde MAS-IPSP gana sin superar el 50%",
    color: "var(--cRandom4)",
  },
  {
    name: "E",
    text: "Recintos donde MAS-IPSP gana con el 50% y 80%",
    color: "var(--cRandom2)",
  },
  {
    name: "F",
    text: "Recintos donde MAS-IPSP gana con más 80%",
    color: "var(--cInfo)",
  },
  {
    name: "G",
    text: "Recintos donde gana otro partido diferente a Creemos y MAS-IPSP",
    color: "var(--cRandom10)",
  },
];
const CategorizationEnclosures = ({ data }: TypeProps) => {
  return (
    <div className={styles.CategorizationEnclosures}>
      <div style={{ width: "100%", display: "flex", gap: 12 }}>
        <WidgetBase title="Resultados generales">
          <div className={styles.widget}>
            <WidgetGeneralResults
              text="Recintos habilitados"
              value={formatNumber(data?.grals?.enabled_recints, 0)}
              icon={
                <IconRecinto
                  viewBox="0 0 40 40"
                  size={40}
                  reverse
                  color={"var(--cBlackV2)"}
                />
              }
            />
            <WidgetGeneralResults
              text="Mesas habilitadas"
              value={formatNumber(data?.grals?.enabled_tables, 0)}
              icon={
                <IconMesas
                  viewBox="0 0 40 40"
                  size={40}
                  color={"var(--cBlackV2)"}
                />
              }
            />
            <WidgetGeneralResults
              text="Votos habilitados"
              value={formatNumber(data?.grals?.enabled_votes, 0)}
              icon={
                <IconVotesEnabled
                  viewBox="0 0 40 40"
                  size={40}
                  color={"var(--cBlackV2)"}
                />
              }
            />
            <WidgetGeneralResults
              text="Votos válidos"
              value={formatNumber(data?.grals?.valid_votes, 0)}
              icon={
                <IconVotesValid
                  viewBox="0 0 40 40"
                  size={40}
                  reverse
                  color={"var(--cBlackV2)"}
                />
              }
            />
            <WidgetGeneralResults
              text="Votos obtenidos por creemos"
              value={formatNumber(data?.grals?.creemos_votes, 0)}
              styleValue={{ color: "#91268E" }}
              icon={
                <Image
                  src={creemos}
                  alt=""
                  priority
                  style={{ width: 40, height: 40 }}
                />
              }
            />
            <WidgetGeneralResults
              text="Votos obtenidos por MAS-IPSP"
              value={formatNumber(data?.grals?.mas_votes, 0)}
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
        <WidgetBase title="Categorías de recintos">
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                width: "40%",
              }}
            >
              {categories?.map((category: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      borderRadius: "100%",
                      backgroundColor: category.color,
                      color: "var(--cBlack)",
                      fontWeight: 700,
                      fontSize: 24,
                      minWidth: 40,
                      minHeight: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {category.name}
                  </div>
                  <p
                    style={{
                      color: "var(--cBlackV2)",
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                  >
                    {category.text}
                  </p>
                </div>
              ))}
            </div>
            <GraphCategories data={data?.categories} />
          </div>
        </WidgetBase>
      </div>
    </div>
  );
};

export default CategorizationEnclosures;
