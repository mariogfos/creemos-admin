"use client";
import TabsButtons from "@/mk/components/ui/TabsButton/TabsButtons";
import React, { useEffect, useState } from "react";
import styles from "./ElectoralMapping.module.css";
import CategorizationEnclosures from "../CategorizationEnclosures/CategorizationEnclosures";
import GeolocationEnclosures from "../GeolocationEnclosures/GeolocationEnclosures";
import Select from "@/mk/components/forms/Select/Select";
import { useAuth } from "@/mk/contexts/AuthProvider";

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
  const [data, setData] = useState([]);
  const [formState, setFormState]: any = useState({});
  const [errors, setErrors] = useState({});
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // Limpiar los valores de los niveles inferiores cuando se cambia un nivel superior
    const newFormState = { ...formState, [name]: value };
    if (name === "prov_id") {
      delete newFormState.mun_id;
      delete newFormState.dmun_id;
      delete newFormState.local_id;
      delete newFormState.recinto_id;
    } else if (name === "mun_id") {
      delete newFormState.dmun_id;
      delete newFormState.local_id;
      delete newFormState.recinto_id;
    } else if (name === "dmun_id") {
      delete newFormState.local_id;
      delete newFormState.recinto_id;
    } else if (name === "local_id") {
      delete newFormState.recinto_id;
    }
    setFormState(newFormState);
  };
  const provincias = [
    { id: "Andrés Ibáñez", name: "Andrés Ibáñez" },
    { id: "Warnes", name: "Warnes" },
    { id: "Chiquitos", name: "Chiquitos" },
    { id: "Guarayos", name: "Guarayos" },
  ];
  const municipios: any = {
    "Andrés Ibáñez": [
      { id: "Santa Cruz de la Sierra", name: "Santa Cruz de la Sierra" },
      { id: "Cotoca", name: "Cotoca" },
      { id: "Porongo", name: "Porongo" },
    ],
    Warnes: [
      { id: "Warnes", name: "Warnes" },
      { id: "Okinawa Uno", name: "Okinawa Uno" },
    ],
    Chiquitos: [
      { id: "San José de Chiquitos", name: "San José de Chiquitos" },
      { id: "Roboré", name: "Roboré" },
    ],
    Guarayos: [{ id: "Ascensión de Guarayos", name: "Ascensión de Guarayos" }],
  };
  const distritos: any = {
    "Santa Cruz de la Sierra": [
      { id: "Distrito 1", name: "Distrito 1" },
      { id: "Distrito 2", name: "Distrito 2" },
      { id: "Distrito 3", name: "Distrito 3" },
    ],
    Cotoca: [
      { id: "Distrito 1", name: "Distrito 1" },
      { id: "Distrito 2", name: "Distrito 2" },
    ],
    Porongo: [{ id: "Distrito Único", name: "Distrito Único" }],
    Warnes: [
      { id: "Distrito 1", name: "Distrito 1" },
      { id: "Distrito 2", name: "Distrito 2" },
    ],
    "Okinawa Uno": [{ id: "Distrito Único", name: "Distrito Único" }],
    "San José de Chiquitos": [{ id: "Distrito 1", name: "Distrito 1" }],
    Roboré: [{ id: "Distrito 1", name: "Distrito 1" }],
    "Ascensión de Guarayos": [{ id: "Distrito 1", name: "Distrito 1" }],
  };
  const localidades = [
    { id: "Localidad A", name: "Localidad A", distrito: "Distrito 1" },
    { id: "Localidad B", name: "Localidad B", distrito: "Distrito 1" },
    { id: "Localidad C", name: "Localidad C", distrito: "Distrito 2" },
    { id: "Localidad D", name: "Localidad D", distrito: "Distrito 2" },
  ];

  const recintos = [
    { id: "Recinto 1", name: "Recinto 1", localidad: "Localidad A" },
    { id: "Recinto 2", name: "Recinto 2", localidad: "Localidad B" },
    { id: "Recinto 3", name: "Recinto 3", localidad: "Localidad C" },
    { id: "Recinto 4", name: "Recinto 4", localidad: "Localidad D" },
  ];

  // Obtener las opciones filtradas para cada nivel
  const getMunicipiosOptions = () => {
    if (!formState.prov_id) return [];
    return municipios[formState.prov_id] || [];
  };

  const getDistritosOptions = () => {
    if (!formState.mun_id) return [];
    return distritos[formState.mun_id] || [];
  };

  const getLocalidadesOptions = () => {
    if (!formState.dmun_id) return [];
    return localidades.filter((loc) => loc.distrito === formState.dmun_id);
  };

  const getRecintosOptions = () => {
    if (!formState.local_id) return [];
    return recintos.filter((rec) => rec.localidad === formState.local_id);
  };

  const { store, setStore } = useAuth();
  useEffect(() => {
    setStore({ ...store, title: "Mapeo electoral" });
  }, []);

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
          name="prov_id"
          value={formState.prov_id}
          options={provincias}
          optionLabel="name"
          optionValue="id"
          onChange={handleChange}
          error={errors}
        />
        <Select
          label="Municipio"
          name="mun_id"
          value={formState.mun_id}
          options={getMunicipiosOptions()}
          optionLabel="name"
          optionValue="id"
          onChange={handleChange}
          error={errors}
          disabled={!formState.prov_id}
        />
        <Select
          label="Distrito municipal"
          name="dmun_id"
          value={formState.dmun_id}
          options={getDistritosOptions()}
          optionLabel="name"
          optionValue="id"
          onChange={handleChange}
          error={errors}
          disabled={!formState.mun_id}
        />
        <Select
          label="Localidad"
          name="local_id"
          value={formState.local_id}
          options={getLocalidadesOptions()}
          optionLabel="name"
          optionValue="id"
          onChange={handleChange}
          error={errors}
          disabled={!formState.dmun_id}
        />
        <Select
          label="Recinto electoral"
          name="recinto_id"
          value={formState.recinto_id}
          options={getRecintosOptions()}
          optionLabel="name"
          optionValue="id"
          onChange={handleChange}
          error={errors}
          disabled={!formState.local_id}
        />
      </div>
      {tab == "C" && <CategorizationEnclosures data={data} />}
      {tab == "G" && <GeolocationEnclosures data={formState} />}
    </div>
  );
};

export default ElectoralMapping;
