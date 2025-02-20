/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./Dptos.module.css";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import useCrudUtils from "../shared/useCrudUtils";
import { useEffect, useMemo, useState } from "react";
import RenderItem from "../shared/RenderItem";
import ImportDataModal from "@/mk/components/data/ImportDataModal/ImportDataModal";
import { lMapUruguay } from "@/components/layout/icons/IconsDptosUruguay";
import { formatNumber } from "@/mk/utils/numbers";

const mod: ModCrudType = {
  modulo: "dptos",
  singular: "departamento",
  plural: "departamentos",
  permiso: "dptos",
  import: true,
  hideActions: { edit: true, del: true, add: true },
};

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Dptos = () => {
  const fields = useMemo(() => {
    return {
      id: { rules: [], api: "e" },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Departamento",
        list: true,
        form: { type: "text" },
      },

      code: {
        rules: ["max:5", "noSpaces"],
        api: "ae",
        label: "Cód",
        list: false,
        form: { type: "text" },
      },
      habitantes: {
        rules: ["positive"],
        api: "ae",
        label: "Habitantes",
        list: {
          width: "200px",
          onRender: (item: any) => {
            return (
              <div style={{ width: "100%" }}>{formatNumber(item.value, 0)}</div>
            );
          },
        },

        form: { type: "text" },
      },
      habilitados: {
        rules: ["positive"],
        api: "ae",
        label: "Habilitados para votar",
        list: {
          width: "200px",
          onRender: (item: any) => {
            return (
              <div style={{ width: "100%" }}>{formatNumber(item.value, 0)}</div>
            );
          },
        },
        form: { type: "text" },
      },
      escanos: {
        rules: ["positive"],
        api: "ae",
        label: "Escaños asignados",
        list: {
          width: "240px",
          label: "Escaños",
          onRender: (item: any) => {
            return (
              <div style={{ width: "100%" }}>{formatNumber(item.value, 0)}</div>
            );
          },
        },
        form: { type: "text" },
      },
      mapa: {
        rules: [],
        api: "",
        label: "Mapa",
        onHide: () => true,
        onRender: (item: Record<string, any>) => {
          if (item.key == "mapa") {
            return lMapUruguay(item?.item?.code, 40, "var(--cPrimary)");
          }
        },
        list: { width: "180px" },
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
          subtitle={
            "Habitantes: " +
            (item?.habitantes +
              " - Habilitados: " +
              item?.habilitados +
              " - Escaños: " +
              item?.escanos)
          }
          variant="V1"
          active={selItem && selItem.id == item.id}
          left={lMapUruguay(item.code, 40, "var(--cPrimary)")}
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

export default Dptos;
