import { useMemo, useState } from "react";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./Leagues.module.css";
import RenderItem from "../shared/RenderItem";
import { useAuth } from "@/mk/contexts/AuthProvider";
import ImportDataModal from "@/mk/components/data/ImportDataModal/ImportDataModal";
import RenderView from "./RenderView";
import useCrudUtils from "../shared/useCrudUtils";
import { getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Leagues = () => {
  const { user } = useAuth();
  const mod: ModCrudType = {
    modulo: "leagues",
    singular: "liga",
    plural: "ligas",
    permiso: "",
    onHideActions: () => {
      return {
        hideEdit: user?.role?.level > 1,
        hideDel: user?.role?.level > 1,
      };
    },
    hideActions: { add: user?.role?.level > 1, edit: false, del: false },
    extraData: true,
    renderView: (props: {
      open: boolean;
      onClose: any;
      item: Record<string, any>;
      onConfirm?: Function;
    }) => <RenderView {...props} />,
    saveMsg: {
      // add: "Liga creado con éxito",
      // edit: "Liga actualizado con éxito",
      // del: "Liga eliminado con éxito",
    },
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
          prefix: "LEAGUE",
          style: { width: "100%" },
        },
        style: { width: 200 },
      },
      avatarLeague: {
        // rules: ["required*add"],
        api: "",
        label: "Avatar",
        list: {
          width: "100",
          onRender: (item: any) => {
            return (
              <Avatar
                src={getUrlImages(
                  "/LEAGUE-" +
                    item?.item.id +
                    ".webp?d=" +
                    item?.item.updated_at
                )}
                name={item?.item.name}
                w={48}
                h={48}
              />
            );
          },
        },
        form: false,
        // style: { width: 50 },
      },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Nombre de la liga",
        list: true,
        form: {
          type: "text",
        },
      },
      description: {
        rules: [""],
        api: "ae",
        label: "Descripción",
        list: true,
        form: { type: "textArea", lines: 5 },
      },
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
    title: "Ligas",
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
    <div className={styles.leagues}>
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

export default Leagues;
