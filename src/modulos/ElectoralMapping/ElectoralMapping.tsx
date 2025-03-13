"use client";
import TabsButtons from "@/mk/components/ui/TabsButton/TabsButtons";
import React, { useState } from "react";
import styles from "./ElectoralMapping.module.css";
import CategorizationEnclosures from "../CategorizationEnclosures/CategorizationEnclosures";
import GeolocationEnclosures from "../GeolocationEnclosures/GeolocationEnclosures";
import Select from "@/mk/components/forms/Select/Select";

const ElectoralMapping = () => {
  const [tab, setTab] = useState("C");
  const [data, setData] = useState([]);
  const [formState, setFormState]: any = useState({});
  const [errors, setErrors] = useState({});
  const handleChange = (e: any) => {
    let value = e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
  };
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
          //   options={extraData?.roles}
          options={[]}
          disabled
          optionLabel="name"
          onChange={handleChange}
          error={errors}
        />
        <Select
          label="Municipio"
          name="mun_id"
          value={formState.mun_id}
          //   options={extraData?.roles}
          options={[]}
          disabled
          optionLabel="name"
          onChange={handleChange}
          error={errors}
        />
        <Select
          label="Distrito municipal"
          name="dmun_id"
          value={formState.dmun_id}
          //   options={extraData?.roles}
          options={[]}
          disabled
          optionLabel="name"
          onChange={handleChange}
          error={errors}
        />
        <Select
          label="Localidad"
          name="local_id"
          value={formState.local_id}
          //   options={extraData?.roles}
          options={[]}
          disabled
          optionLabel="name"
          onChange={handleChange}
          error={errors}
        />
        <Select
          label="Recinto electoral"
          name="recinto_id"
          value={formState.recinto_id}
          //   options={extraData?.roles}
          options={[]}
          disabled
          optionLabel="name"
          onChange={handleChange}
          error={errors}
        />
      </div>
      {tab == "C" && <CategorizationEnclosures data={data} />}
      {tab == "G" && <GeolocationEnclosures data={data} />}
    </div>
  );
};

export default ElectoralMapping;
