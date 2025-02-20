import React, { useEffect, useState } from "react";
import styles from "../Activities.module.css";
import {
  IconArrowLeft,
  IconEdit,
  IconInfoApp,
  IconTrash,
} from "@/components/layout/icons/IconsBiblioteca";
import CardActivityView from "./CardActivityView";
import KeyValue from "@/mk/components/ui/KeyValue/KeyValue";
import ProgressBar from "./ProgressBar/ProgressBar";
import { getDateTimeStrMes } from "../../../mk/utils/date";
import StateLabel from "./StateLabel/StateLabel";
import { getUrlImages } from "@/mk/utils/string";
import { useAuth } from "@/mk/contexts/AuthProvider";
import Table from "@/mk/components/ui/Table/Table";
import Button from "@/mk/components/forms/Button/Button";
import AddTask from "@/modulos/Tasks/AddTask/AddTask";
import ViewTask from "@/modulos/Tasks/ViewTask/ViewTask";
import { cStatusTask, statusTask } from "../../../mk/utils/utils";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import LoadingScreen from "@/mk/components/ui/LoadingScreen/LoadingScreen";
import SkeletonAdapterComponent from "@/mk/components/ui/LoadingScreen/SkeletonAdapter";

const RenderView = ({
  onClose,
  open,
  item,
  setItem,
  extraData,
  openList,
  setOpenList,
  execute,
  reLoad,
}: any) => {
  const { showToast, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [itemTask, setItemTask]: any = useState({});
  const [openView, setOpenView] = useState(false);
  const [deleteTask, setDeleteTask]: any = useState({ open: false, id: null });
  const [loadingTask, setLoadingTask]: any = useState(false);

  const getTask = async () => {
    setLoadingTask(true);
    const { data } = await execute(
      "/tasks",
      "GET",
      {
        fullType: "L",
        searchBy: item?.data.id,
      },
      false,
      true
    );
    if (data?.success === true) {
      setLoadingTask(false);
      setTasks(data?.data);
    } else {
      showToast(data?.message, "info");
      setLoadingTask(false);
    }
  };

  useEffect(() => {
    setOpenList(false);
    if (!openAdd) {
      getTask();
    }
  }, []);

  const typeActivity: any = {
    T: "Taller",
    C: "Capacitación",
    R: "Reuniones",
    V: "Voluntariado",
  };

  const getMissingDays = () => {
    const date = new Date();
    const dateBegin = new Date(item?.data?.date_limit);
    const diff = dateBegin.getTime() - date.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const getDestinys = () => {
    const names: any = ["Todos"];
    if (item?.data?.destiny == 2) {
      extraData?.listas.map((li: any) => {
        let d = item?.data?.adestinies?.find((e: any) => e.lista_id == li.id);
        if (d) {
          names.push(li.name);
        }
      });
    }
    if (item?.data?.destiny == 3) {
      extraData?.dptos.map((dpto: any) => {
        let d = item?.data?.adestinies?.find((e: any) => e.dpto_id == dpto.id);
        if (d) {
          names.push(dpto.name);
        }
      });
    }
    if (item?.data?.destiny == 4) {
      extraData?.muns.map((mun: any) => {
        let d = item?.data?.adestinies?.find((e: any) => e.dpto_id == mun.id);
        if (d) {
          names.push(mun.name);
        }
      });
    }
    return names;
  };

  // const getStatusTask = (value: any) => {

  // };
  const onDelTask = async () => {
    const { data } = await execute(
      "/tasks/" + deleteTask.id,
      "DELETE",
      {},
      false,
      true
    );
    if (data?.success == true) {
      showToast("Tarea eliminada", "success");
      setDeleteTask({ open: false, id: null });
      getTask();
    } else {
      showToast("Ocurrio un error", "error");
    }
  };

  const header = [
    // {
    //   key: "index",
    //   label: "Nº",
    //   width: "50px",
    //   onRender: (item: any) => item.i,
    //   responsive: "onlyDesktop",
    // },
    {
      key: "end_at",
      label: "Fecha de finalización",
      onRender: (item: any) => {
        return getDateTimeStrMes(item.value);
      },
      responsive: "onlyDesktop",
      width: "250px",
    },
    {
      key: "description",
      label: "Descripción de la tarea",
      responsive: "onlyDesktop",
      // width: "250px",
    },
    {
      key: "volunteer_count",
      label: "Voluntarios",
      responsive: "onlyDesktop",
      width: "100px",
      onRender: (item: any) => {
        return item.item.participate_count + "/" + item.value;
      },
    },
    {
      key: "task_status",
      label: "Estado",
      responsive: "onlyDesktop",
      width: "120px",
      onRender: (item: any) => {
        let status = item?.value;
        let startDate = new Date(item?.item?.begin_at);
        let endDate = new Date(item?.item?.end_at);
        let today = new Date();
        if (item?.value === "P" && today >= startDate) {
          status = "E";
        }
        if (today > endDate) {
          status = "S";
        }

        return (
          <p style={{ color: cStatusTask[status] }}>{statusTask[status]}</p>
        );
      },
    },
    {
      key: "pending_count",
      label: "Solicitudes",
      responsive: "onlyDesktop",
      width: "100px",
      onRender: (item: any) => {
        // if (item.value > 0) {
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                backgroundColor:
                  item.value > 0 ? "var(--cAccent)" : "var(--cBlackV2)",
                color: item.value > 0 ? "var(--cWhite)" : "var(--cWhiteV1)",
                padding: item.value > 0 ? "2px 6px" : "2px 5px",
                borderRadius: "100px",
                fontSize: 10,
              }}
            >
              {item.value > 0 ? item.value : "-"}
            </p>
          </div>
        );
        // } else {
        //   return (
        //     <div
        //       style={{
        //         width: "100%",
        //         display: "flex",
        //         justifyContent: "center",
        //       }}
        //     >
        //       <p
        //         style={{
        //           backgroundColor: "var(--cBlackV2)",
        //           color: "var(--cWhiteV1)",
        //           padding: "1px 6px",
        //           borderRadius: "100px",
        //         }}
        //       >
        //         -
        //       </p>
        //     </div>
        //   );
        // }
      },
    },

    {
      key: "acciones",
      label: "Acciones",
      responsive: "onlyDesktop",
      width: "100px",
      onRender: ({ item }: any) => {
        if (item?.task_status == "F" || item?.task_status == "V") {
          return;
        }

        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <IconEdit
              color="var(--cWhite)"
              onClick={(e: any) => {
                e.stopPropagation();
                setOpenAdd(true);
                setItemTask({ ...item });
              }}
            />
            <IconTrash
              color="var(--cError)"
              onClick={(e: any) => {
                e.stopPropagation();
                // onDelTask(item.id);
                setDeleteTask({ open: true, id: item.id });
              }}
            />
          </div>
        );
      },
    },
  ];

  const volunters = () => {
    let volunter = 0;
    tasks?.map((t: any) => {
      volunter = volunter + t.volunteer_count;
    });
    if (itemTask?.id) {
      volunter = volunter - itemTask.volunteer_count;
    }
    return volunter;
  };

  const getStatus = () => {
    let status = item.data.activity_status;
    let startDate = new Date(item?.data?.begin_at);
    // let EndDate = new Date(item?.data?.begin_at);
    let today = new Date(); // Fecha actual

    if (item?.data?.activity_status === "P" && today >= startDate) {
      // Cambiar estado a "En curso" si la fecha y hora han llegado
      status = "E";
    }

    return status;
  };

  const completeTasks = () => {
    let level = 0;
    tasks.map((t: any) => {
      if (t.task_status == "F") {
        level = level + 1;
      }
    });

    return level;
  };

  const finishActivity = async () => {
    const { data } = await execute(
      "/activities/" + item?.data?.id,
      "PUT",
      {
        activity_status: "F",
      },
      false,
      true
    );
    if (data?.success === true) {
      setLoadingTask(false);
      setTasks(data?.data);
    } else {
      showToast(data?.message, "info");
      setLoadingTask(false);
    }
  };

  const showFinishButton = () => {
    let count = 0;
    tasks?.map((t: any) => {
      if (t.task_status == "F" || t.task_status == "V") {
        count = count + 1;
      }
    });
    return count == tasks.length && tasks.length > 0;
  };

  return (
    open && (
      <div className={styles.RenderView}>
        <section>
          <div>
            <p onClick={() => onClose()}>Volver</p>
            <IconArrowLeft />
            <p>Detalle de la actividad</p>
          </div>
          <div>
            <div
              style={{
                width: "100%",
                height: "220px",
                overflow: "hidden",
                borderRadius: "8px",
              }}
            >
              <img
                //   width={416}
                //   height={220}
                style={{ width: "100%", height: "auto" }}
                src={getUrlImages(
                  "/ACTIVITY-" +
                    item?.data?.id +
                    ".webp?d=" +
                    item?.data.updated_at
                )}
                alt="Picture of the author"
              />
            </div>
            <div>
              <p>{typeActivity[item?.data?.activity_type]}</p>
              <StateLabel state={getStatus()} />
            </div>
            <div>
              <p>{item?.data?.name}</p>
              <p>{item?.data?.description}</p>
            </div>
            <div>
              <CardActivityView>
                <p>Fecha de inicio</p>
                <p>{getDateTimeStrMes(item?.data?.begin_at)}</p>
              </CardActivityView>
              <CardActivityView>
                <p>Fecha de finalización</p>
                <p>{getDateTimeStrMes(item?.data?.end_at)}</p>
              </CardActivityView>
            </div>
            <CardActivityView title="Información de general">
              <KeyValue
                title={"Destino"}
                value={getDestinys().join(", ")}
                colorValue="var(--cSuccess)"
              />
              <KeyValue
                title={"Voluntarios inscritos"}
                value={
                  item?.data?.participate_count +
                  "/" +
                  item?.data?.volunteer_count
                }
              />

              {item?.data?.date_limit && (
                <KeyValue
                  title={"Fecha limite de inscripción"}
                  value={getDateTimeStrMes(item?.data?.date_limit)}
                />
              )}
              <KeyValue
                title={
                  item?.data?.activity_mode == "P"
                    ? "Ubicación"
                    : "Link de reunion"
                }
                value={
                  <a
                    href={item?.data?.location}
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      color: "var(--cPrimary)",
                    }}
                  >
                    {item?.data?.activity_mode == "P"
                      ? item?.data?.address
                      : "Entrar a la reunión"}
                  </a>
                }
                bottom={
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      width: "100%",
                      alignItems: "center",
                      color: "var(--cWarning)",
                    }}
                  >
                    <IconInfoApp />
                    {getMissingDays() == 0 ? (
                      <p>Ya empezó</p>
                    ) : getMissingDays() < 0 ? (
                      <p>Finalizaron las inscripciones</p>
                    ) : (
                      <p>
                        {"Faltan " +
                          getMissingDays() +
                          " días para que cierren las inscripciones"}
                      </p>
                    )}
                  </div>
                }
              />
            </CardActivityView>
            {showFinishButton() && (
              <Button
                disabled={item?.data?.activity_status == "F"}
                onClick={finishActivity}
              >
                Finalizar actividad
              </Button>
            )}
          </div>
        </section>
        <section>
          {item?.data?.coordinator_id == user?.id ? (
            <>
              <div>
                <p>Tareas de la actividad</p>
                <ProgressBar level={completeTasks()} maxLevel={tasks?.length} />
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "right",
                  margin: "8px 0px",
                }}
              >
                <Button
                  disabled={item?.data?.activity_status == "F"}
                  style={{ width: 200 }}
                  onClick={() => setOpenAdd(true)}
                >
                  Crear tarea
                </Button>
              </div>
              {loadingTask ? (
                <SkeletonAdapterComponent type="TableSkeleton" />
              ) : (
                <Table
                  data={tasks}
                  header={header}
                  onRowClick={(item) => {
                    setOpenView(true);
                    setItemTask(item);
                  }}
                />
              )}
            </>
          ) : (
            <p>No eres el organizador</p>
          )}
        </section>
        {openAdd && (
          <AddTask
            reLoad={getTask}
            activity={item?.data}
            open={openAdd}
            onClose={() => {
              setOpenAdd(false);
              setItemTask({});
            }}
            item={itemTask}
            execute={execute}
            volunters={volunters()}
          />
        )}
        {openView && (
          <ViewTask
            open={openView}
            reLoad={getTask}
            onClose={() => {
              setOpenView(false);
              setItemTask({});
            }}
            id={itemTask?.id}
          />
        )}
        <DataModal
          title="Eliminar tarea"
          open={deleteTask.open}
          onClose={() => setDeleteTask({ open: false, id: null })}
          onSave={onDelTask}
        >
          <p>Estas seguro de eliminar la tarea</p>
        </DataModal>
      </div>
    )
  );
};

export default RenderView;
