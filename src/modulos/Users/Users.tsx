/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import styles from "./Users.module.css";
import { useEffect, useMemo, useState, useCallback } // Asegúrate de importar useCallback
from "react";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import NotAccess from "@/components/layout/NotAccess/NotAccess";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import { getFullName, getUrlImages } from "@/mk/utils/string";
// import { useAuth } from "@/mk/contexts/AuthProvider";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import useCrudUtils from "../shared/useCrudUtils";
import RenderItem from "../shared/RenderItem";
import { getDateTimeStrMes } from "@/mk/utils/date";
import RenderForm from "./RenderForm"; // Tu componente de formulario
// import Pagination from "@/mk/components/ui/Pagination/Pagination";

const paramsInitial = {
  perPage: 20,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Users = () => {
  // const { user } = useAuth(); // Descomenta si lo necesitas

  // Usa useCallback para la función renderForm
  // Las dependencias de useCallback deben ser vacías si RenderForm no depende
  // de nada del scope de Users que cambie y deba causar una recreación de esta función.
  // Las props que RenderForm recibe (item, setItem, etc.) son gestionadas por useCrud
  // y se pasan a la función cuando useCrud la invoca.
  const renderFormCallback = useCallback(
    (props: {
      item: any;
      setItem: any;
      extraData: any;
      open: boolean;
      onClose: any;
      user: any; // user de useCrud, no el del AuthProvider necesariamente
      execute: any; // execute de useCrud
      reLoad: () => void; // Añadido para que RenderForm pueda usarlo
    }) => <RenderForm {...props} />,
    [] // Si RenderForm o esta función usaran algo del scope de Users que cambia, agrégalo aquí
  );

  const mod: ModCrudType = useMemo(() => ({ // Envuelve mod en useMemo también
    modulo: "users",
    singular: "administrador",
    plural: "administradores",
    permiso: "",
    export: true,
    renderForm: renderFormCallback, // Usa la función memoizada
    extraData: true, // Mantén esto si useCrud lo usa para pasar datos extra
    // ... el resto de tu configuración de 'mod'
    // onHideActions: (item: any) => {
    //   return {
    //     hideEdit: validate(item, user) || user.id == item.id,
    //     hideDel: validate(item, user) || user.id == item.id,
    //   };
    // },
  }), [renderFormCallback]); // renderFormCallback es ahora una dependencia estable

  const fields = useMemo(() => {
    return {
      id: { rules: [], api: "e" },
      created_at: {
        api: "",
        label: " Fecha y hora de registro",
        form: false,
        list: {
          width: "300px",
          onRender: ({ item, value }: any) => {
            return getDateTimeStrMes(value);
          },
        },
      },
      fullName: {
        api: "ae",
        label: "Nombre",
        form: false,
        onRender: ({ item, extraData }: any) => {
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar
                src={getUrlImages(
                  "/AFF-" + item?.affiliate_id + ".webp?d=" + item?.updated_at
                )}
                name={getFullName(item)}
              />
              <p>{getFullName(item)}</p>
            </div>
          );
        },
        list: true,
      },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Primer nombre",
        form: {
          type: "text",
        },
        list: false,
      },
      middle_name: {
        rules: [""],
        api: "ae",
        label: "Segundo nombre",
        form: { type: "text" },
        list: false,
      },
      last_name: {
        rules: ["required"],
        api: "ae",
        label: "Apellido paterno",
        form: { type: "text" },
        list: false,
      },
      mother_last_name: {
        rules: [""],
        api: "ae",
        label: "Apellido materno",
        form: { type: "text" },
        list: false,
      },
      ci: {
        rules: ["required"],
        api: "ae",
        label: "Cédula de identidad",
        form: { type: "text" },
        list: false,
      },
      prefix_phone: {
        rules: ["required"],
        api: "ae",
        label: "Teléfono", // El label original era "Teléfono", puede que quieras uno más específico como "Prefijo País"
        form: {
          type: "number", // Debería ser 'select' si PREFIX_COUNTRY es un array de opciones
          precarga: 591,
        },
        list: false,
      },
      phone: {
        rules: ["required"],
        api: "ae",
        label: "Teléfono", // El label original era "Número de whatsApp"
        form: {
          type: "number",
        },
        list: { width: "150px" },
      },
      email: {
        rules: ["required"],
        api: "ae",
        label: "Correo electrónico",
        form: {
          type: "text",
        },
        list: { width: "300px" },
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
    showToast, // showToast de useCrud
    // extraData, // Este extraData es el que useCrud carga, no el que RenderForm necesita directamente
    execute, // Este execute es el que RenderForm va a usar
    data,
    params,
    user, // user de useCrud (podría ser diferente al user del AuthContext)
    setParams,
    reLoad, // reLoad de useCrud
    getExtraData, // getExtraData de useCrud
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
          title={getFullName(item) || item?.name} // Asegúrate de que el título siempre tenga un valor
          subtitle={item?.email || item?.description} // Asegúrate de que el subtítulo siempre tenga un valor
          variant="V1"
          active={selItem && selItem.id == item.id}
        />
      </RenderItem>
    );
  };

  if (!userCan(mod.permiso, "R")) return <NotAccess />;
  return (
    <div className={styles.Users}>
      <List onTabletRow={renderItem} />

    </div>
  );
};

export default Users;