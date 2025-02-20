import Button from "@/mk/components/forms/Button/Button";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import React from "react";
import styles from "./Volunteers.module.css";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import useAxios from "@/mk/hooks/useAxios";
import { useAuth } from "@/mk/contexts/AuthProvider";
import Empty from "../Empty/Empty";

const Volunteers = ({ data, reLoad, statusTask }: any) => {
  const { execute } = useAxios();
  const { showToast } = useAuth();
  const volunteersEnabled = data?.filter((v: any) => v.status == "A");
  const volunteersDisabled = data?.filter((v: any) => v.status == "X");

  const enabledOrDisabled = async (item: any, status: any) => {
    const { data } = await execute(
      "/task-participate",
      "POST",
      {
        task_id: item.task_id,
        affiliate_id: item.affiliate_id,
        status: status,
      },
      false,
      true
    );

    if (data?.success == true) {
      if (status == "X") {
        showToast("Afiliado inhabilitado", "success");
      } else {
        showToast("Afiliado habilitado", "success");
      }
      reLoad();
    }
  };
  return (
    <div className={styles.Volunteers}>
      <p className={styles.title}>Habilitados</p>
      <p className={styles.subtitle}>
        Voluntarios habilitados para participar de la tarea, podrás dar de baja
        en caso de que lo requieras
      </p>
      {volunteersEnabled.length > 0 ? (
        volunteersEnabled.map((v: any, index: any) => (
          <ItemList
            key={index}
            variant="V3"
            left={
              <Avatar
                name={getFullName(v.affiliate)}
                src={getUrlImages(
                  "/AFF-" + v.affiliate_id + ".webp?d=" + v?.updated_at
                )}
              />
            }
            title={getFullName(v.affiliate)}
            right={
              <Button
                variant="cancel"
                onClick={() => enabledOrDisabled(v, "X")}
                disabled={statusTask == "F" || statusTask == "V"}
              >
                Inhabilitar
              </Button>
            }
          />
        ))
      ) : (
        <Empty msg="No existen voluntarios activos" />
      )}

      <p className={styles.title}>Inhabilitados</p>
      <p className={styles.subtitle}>
        Voluntarios que ya no participan de la tarea.
      </p>
      {volunteersDisabled.length > 0 ? (
        volunteersDisabled.map((v: any, index: any) => (
          <ItemList
            key={index}
            variant="V3"
            left={
              <Avatar
                name={getFullName(v.affiliate)}
                src={getUrlImages(
                  "/AFF-" + v.affiliate_id + ".webp?d=" + v?.updated_at
                )}
              />
            }
            title={getFullName(v.affiliate)}
            right={
              <Button onClick={() => enabledOrDisabled(v, "A")}>
                Habilitar
              </Button>
            }
          />
        ))
      ) : (
        <Empty msg="No existen voluntarios inactivos" />
      )}
    </div>
  );
};

export default Volunteers;
