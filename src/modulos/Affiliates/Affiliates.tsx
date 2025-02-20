/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import styles from "./Affiliates.module.css";
import RenderItem from "../shared/RenderItem";
import useCrudUtils from "../shared/useCrudUtils";
import { useEffect, useMemo, useState } from "react";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import NotAccess from "@/components/layout/NotAccess/NotAccess";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import RenderView from "./RenderView";
// import { useAuth } from "@/mk/contexts/AuthProvider";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
// import Pagination from "@/mk/components/ui/Pagination/Pagination";

// const validate = (item: any, user: any) => {
//   if (user.datos.status === "M" && user.role.level > item.level) {
//     return true;
//   }

//   if (user.datos.status === "A" && user.role.level >= item.level) {
//     return true;
//   }
//   if (item.is_main == "M" && user.datos.status === "A") {
//     return true;
//   }

//   return false;
// };

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Affiliates = () => {
  // const { user } = useAuth();

  // const getLabel = () => {
  //   if (user?.role?.level == 1) {
  //     return "Provincia";
  //   }
  //   if (user?.role?.level == 2) {
  //     return "Canton";
  //   }
  //   if (user?.role?.level == 3) {
  //     return "Parroquia";
  //   }
  //   if (user?.role?.level == 4) {
  //     return "Barrio";
  //   }
  // };
  const mod: ModCrudType = {
    modulo: "affiliates",
    singular: "Afiliado",
    plural: "Afiliados",
    permiso: "",
    // import: true,
    renderView: (props: {
      open: boolean;
      onClose: any;
      item: Record<string, any>;
      onConfirm?: Function;
      extraData?: Record<string, any>;
    }) => <RenderView {...props} />,
    extraData: true,
    hideActions: { add: true, edit: true, del: true },
    loadView: { key_id: "affiliate_id" },

    // onHideActions: (item: any) => {
    //   return {
    //     hideEdit: validate(item, user) || user.id == item.id,

    //     hideDel: validate(item, user) || user.id == item.id,
    //   };
    // },
  };

  const fields = useMemo(() => {
    return {
      id: { rules: [], api: "e" },

      fullName: {
        // rules: ["required"],
        api: "ae",
        label: "Nombre del afiliado",
        form: false,
        onRender: ({ item, extraData }: any) => {
          let entidad = "";
          if (user?.role?.level == 1) {
            entidad =
              "Departamento - " +
              extraData?.dptos?.find((dpto: any) => dpto?.id == item?.dpto_id)
                ?.name;
          }
          if (user?.role?.level == 2) {
            entidad =
              "Municipio - " +
              extraData?.muns?.find((mun: any) => mun?.id == item?.mun_id)
                ?.name;
          }
          if (user?.role?.level == 3) {
            entidad =
              "localidad - " +
              extraData?.locals?.find((lo: any) => lo?.id == item?.local_id)
                ?.name;
          }
          if (user?.role?.level == 4) {
            entidad =
              "Barrio - " +
              extraData?.barrios?.find((ba: any) => ba?.id == item?.barrio_id)
                ?.name;
          }
          if (user?.role?.level == 5) {
            entidad = "";
          }
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar
                src={getUrlImages(
                  "/AFF-" + item?.affiliate_id + ".webp?d=" + item?.updated_at
                )}
                name={getFullName(item)}
              />
              <p>
                {getFullName(item)}
                <br />
                {entidad.includes("undefined") ? (
                  ""
                ) : (
                  <p style={{ marginTop: 4 }}>{entidad}</p>
                )}
              </p>
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

      // entidad: {
      //   // rules: ["required"],
      //   // api: "ae",
      //   label: "Entidad",
      //   form: false,
      //   list: {
      //     width: "320px",
      //     onRender: ({ item, extraData }: any) => {
      //       if (user?.role?.level == 1) {
      //         return extraData?.provs?.find(
      //           (prov: any) => prov?.id == item?.prov_id
      //         ).name;
      //       }
      //       if (user?.role?.level == 2) {
      //         return extraData?.cantons?.find(
      //           (can: any) => can?.id == item?.canton_id
      //         )?.name;
      //       }
      //       if (user?.role?.level == 3) {
      //         return extraData?.parishes?.find(
      //           (par: any) => par?.id == item?.parish_id
      //         )?.name;
      //       }
      //       if (user?.role?.level == 4) {
      //         return extraData?.barrios?.find(
      //           (ba: any) => ba?.id == item?.barrio_id
      //         )?.name;
      //       }
      //     },
      //   },
      // },

      level: {
        rules: ["required"],
        api: "ae",
        label: "Nivel",
        form: {
          type: "text",
        },
        list: { width: "100px" },
      },
      points: {
        rules: ["required"],
        api: "ae",
        label: "Puntos",
        form: {
          type: "text",
        },
        list: { width: "100px" },
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
    // extraData,
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
  // const onChangePage = (page: any) => {
  //   setParams({ ...params, page });
  // };

  if (!userCan(mod.permiso, "R")) return <NotAccess />;
  return (
    <div className={styles.affiliates}>
      <List onTabletRow={renderItem} />
    </div>
  );
};

export default Affiliates;
