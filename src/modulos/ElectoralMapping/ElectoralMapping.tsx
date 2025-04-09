"use client";
import TabsButtons from "@/mk/components/ui/TabsButton/TabsButtons";
import React, { use, useEffect, useState } from "react";
import styles from "./ElectoralMapping.module.css";
import CategorizationEnclosures from "../CategorizationEnclosures/CategorizationEnclosures";
import GeolocationEnclosures from "../GeolocationEnclosures/GeolocationEnclosures";
import Select from "@/mk/components/forms/Select/Select";
import { useAuth } from "@/mk/contexts/AuthProvider";
import useAxios from "@/mk/hooks/useAxios";


const ElectoralMapping = () => {
  const [tab, setTab] = useState("C");
  const [formState, setFormState]: any = useState({});
  const [errors, setErrors] = useState({});
  const [metrics, setMetrics]: any = useState({});
  // const [params, setParams]: any = useState({
  //   tab: "CAT",
  // });
  const [geoLocation, setGeolocation] = useState({});
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const { store, setStore } = useAuth();
  // const {
  //   data: metrics,
  //   reLoad,
  //   execute,
  // } = useAxios("/map-metrics", "GET", params);
  const { execute } = useAxios();

  const getMetrics = async (params: any = { tab: "CAT" }) => {
    const { data } = await execute("/map-metrics", "GET", params);
    if (data) {
      setMetrics(data);
    }
  };

  useEffect(() => {
    setStore({ ...store, title: "Mapeo electoral" });
  }, []);

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
  // useEffect(() => {
  //   setParams({
  //     ...params,
  //     ...formState,
  //   });
  // }, [formState]);

  // useEffect(() => {
  //   reLoad();
  // }, [params]);
  const getGeolocation = async () => {
    let params = {};
    const { data } = await execute("/map-geo", "GET", {
      ...params,
      ...formState,
    });
    if (data) {
      setGeolocation(data);
    }
  };

  useEffect(() => {
    if (tab == "C") {
      getMetrics({ tab: "CAT", ...formState });
    }
    if (tab == "G") {
      getGeolocation();
    }
  }, [formState]);

  useEffect(() => {
    if (tab == "C") {
      getMetrics({ tab: "CAT", ...formState });
    }
    if (tab == "G") {
      getGeolocation();
    }
  }, [tab]);

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
          value={formState?.prov_code}
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
          value={formState?.mun_code}
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
          value={formState?.dist_code}
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
          value={formState?.local_code}
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
          value={formState?.recint_code}
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
      {tab == "G" && (
        <GeolocationEnclosures formState={formState} data={geoLocation} />
      )}
    </div>
  );
};

export default ElectoralMapping;
