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
    if (!formState.prov_code || !formState.mun_code) return [];
    // Solo mostrar opciones si es Andrés Ibáñez (prov_code '1') Y Santa Cruz de la Sierra (mun_code '1')
    if (formState.prov_code === '1' && formState.mun_code === '1') {
      return (
        metrics?.data?.areas?.dists?.filter(
          (dmun: any) => dmun.prov_code == formState.prov_code && dmun.mun_code == formState.mun_code
        ) || []
      );
    }
    return []; // Vacío para otros casos
  };
  const getLocals = () => {
    if (!formState.prov_code || !formState.mun_code) return [];
    return (
      metrics?.data?.areas?.locals?.filter(
        (local: any) =>
          local.prov_code == formState.prov_code &&
          local.mun_code == formState.mun_code
      ) || []
    );
  };
  const getRecints = () => {
    // Asegurarse de que los datos y las selecciones necesarias existan
    if (!metrics?.data?.areas?.recints || !formState.prov_code || !formState.mun_code || !formState.local_code) {
      return [];
    }
  
    const isSCZMunicipality = formState.prov_code === '1' && formState.mun_code === '1';
  
    return metrics.data.areas.recints.filter((rec: any) => {
      // Filtros base obligatorios
      if (rec.prov_code != formState.prov_code ||
          rec.mun_code != formState.mun_code ||
          rec.local_code != formState.local_code) {
        return false;
      }
  
      // Lógica específica para Distrito Municipal
      if (isSCZMunicipality) {
        // Si es Santa Cruz de la Sierra, se requiere que dist_code esté seleccionado y coincida
        if (!formState.dist_code || formState.dist_code === "") {
             // Si el distrito no está seleccionado aún para SCZ, no mostrar recintos.
            return false;
        }
        return rec.dist_code == formState.dist_code;
      } else {
        // Para municipios SIN distritos seleccionables por el usuario (ej. San Ignacio):
        // formState.dist_code estará vacío ("").
        // Los recintos en la DB para estos municipios tendrán *algún* valor en rec.dist_code
        // (ej. "0", null, o un placeholder).
        // La condición original `rec.dist_code == formState.dist_code` (o sea, `rec.dist_code == ""`)
        // fallaría si el placeholder no es `""`.
        // Para cumplir el DoD ("navegar todos los niveles"), asumimos que para estos casos,
        // el filtro de `dist_code` no debe ser restrictivo basado en un `formState.dist_code` vacío,
        // o que el backend ya maneja esto en la data que provee.
        // Si la API (/map-metrics) ya filtra bien al no enviar dist_code para estos casos,
        // y los recintos devueltos son los correctos para la localidad,
        // entonces no se necesita una condición de `dist_code` aquí para el frontend.
        // O, si los recintos de municipios sin distrito tienen un `dist_code` específico (ej: "0" o `null`),
        // la condición debería ser: `(rec.dist_code === "0" || rec.dist_code === null)`
        // Por simplicidad y para asegurar que se muestren, si no es SCZ, y ya pasó los filtros de P/M/L, lo mostramos.
        // Esto asume que la data de `recints` para `local_code` en un municipio no-SCZ ya es la correcta
        // y no necesita más filtro por `dist_code` desde el frontend.
        return true;
      }
    }) || [];
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
          options={getDmuns()} // Usará la función corregida
          optionLabel="name"
          optionValue="code"
          onChange={handleChange}
          error={errors}
          // Deshabilitado si no es Andrés Ibáñez Y Santa Cruz de la Sierra, o si no hay municipio seleccionado
          disabled={!(formState.prov_code === '1' && formState.mun_code === '1') || !formState.mun_code}
        />
        <Select
        label="Localidad"
        name="local_code"
        value={formState?.local_code}
        options={getLocals()}
        optionLabel="name"
        optionValue="code"
        onChange={handleChange}
        error={errors}
        // Habilitado si hay un municipio seleccionado
        disabled={!formState.mun_code}
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
