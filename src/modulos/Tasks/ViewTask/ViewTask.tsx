import DataModal from "@/mk/components/ui/DataModal/DataModal";
import React, { useState } from "react";
import FilterButton from "./FilterButton/FilterButton";
import styles from "./ViewTask.module.css";
import useAxios from "@/mk/hooks/useAxios";
import { getDateTimeStrMes } from "../../../mk/utils/date";
import { cStatusTask, statusTask } from "@/mk/utils/utils";
import Requests from "./Requests/Requests";
import Reports from "./Reports/Reports";
import Volunteers from "./Volunteers/Volunteers";
import History from "./History/History";
import { useAuth } from "@/mk/contexts/AuthProvider";

type PropsType = {
  open: boolean;
  onClose: any;
  id: any;
  reLoad: any;
};

const ViewTask = ({ open, onClose, id, reLoad }: PropsType) => {
  const [tab, setTab] = useState("H");
  const { showToast } = useAuth();
  const {
    data: task,

    execute,
    reLoad: reLoadDet,
  } = useAxios(
    "/tasks",
    "GET",
    {
      fullType: "DET",
      searchBy: id,
    },
    true
  );

  const requestsData = () => {
    let data: any = [];
    task?.data?.data?.affiliate_tasks.map((t: any) => {
      if (t.status == "W") {
        data.push(t);
      }
    });
    return data;
  };

  const volunteersData = () => {
    let data: any = [];
    task?.data?.data?.affiliate_tasks.map((t: any) => {
      if (t.status == "A" || t.status == "X") {
        data.push(t);
      }
    });
    return data;
  };

  const _reLoad = () => {
    reLoadDet(null, true);
    reLoad();
  };
  const onSave = async (status: any) => {
    const { data } = await execute(
      "/task-confirm",
      "POST",
      {
        task_id: task?.data?.data?.id,
        status: status,
      },
      false,
      true
    );
    if (data.success == true) {
      if (status == "F") {
        showToast("Tarea finalizada", "success");
      } else {
        showToast("La tarea se marco como vencida", "success");
      }

      reLoad();
      onClose();
    }
  };

  return (
    <DataModal
      title="Detalles de la tarea"
      open={open}
      onClose={onClose}
      disabled={
        task?.data?.data?.task_status == "F" ||
        task?.data?.data?.task_status == "V"
      }
      buttonCancel=""
      buttonText={
        tab == "R"
          ? task?.data?.data?.task_reports.length > 0
            ? "Finalizar tarea"
            : "Marcar como vencida"
          : ""
      }
      className={styles.ViewTask}
      onSave={() =>
        task?.data?.data?.task_reports.length > 0 ? onSave("F") : onSave("V")
      }
    >
      {!task ? (
        <div>Cargando....</div>
      ) : (
        <>
          <p>{task?.data?.data?.description}</p>
          <div className={styles.card}>
            <p>Requisitos</p>
            <p>{task?.data?.data?.requirements}</p>
          </div>
          <div className={styles.detail}>
            <div>
              <p>Estado</p>
              <p style={{ color: cStatusTask[task?.data?.data?.task_status] }}>
                {statusTask[task?.data?.data?.task_status]}
              </p>
            </div>
            <div>
              <p>Vigencia</p>
              <p>
                {getDateTimeStrMes(task?.data?.data?.begin_at)} -{" "}
                {getDateTimeStrMes(task?.data?.data?.end_at)}
              </p>
            </div>
            <div>
              <p>Puntos</p>
              <p>{task?.data?.data?.points}</p>
            </div>
            <div>
              <p>Voluntarios</p>
              <p>
                {task?.data?.data?.affiliate_tasks.length}/
                {task?.data?.data?.volunteer_count}
              </p>
            </div>
          </div>
          <FilterButton
            style={{ marginTop: "8px" }}
            sel={tab}
            setSel={setTab}
            values={[
              { value: "H", name: "Historial" },
              {
                value: "S",
                name: "Solicitudes",
                badge: requestsData().length > 0 ? requestsData().length : null,
              },
              {
                value: "R",
                name: "Reportes",
                badge:
                  task?.data?.data?.task_reports.length > 0
                    ? task?.data?.data?.task_reports.length
                    : null,
              },
              { value: "V", name: "Voluntarios" },
            ]}
          />
          {tab == "H" && <History />}
          {tab == "S" && (
            <Requests
              data={requestsData()}
              reLoad={_reLoad}
              statusTask={task?.data?.data?.task_status}
            />
          )}
          {tab == "R" && <Reports data={task?.data?.data?.task_reports} />}
          {tab == "V" && (
            <Volunteers
              data={volunteersData()}
              reLoad={_reLoad}
              statusTask={task?.data?.data?.task_status}
            />
          )}
        </>
      )}
    </DataModal>
  );
};

export default ViewTask;
