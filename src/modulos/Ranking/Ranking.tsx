"use client";

import React, { useEffect } from "react";
import styles from "./Ranking.module.css";
import RankingNational from "./RankingNational";
import RankingProvincial from "./RankingProvincial";
import useAxios from "@/mk/hooks/useAxios";
import { useAuth } from "@/mk/contexts/AuthProvider";

const Ranking = () => {
  const { setStore } = useAuth();
  //Peticion para los datos del select (Provincias) y componente de cambiar semanas
  const { data: extraData } = useAxios("/historicalrankings", "GET", {
    fullType: "EXTRA",
  });
  useEffect(() => {
    setStore({
      title: "Ranking",
    });
  }, []);

  return (
    <div className={styles.ranking}>
      <div>
        {extraData?.data && <RankingNational extraData={extraData?.data} />}
      </div>
      <div>
        {extraData?.data && <RankingProvincial extraData={extraData?.data} />}
      </div>
    </div>
  );
};

export default Ranking;
