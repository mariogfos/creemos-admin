import { useMemo, useState } from "react";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./Medals.module.css";
import RenderItem from "../shared/RenderItem";
import { useAuth } from "@/mk/contexts/AuthProvider";
import ImportDataModal from "@/mk/components/data/ImportDataModal/ImportDataModal";
import RenderView from "./RenderView";
import useCrudUtils from "../shared/useCrudUtils";
import { getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { formatNumber } from "@/mk/utils/numbers";

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Medals = () => {
  const { user } = useAuth();

  const mod: ModCrudType = {
    modulo: "medals",
    singular: "insignia",
    plural: "insignias",
    permiso: "",
    onHideActions: () => {
      return {
        hideEdit: user?.role?.level > 1,
        hideDel: user?.role?.level > 1,
      };
    },
    filter: true,
    hideActions: { add: user?.role?.level > 1, edit: false, del: false },
    extraData: true,
    renderView: (props: {
      open: boolean;
      onClose: any;
      item: Record<string, any>;
      onConfirm?: Function;
    }) => <RenderView {...props} />,
  };

  const fields = useMemo(
    () => ({
      avatar: {
        rules: ["required*add"],
        api: "a*e*",
        label: "Suba una imagen",
        list: false,
        form: {
          type: "imageUpload",
          prefix: "MEDAL",
          style: { width: "100%" },
        },
      },

      league_id: {
        rules: ["required"],
        api: "ae",
        label: "Liga",

        list: {
          width: "180",
          optionsExtra: "leagues",
        },
        filter: {
          // extraData: "leagues",
          label: "Filtrar por Liga",
          width: "200px",
          options: (extraData: any) => {
            let data: any = [{ id: "T", name: "Todas" }];
            extraData?.leagues?.map((c: any) => {
              data.push({
                id: c.id,
                name: c.name,
              });
            });
            return data;
          },
        },
        form: {
          type: "select",
          optionsExtra: "leagues",
        },
      },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Nombre",
        onRender: (item: any) => {
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar
                src={getUrlImages(
                  "/MEDAL-" + item?.item.id + ".webp?d=" + item?.item.updated_at
                )}
                name={item?.item.name}
                w={48}
                h={48}
              />
              <p>{item?.item.name}</p>
            </div>
          );
        },
        list: true,
        form: { type: "text" },
      },
      description: {
        api: "ae",
        label: "Descripción",
        list: true,
        form: { type: "textArea", lines: 5 },
      },
      points: {
        rules: ["required"],
        // style: { width: 50 },
        api: "ae",
        label: "Puntos",
        list: {
          width: "120",
          onRender: (item: any) => {
            return (
              <div style={{ width: "100%", textAlign: "right" }}>
                {formatNumber(item.value, 0)}
              </div>
            );
          },
        },
        form: { type: "number" },
      },
      points_gral: {
        rules: ["required"],
        api: "ae",
        label: "Puntos Generales",
        style: { width: 200 },
        list: false,
        form: { type: "number" },
      },
      status: {
        rules: ["required"],
        api: "ae",
        label: "Estado",
        // style: { width: 210 },
        list: {
          width: "120",
        },
        form: {
          type: "select",
          options: [
            { id: "A", name: "Habilitada" },
            { id: "X", name: "Deshabilitada" },
          ],
        },
      },
      // filter: {
      //   api: "",
      //   label: "",
      //   // hide: true,
      //   list: false,
      //   filter: {
      //     options: [
      //       { id: "A", name: "Habilitada" },
      //       { id: "X", name: "Deshabilitada" },
      //     ],
      //   },
      // },
    }),
    []
  );

  const _onChange = (e: any, item: any, setItem: Function) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
    return false;
  };
  const getFilter = (data: any) => {
    let filter = {};
    return filter;
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
    _onChange,
    // getFilter,
  });
  const { onLongPress } = useCrudUtils({
    onSearch,
    searchs,
    setStore,
    mod,
    onEdit,
    onDel,
    title: "Niveles",
  });

  const [openImport, setOpenImport] = useState(false);

  const renderItem = (
    item: Record<string, any>,
    i: number,
    onClick: Function
  ) => {
    return (
      <RenderItem item={item} onClick={onClick} onLongPress={onLongPress}>
        <div>
          <div>
            <div className="tTitle">{item?.name}</div>
            <div className="tSubtitle">{item?.description}</div>
          </div>
        </div>
      </RenderItem>
    );
  };

  if (!userCan(mod.permiso, "R")) return <NotAccess />;

  return (
    <div className={styles.medals}>
      <List onTabletRow={renderItem} actionsWidth="200px" />
      {openImport && (
        <ImportDataModal
          open={openImport}
          onClose={() => setOpenImport(false)}
          mod={mod}
          showToast={showToast}
          reLoad={reLoad}
          execute={execute}
        />
      )}
    </div>
  );
};

export default Medals;
