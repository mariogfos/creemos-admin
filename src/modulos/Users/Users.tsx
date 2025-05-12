/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import styles from "./Users.module.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import NotAccess from "@/components/layout/NotAccess/NotAccess";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { useAuth } from "@/mk/contexts/AuthProvider";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import useCrudUtils from "../shared/useCrudUtils";
import RenderItem from "../shared/RenderItem"; // Your wrapper for list items
import { getDateTimeStrMes } from "@/mk/utils/date";
import RenderForm from "./RenderForm";
import RenderView from "./RenderView"; // Your detail view component

const paramsInitial = {
  perPage: 20,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Users = () => {
  const { user: authUser } = useAuth();

  // Removed: const [viewModalOpen, setViewModalOpen] = useState(false);
  // Removed: const [selectedItem, setSelectedItem] = useState<any>(null);

  const renderFormCallback = useCallback(
    (props: {
      item: any; setItem: any; extraData: any; open: boolean; onClose: any; user: any; execute: any; reLoad: () => void;
    }) => <RenderForm {...props} />,
    []
  );

  const mod: ModCrudType = useMemo(() => ({
    modulo: "users",
    singular: "administrador",
    plural: "administradores",
    permiso: "", // Assign appropriate permission string if used
    export: true,
    hideActions: {
      edit: authUser?.nivel !== 1, // Simpler condition
      del: authUser?.nivel !== 1,  // Simpler condition
      // view: false (default, so view action is enabled)
    },
    renderForm: renderFormCallback,
    renderView: RenderView, // Directly pass the component. useCrud handles the props.
    extraData: true,
    // Optional: If RenderView needs more detailed data than available in list items,
    // useCrud can fetch it before rendering RenderView.
    // loadView: {
    //   fullType: "DET", // Or the specific type your API needs for detailed user data
    //   // key_id: "id" // Or "affiliate_id" if that's the PK for the detail fetch
    // },
  }), [authUser?.nivel, renderFormCallback]); // Corrected dependency

  const fields = useMemo(() => {
    return {
      id: { rules: [], api: "e" },
      created_at: {
        api: "", label: " Fecha y hora de registro", form: false,
        list: { width: "300px", onRender: ({ value }: any) => getDateTimeStrMes(value) },
      },
      fullName: {
        api: "ae", label: "Nombre", form: false, list: true,
        onRender: ({ item }: any) => ( // extraData removed as not used
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              src={getUrlImages(
                "/AFF-" + (item?.affiliate_id || item?.id) + ".webp?d=" + item?.updated_at
              )}
              name={getFullName(item)}
            />
            <p>{getFullName(item)}</p>
          </div>
        ),
      },
      name: { rules: ["required"], api: "ae", label: "Primer nombre", form: { type: "text" }, list: false },
      middle_name: { rules: [""], api: "ae", label: "Segundo nombre", form: { type: "text" }, list: false },
      last_name: { rules: ["required"], api: "ae", label: "Apellido paterno", form: { type: "text" }, list: false },
      mother_last_name: { rules: [""], api: "ae", label: "Apellido materno", form: { type: "text" }, list: false },
      ci: { rules: ["required"], api: "ae", label: "Cédula de identidad", form: { type: "text" }, list: false },
      prefix_phone: {
        rules: ["required"], api: "ae", label: "Prefijo País", // Changed label
        form: { type: "number", precarga: 591 }, list: false,
      },
      phone: { rules: ["required"], api: "ae", label: "Teléfono", form: { type: "number" }, list: { width: "150px" }},
      email: { rules: ["required"], api: "ae", label: "Correo electrónico", form: { type: "text" }, list: { width: "300px" }},
      affiliate_id: { api: "e", form: false, list: false } // Important if used for images/details
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
    // `onView` is destructured from useCrud. The List component will call it.
    onView,
    showToast,
    execute,
    data,
    params,
    user,
    setParams,
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
    // `onView` from useCrud is usually not passed to useCrudUtils,
    // as the List component handles triggering the view.
  });

  const [openImport, setOpenImport] = useState(false);
  useEffect(() => {
    setOpenImport(searchState === 3); // Ensure searchState is number
  }, [searchState]);

  // This function is passed to `List` for rendering items in tablet/mobile view (onTabletRow)
  const renderItemForTablet = (
    item: Record<string, any>,
    i: number,
    // `defaultRowClick` is provided by `useCrud`'s List/Table.
    // It's already wired to call `useCrud`'s internal `onView(item)` logic.
    defaultRowClick: (item: Record<string, any>) => void
  ) => {
    return (
      <RenderItem // Your custom wrapper for list items
        item={item}
        // CRITICAL: Call the defaultRowClick function passed by useCrud.
        // This function will trigger useCrud's onView, which then uses your mod.renderView.
        onClick={() => defaultRowClick(item)}
        onLongPress={() => onLongPress(item)} // Make sure onLongPress from useCrudUtils expects item
      >
        <ItemList
          title={getFullName(item) || item?.name || "Usuario desconocido"}
          subtitle={item?.email || item?.description || "Sin detalles"}
          variant="V1"
          active={selItem?.id === item.id} // selItem comes from useCrudUtils
        />
      </RenderItem>
    );
  };

  if (!userCan(mod.permiso, "R")) return <NotAccess />;

  return (
    <div className={styles.Users}>
      {/*
        The `List` component from `useCrud` handles row clicks.
        If `mod.renderView` is defined (like it is here), `List` will call `onView` from `useCrud`.
        `onView` then renders your `RenderView` component, passing the necessary props:
        { open: boolean, onClose: () => void, item: any, ...otherCrudProps }
      */}
      <List onTabletRow={renderItemForTablet} />
      {/*
        No need to manually render `<RenderView />` with your own state.
        `useCrud` handles rendering it via the `List` component when appropriate.
      */}
    </div>
  );
};

export default Users;