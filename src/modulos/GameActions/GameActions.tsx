import { useMemo } from "react";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./GameActions.module.css";
import { useAuth } from "@/mk/contexts/AuthProvider";

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const GameActions = () => {
  const { user } = useAuth();

  const mod: ModCrudType = {
    modulo: "gameactions",
    singular: "acción",
    plural: "acciones",
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
  };

  const fields = useMemo(
    () => ({
      league_id: {
        rules: ["required"],
        api: "ae",
        label: "Liga",
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
        form: {
          type: "select",
          optionsExtra: "leagues",
        },
      },
      name: {
        rules: ["required"],
        api: "ae",
        style: { width: 700 },
        label: "Accion de Gamificación ",
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
        style: { width: 200 },
        api: "ae",
        label: "Puntos",
        list: true,
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
        style: { width: 200 },
        list: true,
        form: {
          type: "select",
          options: [
            { id: "A", name: "Habilitada" },
            { id: "X", name: "Deshabilitada" },
          ],
        },
      },
    }),
    []
  );

  const { userCan, List } = useCrud({
    paramsInitial,
    mod,
    fields,
  });

  if (!userCan(mod.permiso, "R")) return <NotAccess />;

  return (
    <div className={styles.gameActions}>
      <List actionsWidth="200px" />
    </div>
  );
};

export default GameActions;
