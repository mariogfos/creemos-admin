"use client";
import styles from "./Typecands.module.css";
import RenderItem from "../shared/RenderItem";
import useCrudUtils from "../shared/useCrudUtils";
import { useEffect, useMemo, useState } from "react";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import NotAccess from "@/components/layout/NotAccess/NotAccess";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import ImportDataModal from "@/mk/components/data/ImportDataModal/ImportDataModal";

const mod: ModCrudType = {
  modulo: "typecands",
  singular: "tipo de candidato",
  plural: "tipos de candidatos",
  permiso: "",
  // import: true,

  // extraData: true,
};

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Typecands = () => {
  const fields = useMemo(() => {
    return {
      id: { rules: [], api: "e" },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Tipo de candidato",

        form: { type: "text" },
        list: { sortabled: true },
      },
      // description: {
      //   rules: [""],
      //   api: "ae",
      //   label: "Descripción",
      //   form: { type: "text" },
      //   list: true,
      // },
      status: {
        rules: ["required"],
        api: "ae",
        label: "Estado",
        // style: { width: 210 },
        list: {
          width: "140",
        },
        form: {
          type: "select",
          options: [
            { id: "A", name: "Habilitado" },
            { id: "X", name: "Deshabilitado" },
          ],
        },
      },
    };
  }, []);

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
    showToast,
    execute,
    reLoad,
    getExtraData,
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
          title={item?.name}
          subtitle={item?.description}
          variant="V1"
          active={selItem && selItem.id == item.id}
        />
      </RenderItem>
    );
  };

  // if (!userCan(mod.permiso, "R")) return <NotAccess />;
  return (
    <div className={styles.typecands}>
      <List onTabletRow={renderItem} />
      {/* {openImport && (
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
      )} */}
    </div>
  );
};

export default Typecands;
