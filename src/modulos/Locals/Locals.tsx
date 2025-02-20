/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useCrud from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./Locals.module.css";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import useCrudUtils from "../shared/useCrudUtils";
import { useEffect, useMemo, useState } from "react";
import RenderItem from "../shared/RenderItem";
import ImportDataModal from "@/mk/components/data/ImportDataModal/ImportDataModal";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";

const mod = {
  modulo: "locals",
  singular: "localidad",
  plural: "localidades",
  permiso: "locals",
  extraData: true,
  import: true,
  hideActions: { edit: true, del: true, add: true },
};

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Locals = () => {
  const fields = useMemo(
    () => ({
      id: { rules: [], api: "e" },
      dpto_id: {
        rules: ["required"],
        api: "ae",
        label: "Departamento",
        list: { width: "300px" },
        form: { type: "select", optionsExtra: "dptos" },
      },
      mun_id: {
        rules: ["required"],
        api: "ae",
        label: "Municipio",
        list: { width: "300px" },
        form: { type: "select", optionsExtra: "muns" },
      },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Localidad",
        list: true,
        form: { type: "text" },
      },
      code: {
        rules: ["max:5", "noSpaces"],
        api: "ae",
        label: "Código",
        list: false,
        form: { type: "text" },
      },
    }),
    []
  );

  const onImport = () => {
    setOpenImport(true);
  };

  const {
    userCan,
    List,
    setStore,
    onSearch,
    searchs,
    onEdit,
    onDel,
    extraData,
    findOptions,
    showToast,
    execute,
    reLoad,
  } = useCrud({
    paramsInitial,
    mod,
    fields,
    _onImport: onImport,
  });
  const { onLongPress, selItem, searchState, setSearchState } = useCrudUtils({
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

  const renderItem = (
    item: Record<string, any>,
    i: number,
    onClick: Function
  ) => {
    return (
      <RenderItem item={item} onClick={onClick} onLongPress={onLongPress}>
        <ItemList
          title={
            item?.name + " - " + findOptions(item.dpto_id, extraData?.dptos)
          }
          subtitle={"Habilitados: " + item?.habilitados}
          variant="V1"
          active={selItem && selItem.id == item.id}
          left={<Avatar name={item.code} />}
        />
      </RenderItem>
    );
  };

  if (!userCan(mod.permiso, "R")) return <NotAccess />;
  return (
    <div className={styles.roles}>
      <List onTabletRow={renderItem} actionsWidth="300px" />
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
          // getExtraData={getExtraData}
          // requiredCols="DEPARTAMENTO, HABITANTES, HABILITADOS, ESCANOS, CODE"
        />
      )}
    </div>
  );
};

export default Locals;
