/* eslint-disable react-hooks/exhaustive-deps */
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./Listas.module.css";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import useCrudUtils from "../shared/useCrudUtils";
import { useMemo } from "react";
import RenderItem from "../shared/RenderItem";

const onHideActions = (item: any) => {
  let r = { hideEdit: false, hideDel: false };
  if (item?.affiliates_count > 0) r = { hideEdit: false, hideDel: true };
  return r;
};
const mod: ModCrudType = {
  modulo: "listas",
  singular: "Organización",
  plural: "Organizaciones",
  permiso: "listas",
  extraData: true,
  onHideActions,
};

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Listas = () => {
  const onTop = () => {
    return (
      <p>
        Selecciona el sublema al que pertenece la organización (si corresponde)
      </p>
    );
  };
  const fields = useMemo(
    () => ({
      id: { rules: [], api: "e" },
      // sublema_id: {
      //   rules: [""],

      //   api: "ae",
      //   label: "Sublema",
      //   list: { width: "350px" },
      //   form: { type: "select", optionsExtra: "sublemas", onTop: onTop },
      // },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Organización",
        list: { width: "350px" },
        form: { type: "text" },
      },
      description: {
        rules: [],
        api: "ae",
        label: "Descripción",
        list: true,
        form: { type: "text" },
      },
    }),
    []
  );

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
  } = useCrud({
    paramsInitial,
    mod,
    fields,
  });
  const { onLongPress, selItem } = useCrudUtils({
    onSearch,
    searchs,
    setStore,
    mod,
    onEdit,
    onDel,
  });

  const renderItem = (
    item: Record<string, any>,
    i: number,
    onClick: Function
  ) => {
    return (
      <RenderItem item={item} onClick={onClick} onLongPress={onLongPress}>
        <ItemList
          title={item?.name}
          subtitle={findOptions(item.sublema_id, extraData?.sublemas)}
          variant="V1"
          active={selItem && selItem.id == item.id}
        />
      </RenderItem>
    );
  };

  if (!userCan(mod.permiso, "R")) return <NotAccess />;
  return (
    <div className={styles.roles}>
      <List onTabletRow={renderItem} actionsWidth="300px" />
    </div>
  );
};

export default Listas;
