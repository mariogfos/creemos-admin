/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useCrud from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./Goals.module.css";
import useCrudUtils from "../shared/useCrudUtils";
import { useEffect, useMemo, useState } from "react";
import ImportDataModal from "@/mk/components/data/ImportDataModal/ImportDataModal";
import Select from "@/mk/components/forms/Select/Select";
import useAxios from "@/mk/hooks/useAxios";

const mod = {
  modulo: "goals",
  singular: "Meta",
  plural: "Metas",
  permiso: "",
  import: true,
  hideActions: { edit: false, del: false, add: true },
};

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const lLevels = [
  { id: 1, name: "Departamental" },
  { id: 2, name: "Municipal" },
  // { id: 3, name: "Parroquial" },
];

const Goals = () => {
  const fields = useMemo(
    () => ({
      id: { rules: [], api: "e" },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Nombre de la Meta",
        list: { width: "100%" },
        form: { type: "text" },
      },
      level: {
        rules: ["required"],
        api: "ae",
        label: "Nivel de la Meta",
        list: { width: "300px" },
        form: { type: "select", options: lLevels, disabled: true },
      },
      position: {
        rules: ["required"],
        api: "ae",
        label: "Posición",
        list: { width: "150px" },
        form: { type: "text" },
      },
      color: {
        rules: [],
        api: "ae",
        label: "Color",
        list: { width: "150px" },
        form: { type: "text" },
      },
    }),
    []
  );

  const onImport = () => {
    setOpenImport(true);
  };

  const lLevelPlantilla = [
    { id: 1, name: "Plantilla departamental" },
    { id: 2, name: "Plantilla municipal" },
    // { id: 3, name: "Plantilla parroquial" },
  ];

  const [plantilla, setPlantilla] = useState(0);

  const getPlantilla = () => {
    if (plantilla != 0) {
      window.open(
        process.env.NEXT_PUBLIC_API_URL + "/goals-template?level=" + plantilla,
        "_ blank"
      );
    }
    setPlantilla(0);
  };

  useEffect(() => {
    getPlantilla();
  }, [plantilla]);

  const ExtraData = () => (
    <div>
      <Select
        label="Descargar plantilla"
        name="level"
        options={lLevelPlantilla}
        onChange={(e) => setPlantilla(e.target.value)}
        value={plantilla}
      />
    </div>
  );

  console.log("plantilla", plantilla);
  const {
    userCan,
    List,
    setStore,
    onSearch,
    searchs,
    onEdit,
    onDel,
    showToast,
    execute,
    reLoad,
    getExtraData,
  } = useCrud({
    paramsInitial,
    mod,
    fields,
    _onImport: onImport,
    menuFilter: <ExtraData />,
  });
  const { searchState, setSearchState } = useCrudUtils({
    onSearch,
    searchs,
    setStore,
    mod,
    onEdit,
    onDel,
  });

  const [openImport, setOpenImport] = useState(false);
  useEffect(() => {
    setOpenImport(searchState == 3);
  }, [searchState]);

  if (!userCan(mod.permiso, "R")) return <NotAccess />;
  return (
    <div className={styles.goals}>
      <List actionsWidth="300px" />
      {openImport && (
        <ImportDataModal
          open={openImport}
          onClose={() => {
            setSearchState(0);
            setOpenImport(false);
          }}
          mod={mod}
          showToast={showToast}
          reLoad={reLoad}
          execute={execute}
          getExtraData={getExtraData}
          // requiredCols="DEPARTAMENTO, HABITANTES, HABILITADOS, ESCANOS, CODE"
        />
      )}
    </div>
  );
};

export default Goals;
