"use client";
import TabsButtons from "@/mk/components/ui/TabsButton/TabsButtons";
import React, { use, useEffect, useState } from "react";
import styles from "./ElectoralMapping.module.css";
import CategorizationEnclosures from "../CategorizationEnclosures/CategorizationEnclosures";
import GeolocationEnclosures from "../GeolocationEnclosures/GeolocationEnclosures";
import Select from "@/mk/components/forms/Select/Select";
import { useAuth } from "@/mk/contexts/AuthProvider";
import useAxios from "@/mk/hooks/useAxios";

type TypeProps = {
  data: {
    prov_id?: string;
    mun_id?: string;
    dmun_id?: string;
    local_id?: string;
    recinto_id?: string;
  };
};

const ElectoralMapping = () => {
  const [tab, setTab] = useState("C");
  const [formState, setFormState]: any = useState({});
  const [errors, setErrors] = useState({});
  const [params, setParams]: any = useState({
    tab: "CAT",
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };
  // const provincias = [
  //   { id: "Andrés Ibáñez", name: "Andrés Ibáñez" },
  //   { id: "Warnes", name: "Warnes" },
  //   { id: "Chiquitos", name: "Chiquitos" },
  //   { id: "Guarayos", name: "Guarayos" },
  // ];
  // const municipios: any = {
  //   "Andrés Ibáñez": [
  //     { id: "Santa Cruz de la Sierra", name: "Santa Cruz de la Sierra" },
  //     { id: "Cotoca", name: "Cotoca" },
  //     { id: "Porongo", name: "Porongo" },
  //   ],
  //   Warnes: [
  //     { id: "Warnes", name: "Warnes" },
  //     { id: "Okinawa Uno", name: "Okinawa Uno" },
  //   ],
  //   Chiquitos: [
  //     { id: "San José de Chiquitos", name: "San José de Chiquitos" },
  //     { id: "Roboré", name: "Roboré" },
  //   ],
  //   Guarayos: [{ id: "Ascensión de Guarayos", name: "Ascensión de Guarayos" }],
  // };
  // const distritos: any = {
  //   "Santa Cruz de la Sierra": [
  //     { id: "Distrito 1", name: "Distrito 1" },
  //     { id: "Distrito 2", name: "Distrito 2" },
  //     { id: "Distrito 3", name: "Distrito 3" },
  //   ],
  //   Cotoca: [
  //     { id: "Distrito 1", name: "Distrito 1" },
  //     { id: "Distrito 2", name: "Distrito 2" },
  //   ],
  //   Porongo: [{ id: "Distrito Único", name: "Distrito Único" }],
  //   Warnes: [
  //     { id: "Distrito 1", name: "Distrito 1" },
  //     { id: "Distrito 2", name: "Distrito 2" },
  //   ],
  //   "Okinawa Uno": [{ id: "Distrito Único", name: "Distrito Único" }],
  //   "San José de Chiquitos": [{ id: "Distrito 1", name: "Distrito 1" }],
  //   Roboré: [{ id: "Distrito 1", name: "Distrito 1" }],
  //   "Ascensión de Guarayos": [{ id: "Distrito 1", name: "Distrito 1" }],
  // };
  // const localidades = [
  //   { id: "Localidad A", name: "Localidad A", distrito: "Distrito 1" },
  //   { id: "Localidad B", name: "Localidad B", distrito: "Distrito 1" },
  //   { id: "Localidad C", name: "Localidad C", distrito: "Distrito 2" },
  //   { id: "Localidad D", name: "Localidad D", distrito: "Distrito 2" },
  // ];

  // const recintos = [
  //   { id: "Recinto 1", name: "Recinto 1", localidad: "Localidad A" },
  //   { id: "Recinto 2", name: "Recinto 2", localidad: "Localidad B" },
  //   { id: "Recinto 3", name: "Recinto 3", localidad: "Localidad C" },
  //   { id: "Recinto 4", name: "Recinto 4", localidad: "Localidad D" },
  // ];

  // // Obtener las opciones filtradas para cada nivel
  // const getMunicipiosOptions = () => {
  //   if (!formState.prov_id) return [];
  //   return municipios[formState.prov_id] || [];
  // };

  // const getDistritosOptions = () => {
  //   if (!formState.mun_id) return [];
  //   return distritos[formState.mun_id] || [];
  // };

  // const getLocalidadesOptions = () => {
  //   if (!formState.dmun_id) return [];
  //   return localidades.filter((loc) => loc.distrito === formState.dmun_id);
  // };

  // const getRecintosOptions = () => {
  //   if (!formState.local_id) return [];
  //   return recintos.filter((rec) => rec.localidad === formState.local_id);
  // };

  const { store, setStore } = useAuth();
  const { data: metrics, reLoad } = useAxios("/map-metrics", "GET", params);

  useEffect(() => {
    setStore({ ...store, title: "Mapeo electoral" });
  }, []);

  // console.log(metrics);
  const getMuns = () => {
    if (!formState.prov_code) return [];
    return (
      metrics?.data?.areas?.muns?.filter(
        (mun: any) => mun.prov_code == formState.prov_code
      ) || []
    );
  };
  const getDmuns = () => {
    if (!formState.mun_code) return [];
    return (
      metrics?.data?.areas?.dists?.filter(
        (dmun: any) => dmun.mun_code == formState.mun_code
      ) || []
    );
  };
  const getLocals = () => {
    if (!formState?.dist_code) return [];
    return (
      metrics?.data?.areas?.locals?.filter(
        (local: any) =>
          local.mun_code == formState.mun_code &&
          local?.prov_code == formState.prov_code
      ) || []
    );
  };

  const getRecints = () => {
    if (!formState.local_code) return [];
    return (
      metrics?.data?.areas?.recints?.filter(
        (rec: any) =>
          rec.local_code == formState.local_code &&
          rec?.dist_code == formState.dist_code
      ) || []
    );
  };
  useEffect(() => {
    setParams({
      ...params,
      ...formState,
    });
  }, [formState]);

  useEffect(() => {
    reLoad();
  }, [params]);
  return (
    <div className={styles.ElectoralMapping}>
      <p>
        Elecciones subnacionales para gobernador en el departamento <br />
        de Santa Cruz en 2021
      </p>
      <TabsButtons
        sel={tab}
        setSel={setTab}
        tabs={[
          { text: "Categorización de recintos electorales", value: "C" },
          { text: "Geolocalización de recintos electorales", value: "G" },
        ]}
      />
      <p>Selecciona las áreas que quieras ver</p>
      <div>
        <Select
          label="Provincia"
          name="prov_code"
          value={formState.prov_code}
          // options={provincias}
          options={metrics?.data?.areas?.provs || []}
          optionLabel="name"
          optionValue="code"
          onChange={handleChange}
          error={errors}
        />
        <Select
          label="Municipio"
          name="mun_code"
          value={formState.mun_code}
          // options={getMunicipiosOptions()}
          options={getMuns()}
          optionLabel="name"
          optionValue="code"
          onChange={handleChange}
          error={errors}
          disabled={!formState.prov_code}
        />
        <Select
          label="Distrito municipal"
          name="dist_code"
          value={formState.dist_code}
          // options={getDistritosOptions()}
          options={getDmuns()}
          optionLabel="name"
          optionValue="code"
          onChange={handleChange}
          error={errors}
          disabled={!formState.mun_code}
        />
        <Select
          label="Localidad"
          name="local_code"
          value={formState.local_code}
          // options={getLocalidadesOptions()}
          options={getLocals()}
          optionLabel="name"
          optionValue="code"
          onChange={handleChange}
          error={errors}
          disabled={!formState.dist_code}
        />
        <Select
          label="Recinto electoral"
          name="recint_code"
          value={formState.recint_code}
          // options={getRecintosOptions()}
          options={getRecints()}
          optionLabel="name"
          optionValue="code"
          onChange={handleChange}
          error={errors}
          disabled={!formState.local_code}
        />
      </div>
      {tab == "C" && <CategorizationEnclosures data={metrics?.data} />}
      {tab == "G" && <GeolocationEnclosures data={formState} />}
    </div>
  );
};

export default ElectoralMapping;
