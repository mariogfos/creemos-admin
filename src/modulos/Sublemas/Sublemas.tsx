/* eslint-disable react-hooks/exhaustive-deps */
import useCrud from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./Sublemas.module.css";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import useCrudUtils from "../shared/useCrudUtils";
import { useMemo } from "react";
import RenderItem from "../shared/RenderItem";

const onHideActions = (item: any) => {
  let r = { hideEdit: false, hideDel: false };
  if (item?.listas_count > 0 || item?.affiliates_count > 0)
    r = { hideEdit: false, hideDel: true };
  return r;
};

const mod = {
  modulo: "sublemas",
  singular: "sublema",
  plural: "sublemas",
  permiso: "sublemas",
  onHideActions,
};

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Sublemas = () => {
  const fields = useMemo(() => {
    return {
      id: { rules: [], api: "e" },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Sublema",
        list: true,
        form: { type: "text" },
      },
      description: {
        rules: [],
        api: "ae",
        label: "Descripción",
        list: true,
        form: { type: "text" },
      },
    };
  }, []);

  const { userCan, List, setStore, onSearch, searchs, onEdit, onDel } = useCrud(
    {
      paramsInitial,
      mod,
      fields,
    }
  );

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
          subtitle={item?.description}
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

export default Sublemas;
