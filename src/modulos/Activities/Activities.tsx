"use client";
import styles from "./Activities.module.css";
import RenderItem from "../shared/RenderItem";
import useCrudUtils from "../shared/useCrudUtils";
import { useMemo } from "react";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import RenderForm from "./RenderForm/RenderForm";
import RenderView from "./RenderView/RenderView";
import { getDateTimeStrMes } from "../../mk/utils/date";
import { cStatusAc, statusAc } from "@/mk/utils/utils";

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Activities = () => {
  const mod: ModCrudType = {
    modulo: "activities",
    // modulo: "affiliates",
    singular: "Actividad",
    plural: "Actividades",
    permiso: "",
    // import: true,
    filter: true,
    renderView: (props: {
      open: boolean;
      onClose: any;
      item: Record<string, any>;
      onConfirm?: Function;
      extraData?: Record<string, any>;
      openList: any;
      setOpenList: any;
      execute?: any;
    }) => <RenderView {...props} />,
    renderForm: (props: {
      item: any;
      setItem: any;
      errors: any;
      extraData: any;
      open: boolean;
      onClose: any;
      user: any;
      execute: any;
      setErrors: any;
      action: any;
      openList: any;
      setOpenList: any;
    }) => {
      return (
        <RenderForm
          onClose={props.onClose}
          open={props.open}
          item={props.item}
          setItem={props.setItem}
          errors={props.errors}
          extraData={props.extraData}
          user={props.user}
          execute={props.execute}
          setErrors={props.setErrors}
          reLoad={reLoad}
          action={props.action}
          openList={props.openList}
          setOpenList={props.setOpenList}
        />
      );
    },
    extraData: true,

    loadView: {},

    onHideActions: (item: any) => {
      return {
        hideEdit: item?.activity_status == "F",

        hideDel: item?.activity_status == "F",
      };
    },
  };

  const fields = useMemo(() => {
    return {
      id: { rules: [], api: "e" },
      created_at: {
        rules: [],
        api: "e",
        label: "Fecha de creación",
        form: {
          type: "date",
        },
        list: {
          width: "240px",
          onRender: (item: any) => {
            // return getDateStrMes(item.item.created_at);
            // hacer que te diga hoy si la actividad se creo hoy con la hora
            const date = new Date(item.item.created_at);
            const today = new Date();
            if (
              date.getDate() == today.getDate() &&
              date.getMonth() == today.getMonth() &&
              date.getFullYear() == today.getFullYear()
            ) {
              return "Hoy";
            } else {
              return getDateTimeStrMes(item.item.created_at);
            }
          },
        },
      },

      name: {
        rules: ["required"],
        api: "ae",
        label: "Nombre de la actividad",
        form: {
          type: "text",
        },
        list: {
          onRender: ({ item }: any) => {
            return (
              <div>
                <p style={{ color: "var(--cWhite)" }}>{item.name}</p>
                <p>{item.description}</p>
              </div>
            );
          },
        },
      },
      // description: {
      //   rules: ["required"],
      //   api: "ae",
      //   label: "Descripción",
      //   form: {
      //     type: "text",
      //   },
      //   list: true,
      // },
      coordinator_id: {
        rules: ["required"],
        api: "ae",
        label: "Coordinador",
        form: {
          type: "select",
          optionsExtra: "gabinete",
        },
        list: {
          width: "400px",
          // options: ({ extraData }: any) => {
          //   console.log(extraData);
          // },
          onRender: ({ item, extraData }: any) => {
            let coo = extraData?.gabinete?.find(
              (e: any) => e.user_id == item.coordinator_id
            );
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar
                  src={getUrlImages(
                    "/ADM-" + item.coordinator_id + ".webp?d=" + item.updated_at
                  )}
                  name={getFullName(coo)}
                />
                <p>{getFullName(coo)}</p>
              </div>
            );
          },
        },
      },
      activity_mode: {
        rules: ["required"],
        api: "ae",
        label: "Modalidad",
        form: {
          type: "select",
          options: [
            { id: "P", name: "Presencial" },
            { id: "V", name: "Virtual" },
          ],
        },
        filter: {
          // extraData: "leagues",
          label: "Modalidad",
          width: "200px",
          options: () => {
            return [
              { id: "T", name: "Todos" },
              { id: "P", name: "Presencial" },
              { id: "V", name: "Virtual" },
            ];
          },
        },
        list: {
          width: "100px",
        },
      },
      activity_status: {
        rules: ["required"],
        api: "ae",
        label: "Estado",
        form: {
          type: "select",
          options: [
            { id: "P", name: "Pendiente" },
            { id: "E", name: "En curso" },
            { id: "F", name: "Finalizada" },
          ],
        },
        filter: {
          // extraData: "leagues",
          label: "Estado",
          width: "200px",
          options: () => {
            return [
              { id: "T", name: "Todos" },
              { id: "P", name: "Pendiente" },
              { id: "E", name: "En curso" },
              { id: "F", name: "Finalizada" },
            ];
          },
        },
        list: {
          width: "100px",
          onRender: ({ item }: any) => {
            let status = item?.activity_status;
            let startDate = new Date(item?.begin_at); // Convertir a fecha
            let today = new Date(); // Fecha actual
            if (item?.activity_status === "P" && today >= startDate) {
              status = "E";
            }
            return (
              <div style={{ color: cStatusAc[status] }}>{statusAc[status]}</div>
            );
          },
        },
      },
      month: {
        rules: [""],
        // api: "ae",
        label: "",
        form: false,
        filter: {
          // extraData: "leagues",
          label: "Mes",
          width: "200px",
          options: () => {
            return [
              { id: "T", name: "Todos" },
              { id: "01", name: "Enero" },
              { id: "02", name: "Febrero" },
              { id: "03", name: "Marzo" },
              { id: "04", name: "Abril" },
              { id: "05", name: "Mayo" },
              { id: "06", name: "Junio" },
              { id: "07", name: "Julio" },
              { id: "08", name: "Agosto" },
              { id: "09", name: "Septiembre" },
              { id: "10", name: "Octubre" },
              { id: "11", name: "Noviembre" },
              { id: "12", name: "Diciembre" },
            ];
          },
        },
        list: false,
      },
    };
  }, []);

  // const onImport = () => {
  //   setOpenImport(true);
  // };

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
    // _onImport: onImport,
  });
  const { onLongPress, selItem, searchState, setSearchState } = useCrudUtils({
    onSearch,
    searchs,
    setStore,
    mod,
    onEdit,
    onDel,
  });

  // const [openImport, setOpenImport] = useState(false);
  // useEffect(() => {
  //   setOpenImport(searchState == 3);
  // }, [searchState]);

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

  // if (!userCan(mod.permiso, "R")) return <NotAccess />;
  return (
    <div className={styles.Activities}>
      <List onTabletRow={renderItem} />
    </div>
  );
};

export default Activities;
