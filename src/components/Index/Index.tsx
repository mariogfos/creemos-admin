import { useEffect, useState } from "react";
import useAxios from "@/mk/hooks/useAxios";
import { useAuth } from "@/mk/contexts/AuthProvider";
import NotAccess from "../auth/NotAccess/NotAccess";
import WidgetTime from "../Widgets/WidgetTime.tsx/WidgetTime";
import WidgetTable from "../Widgets/WidgetTable.tsx/WidgetTable";
import WidgetProgresiveBar from "../Widgets/WidgetProgresiveBar/WidgetProgresiveBar";
import styles from "./index.module.css";
import WidgetCandidates from "../ Widgets/WidgetCandidates/WidgetCandidates";
import HistoryTitle from "../ Widgets/WidgetHistoryTitle/HistoryTitle";
import { WidgetSkeleton } from "@/mk/components/ui/Skeleton/Skeleton";
import DashboardMap from "../ Widgets/DashboardMap/DashboardMap";

const HomePage = () => {
  const { setStore, userCan } = useAuth();
  const { user } = useAuth();
  const [itemSelected, setItemSelected]: any = useState({});
  const [poblacion, setPoblacion]: any = useState({ label: "Habilitados" });
  const [histParams, setHistParams] = useState<any[]>([]);
  const [histTitulos, setHistTitulos] = useState<string[]>([
    "Mapa de " + (user?.entidad?.name || "Uruguay"),
  ]);

  // console.log("user: ", user);

  const paramInitial: any = {
    level:
      user?.role?.level <= 2
        ? 1
        : user?.role?.level == 4
        ? 3
        : user?.role?.level < 4
        ? 2
        : user?.role?.level,
    code: user?.entidad?.name,
    searchBy: user?.role?.level === 1 ? 1 : user?.entidad?.id,
  };
  // console.log(user?.role.level);
  const [params, setParams] = useState(paramInitial);

  useEffect(() => {
    setStore({
      title: "Resumen",
    });
  }, []);

  const {
    data: dashboard,
    reLoad,
    loaded,
  } = useAxios("/dashboard", "GET", {
    ...params,
  });

  useEffect(() => {
    reLoad(params);
  }, [params]);

  const onClick = (row: any) => {
    if (params?.level === 3) {
      return;
    }

    const item: any = dashboard?.data?.entidad.find(
      (d: any) => d.name == row?.name
    );

    setHistParams((prev) => [...prev, params]);
    setHistTitulos((prev) => [...prev, item?.name]);

    setItemSelected(item);
    setParams({
      ...params,
      searchBy: item?.id,
      level: (params?.level || 0) + 1,
      code: item?.name,
    });
  };

  const onBack = (index: number) => {
    // Recorta los parámetros e historial hasta el índice especificado
    const newHistParams = histParams.slice(0, index + 1);
    const newHistTitulos = histTitulos.slice(0, index + 1);

    // Actualiza los estados de historial
    setHistParams(newHistParams);
    setHistTitulos(newHistTitulos);

    if (index === 0) {
      // Si es el nivel inicial, establece los parámetros iniciales
      setParams(paramInitial);
      setHistParams([]);
      setHistTitulos(["Mapa de " + (user?.entidad?.name || "Uruguay")]);
    } else {
      // Obtiene el nivel anterior
      const item = newHistParams[index];

      console.log("item anterior: ", item);

      if (item) {
        setParams({
          ...item,
          // level: item?.level,
        });
        console.log("params: ", params);
      } else {
        // Si no hay datos en el historial, usa los parámetros iniciales
        console.log("entro aqui:");
        setParams(paramInitial);
      }
    }
  };

  useEffect(() => {
    if (!loaded) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [loaded]);

  if (!userCan("home", "R")) return <NotAccess />;
  if (!loaded) return <WidgetSkeleton />;
  // console.log(poblacion);
  return (
    <div className={styles.container}>
      {params?.level > 1 && (
        //   <WidgetTime data={dashboard?.data?.countDown} />
        // ) : (
        <>
          <HistoryTitle
            param={[params, setParams]}
            histTitulos={histTitulos}
            onBack={onBack}
          />
        </>
      )}
      <section>
        {params?.level <= 4 && (
          <div>
            <DashboardMap
              data={dashboard?.data}
              onClick={onClick}
              params={[params, setParams]}
              entidadData={user}
              itemSelected={itemSelected}
              setPoblacion={setPoblacion}
            />
          </div>
        )}
        <div>
          <WidgetTime data={dashboard?.data?.countDown} />
          <WidgetProgresiveBar
            data={{
              totalAfiliados:
                user?.role?.level === params?.level
                  ? user?.entidad?.affiliate_count
                  : dashboard?.data?.entidad.reduce(
                      (acc: number, current: any) =>
                        acc + current.affiliate_count,
                      0
                    ),
              totalHabilitados: poblacion?.total
                ? poblacion?.total
                : user?.role?.level === params?.level
                ? user?.entidad?.habilitados
                : dashboard?.data?.entidad.reduce(
                    (acc: number, current: any) => acc + current.habilitados,
                    0
                  ),

              level: params?.level,
            }}
            poblacion={poblacion}
          />
          <WidgetCandidates
            data={dashboard?.data?.candidates}
            params={params}
          />
        </div>
      </section>
      {dashboard?.data?.entidad?.length > 0 && (
        <>
          <section>
            <div>
              <WidgetTable
                data={dashboard?.data.entidad}
                title={`Resumen de afiliados por ${
                  params?.level === 1
                    ? "departamento"
                    : params?.level === 2
                    ? "municipios"
                    : "barrios"
                }`}
                level={params?.level}
                onClickLevel={onClick}
              />
            </div>
          </section>
          <section style={{ justifyContent: "right" }}>
            <p>
              Fuentes: Instituto Nacional de Estadística y Censos (INEC),
              Uruguay <br /> Consejo Nacional Electoral (CNE), Uruguay
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
