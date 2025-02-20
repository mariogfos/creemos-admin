import { useMemo, useState } from "react";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./Levels.module.css";
import RenderItem from "../shared/RenderItem";
import { useAuth } from "@/mk/contexts/AuthProvider";
import ImportDataModal from "@/mk/components/data/ImportDataModal/ImportDataModal";
import RenderView from "./RenderView";
import useCrudUtils from "../shared/useCrudUtils";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getUrlImages } from "@/mk/utils/string";
import { formatNumber } from "@/mk/utils/numbers";

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Levels = () => {
  const { user } = useAuth();
  const mod: ModCrudType = {
    modulo: "levels",
    singular: "nivel",
    plural: "Niveles",
    filter: true,
    permiso: "",
    extraData: true,
    onHideActions: () => {
      return {
        hideEdit: user?.role?.level > 1,
        hideDel: user?.role?.level > 1,
      };
    },
    hideActions: { add: user?.role?.level > 1, edit: false, del: false },
    renderView: (props: {
      open: boolean;
      onClose: any;
      item: Record<string, any>;
      onConfirm?: Function;
    }) => <RenderView {...props} />,
    saveMsg: {
      add: "Nivel creado con éxito",
      edit: "Nivel actualizado con éxito",
      del: "Nivel eliminado con éxito",
    },
  };

  const fields = useMemo(
    () => ({
      avatarLeague: {
        // rules: ["required*add"],
        api: "a*e*",
        label: "Avatar",
        list: {
          onRender: (item: any) => {
            let updated_at = new Date().toISOString();
            return (
              <Avatar
                src={getUrlImages(
                  "/LEAGUE-" + item?.item.league_id + ".webp?d=" + updated_at
                )}
                name={item?.item.name}
                w={48}
                h={48}
              />
            );
          },
        },
        form: false,
        style: { maxWidth: 100, display: "flex", justifyContent: "center" },
      },
      league_id: {
        rules: ["required"],
        api: "ae",
        label: "liga",
        style: { width: 300 },
        list: {
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
        // form: { type: "select", extraData: "leagues" },
        form: {
          type: "select",
          optionsExtra: "leagues",
        },
      },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Nombre del nivel",
        list: {
          width: "150",
          onRender: (item: any) => {
            return (
              <div style={{ width: "100%", textAlign: "right" }}>
                {formatNumber(item.value, 0)}
              </div>
            );
          },
        },
        form: { type: "text" },
      },
      points: {
        rules: ["required"],
        api: "ae",
        label: "Puntos del nivel",
        list: {
          width: "200px",
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
      // description: {
      //   rules: [""],
      //   api: "ae",
      //   label: "Descripción",
      //   list: false,
      //   form: { type: "textArea", lines: 5 },
      // },
    }),
    []
  );

  const _onChange = (e: any, item: any, setItem: Function) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
    return false;
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
    <div className={styles.levels}>
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

export default Levels;
