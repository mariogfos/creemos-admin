import { useEffect, useState } from "react";
import { Card } from "@/mk/components/ui/Card/Card";
import styles from "./viewSurveys.module.css";
import {
  GMT,
  differenceInDays,
  getDateRemaining,
  getDateStrMes,
  getDateTimeStrMes,
  getUTCNow,
} from "@/mk/utils/date";
import Table from "@/mk/components/ui/Table/Table";
import {
  IconFilter,
  IconInterrogation,
  IconTimer,
} from "@/components/layout/icons/IconsBiblioteca";
import { formatNumber } from "@/mk/utils/numbers";
import WidgetEducation from "@/components/ Widgets/WidgetEducation/WidgetEducation";
import WidgetAge from "@/components/ Widgets/WidgetAge/WidgetAge";
import WidgetDonut from "@/components/ Widgets/WidgetDonut/WidgetDonut";
import WidgetBase from "@/components/ Widgets/WidgetBase/WidgetBase";
import Select from "@/mk/components/forms/Select/Select";
import useAxios from "@/mk/hooks/useAxios";
import { lAges, lGreader, RandomsColors } from "@/mk/utils/utils";
import FiltersModal from "@/mk/components/forms/FiltersModal/FiltersModal";
import Button from "@/mk/components/forms/Button/Button";
import HorizontalProgresiveBar from "@/mk/components/ui/HorizontalProgresiveBar/HorizontalProgresiveBar";
import LoadingScreen from "@/mk/components/ui/LoadingScreen/LoadingScreen";

interface GraphValue {
  name: string;
  value: number;
}

interface GraphData {
  labels: string[];
  values: GraphValue[];
}
interface MetricsGender {
  m: number;
  f: number;
  x: number;
}

interface ViewSurveysProps {
  data: any;
  user: any;
  edit?: any;
  onChangeParams: (params: any) => void;
  extraData?: any;
}

const ViewSurveys = ({
  data,
  user,
  edit,
  onChangeParams,
  extraData,
}: ViewSurveysProps) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [dataFormatted, setDataFormatted]: any = useState([]);
  const [squestion_id, setSquestion_id]: any = useState(
    data?.data?.squestions?.[0]?.id
  );
  const [statsGraphData, setStatsGraphData] = useState<GraphData>({
    labels: [],
    values: [],
  });
  const [sexGraphData, setSexGraphData] = useState<GraphData>({
    labels: [],
    values: [],
  });
  const allAnswersCountZero = data?.answers?.every(
    (item: any) => item.sanswers_count === 0
  );
  const {
    m = 0,
    f = 0,
    x = 0,
    0: incomplete = 0,
  } = data?.metrics?.gender || {};
  const allGendersCountZero = m === 0 && f === 0 && x === 0 && incomplete === 0;
  let hoy: any = new Date();
  hoy.setHours(hoy.getHours() - GMT);
  hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  const header: any = [
    {
      key: "index",
      label: "Nº",
      width: "50px",
      onRender: (item: any) => item.i,
    },
    {
      key: "name",
      // label: type == "prov" ? "Provincia" : "Canton",
      label: "Departamento",
    },
    {
      key: "afiliados",
      label: "Cant. afiliados",
      width: "120px",
      responsive: "onlyDesktop",
      style: { justifyContent: "flex-end", textAlign: "right" },
    },
    {
      key: "percentage_hab",
      label: "% de respuestas",
      width: "150px",
      responsive: "onlyDesktop",
      style: { textAlign: "right", display: "block" },
      //   onRenderFoot: (item: any, index: number, sumas: any) => {
      //     const percentage = (sumas.affiliate_count * 100) / sumas.habilitados;
      //     return (
      //       <HorizontalProgresiveBar
      //         total={sumas?.habilitados}
      //         current={sumas?.affiliate_count}
      //         height={24}
      //         color="var(--cAccent)"
      //         goal={[sumas.pid]}
      //       />
      //     );
      // },
      onRender: (item: any) => {
        //  console.log(item,'item aa')
        const totalAfiliados = getTotalAfiliados(data, provs);
        return (
          <HorizontalProgresiveBar
            total={totalAfiliados}
            current={item.item?.afiliados}
            height={24}
            color={RandomsColors[item.i]}
          />
        );
      },
    },
  ];

  const { data: provs } = useAxios("/dptos", "GET", {
    fullType: "L",
    perPage: -1,
  });
  // const { data: education } = useAxios("/educations", "GET", {
  //   perPage: -1,
  //   fullType: "L",
  // });
  const dataFormattedProvs = () => {
    let newData: any = [];

    provs?.data?.forEach((item: any, i: number) => {
      const d = data?.dpto?.[item?.id];
      //     // if (d) {
      newData.push({
        id: item?.id,
        name: item?.name,
        afiliados: d,
      });
      // }
    });
    return newData;
  };

  const getTotalAfiliados = (data: any, provs: any) => {
    let total = 0;

    provs?.data?.forEach((item: any) => {
      const d = data?.dpto?.[item?.id];
      if (d !== undefined) {
        total += d;
      }
    });

    return total;
  };

  useEffect(() => {
    if (data?.answers) {
      const { answers } = data;
      const labels: any = [];
      const values: any = [];
      let formattedData: any = [];

      let totalResponses = 0;
      answers.forEach((answer: any) => {
        totalResponses += answer.sanswers_count;
      });

      answers.forEach((answer: any) => {
        const percentage = (answer.sanswers_count / totalResponses) * 100;
        const formattedPercentage = Number.isNaN(percentage)
          ? "0 %"
          : `${percentage.toFixed(1)} %`;
        labels.push(answer.name);
        values.push({
          name: answer.name,
          values: [answer.sanswers_count],
        });
        formattedData.push({
          ...answer,
          percentage: formattedPercentage,
        });
      });
      // formattedData = formattedData.sort(
      //   (a: any, b: any) => b.sanswers_count - a.sanswers_count
      // );
      const newGraphData = {
        labels: labels,
        values: values,
      };

      setDataFormatted(formattedData);
      setStatsGraphData(newGraphData);
    }

    if (data?.metrics) {
      const { m, f, x, 0: incomplete } = data?.metrics?.gender;
      const hombres = typeof m === "number" ? m : 0;
      const mujeres = typeof f === "number" ? f : 0;
      const prefieroNoDecirlo = typeof x === "number" ? x : 0;
      const incompleto = typeof incomplete === "number" ? incomplete : 0;
      const sexLabels = [
        "Hombres",
        "Mujeres",
        "Prefiero no decirlo",
        "No indicado",
      ];
      const sexValues = [
        { name: "Hombres", values: [hombres] },
        { name: "Mujeres", values: [mujeres] },
        { name: "Prefiero no decirlo", values: [prefieroNoDecirlo] },
        { name: "No indicado", values: [incompleto] },
      ];
      const newSexGraphData: any = {
        labels: sexLabels,
        values: sexValues,
      };
      setSexGraphData(newSexGraphData);
    }
  }, [data]);
  useEffect(() => {
    getFilterTags(),
      onChangeParams({
        ...filters,
      });
  }, [filters]);

  function calcPercentage(total: any, valor: any) {
    if (total === 0) {
      return 0;
    }
    return (valor / total) * 100;
  }

  const getNameTag = (item: string) => {
    if (item === "gender") {
      return (
        "Sexo: " +
        lGreader.find((gender: any) => gender.id === filters[item])?.name
      );
    }
    if (item === "ages") {
      return (
        "Edad: " + lAges.find((ages: any) => ages.id === filters[item])?.name
      );
    }
    if (item === "education") {
      return extraData?.educations?.find(
        (education: any) => education.id === filters[item]
      )?.name;
    }
    if (item === "dpto_id") {
      return provs?.data.find((prov: any) => prov.id === filters[item])?.name;
    }
    if (item === "soption_id") {
      return dataFormatted.find((option: any) => option.id === filters[item])
        ?.name;
    }
    return "";
  };

  const getFilterTags = () => {
    const filteredKeys = Object.keys(filters).filter(
      (key) => filters[key] !== null && filters[key] !== ""
    );
    setFilterTags(filteredKeys);
  };

  const onFilter = async () => {
    const params: Record<string, any> = {};
    console.log(filters, params, "filters");

    if (filters.gender) {
      params.gender = filters.gender;
    }

    if (filters.education) {
      params.education_id = filters.education;
    }

    if (filters.ages) {
      params.ages = filters.ages;
    }
    if (filters.provs) {
      params.dpto_id = filters.dpto_id;
    }
    if (filters.soption_id) {
      params.soption_id = filters.soption_id;
    }

    onChangeParams(params);

    getFilterTags();
    setOpenFilter(false);
  };

  const deleteFilter = async () => {
    onChangeParams({
      gender: "T",
      education_id: "T",
      ages: "T",
      soption_id: "T",
      prov_id: "T",
    });
    setFilters({});
    setFilterTags([]);
    setOpenFilter(false);
  };

  const _onClose = () => {
    setOpenFilter(false);
  };

  const handleTableRowClick = (type: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));

    const paramMap: Record<string, string> = {
      gender: "gender",
      education: "education_id",
      ages: "ages",
      prov_id: "prov_id",
      soption_id: "soption_id",
    };

    const paramKey = paramMap[type] || type;

    onChangeParams({ [paramKey]: value });
  };

  const handleSelectChange = (value: any) => {
    // console.log(value.target,'select value')
    setSquestion_id(value.target.value);
    onChangeParams({ ...filters, squestion_id: value.target.value });
  };

  return (
    <div>
      <div className={styles.headerViewSurveys}>
        <div>
          <div
            className="tSubtitle"
            style={{ marginBottom: 4, color: "var(--cInfo)" }}
          >
            {differenceInDays(hoy, data?.data?.begin_at) > 0 &&
            hoy !== data?.data?.begin_at
              ? "Se publicará " + getDateStrMes(data?.data?.begin_at)
              : `Publicada el ${getDateTimeStrMes(data?.data?.created_at)}`}
          </div>
          <div className="tTitle">{data?.data?.name}</div>
        </div>
        <div className={styles.filtersStyle}>
          <div
            style={{
              display: "flex",
              gap: 8,
              cursor: "pointer",
            }}
            onClick={() => setOpenFilter(true)}
          >
            <IconFilter
              color="var(--cInfo)"
              style={{
                marginTop: -3,
              }}
            />
            <p>Filtros</p>
          </div>

          {filterTags?.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {filterTags?.map((item: string) => (
                <span
                  style={{
                    backgroundColor: "#39ACEC33",
                    fontSize: "10px",
                    padding: "4px 8px",
                    borderRadius: 4,
                  }}
                  key={item}
                >
                  {getNameTag(item)}
                </span>
              ))}
              <span
                style={{
                  backgroundColor: "#DA5D5D33",
                  fontSize: "10px",
                  padding: "4px 8px",
                  borderRadius: 4,
                  color: "var(--cError)",
                  cursor: "pointer",
                }}
                onClick={deleteFilter}
              >
                Limpiar filtros
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.widgetContainer}>
        <div style={{ width: "50%" }}>
          <Card style={{ backgroundColor: "var(--cBlackV1)" }}>
            <div style={{ display: "flex", marginBottom: 8 }}>
              <div className="tTitle">Rendimiento</div>
              {data?.data?.begin_at && (
                <div
                  className={styles.cardDateRemaining}
                  style={{
                    color:
                      getDateRemaining(hoy, data?.data?.end_at) === "Finalizada"
                        ? "var(--cBlackV2)"
                        : "var(--cWhiteV1)",
                  }}
                >
                  <IconTimer size={16} style={{ marginRight: 8 }} />
                  {differenceInDays(hoy, data?.data?.begin_at) > 0 &&
                  hoy !== data?.data?.begin_at
                    ? `Activa en ${differenceInDays(
                        hoy,
                        data?.data?.begin_at
                      )} día${
                        differenceInDays(hoy, data?.data?.begin_at) > 1
                          ? "s"
                          : ""
                      }`
                    : getDateRemaining(hoy, data?.data?.end_at)}
                </div>
              )}
            </div>

            <div className="tSubtitle">
              Resumen hasta {getDateStrMes(getUTCNow())}
            </div>
            <div className={styles["cardsInfoContainer"]}>
              <div className={styles["cardInfo"]}>
                <div>
                  Alcance estimado <IconInterrogation size={24} />
                </div>
                <div>{formatNumber(data?.alcanceEst, 0)}</div>
              </div>
              <div className={styles["cardInfo"]}>
                <div>
                  Alcance real <IconInterrogation size={24} />
                </div>
                <div>{formatNumber(data?.alcanceReal, 0)}</div>
              </div>
              <div className={styles["cardInfo"]}>
                <div>
                  Participación <IconInterrogation size={24} />
                </div>
                <div>
                  {formatNumber(
                    calcPercentage(data.alcanceEst, data.alcanceReal)
                  ) || 0}{" "}
                  %
                </div>
              </div>
            </div>
            <LoadingScreen>
              <Select
                label="Selecciona una opción"
                name="squestion_id"
                required={true}
                value={squestion_id}
                onChange={handleSelectChange}
                options={data?.data?.squestions || []}
                optionLabel="name"
                optionValue="id"
                className="appearance-none"
              />
              {/* {data?.data?.squestion?.length === 1 &&  */}
              <Table
                data={dataFormatted}
                className={"V1"}
                header={[
                  {
                    key: "name",
                    responsive: "",
                    label: "Respuesta",

                    width: "300%",
                  },
                  {
                    key: "sanswers_count",
                    responsive: "",
                    label: "Total de Votos",
                    style: { justifyContent: "flex-end", textAlign: "right" },
                    width: "100",
                  },
                  {
                    key: "percentage",
                    responsive: "",
                    label: "Porcentaje",
                    style: { justifyContent: "flex-end", textAlign: "right" },
                    width: "100",
                  },
                ]}
                onRowClick={(row: any) =>
                  handleTableRowClick("soption_id", row.id)
                }
              />
            </LoadingScreen>
            <WidgetDonut
              title={"Estadísticas porcentuales"}
              emptyTitle={"Ningún afiliado contestó esta encuesta"}
              allCountZero={allAnswersCountZero}
              graphData={statsGraphData}
            />
          </Card>
          <WidgetDonut
            title={"Estadísticas de sexo"}
            emptyTitle={"No hay estadísticas"}
            allCountZero={allGendersCountZero}
            graphData={sexGraphData}
            style={{ backgroundColor: "var(--cBlackV1)" }}
          />
          <div>
            <WidgetEducation
              widget4={data?.metrics?.education}
              title={"Estadística por educación"}
              educations={extraData?.educations}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <WidgetAge
              widget2={data?.metrics.age}
              title={"Estadística por edad"}
            />
          </div>
        </div>

        <div style={{ width: "60%", marginTop: "var(--spL)" }}>
          <WidgetBase
            // title={`Afiliados por ${type == "prov" ? "provincia" : "canton"}`}
            title={`Encuestas respondidas por provincia`}
            style={{ marginBottom: "var(--sL)" }}
          >
            <Table
              data={dataFormattedProvs()}
              header={header}
              className="striped"
              sumarize={true}
              onRowClick={(row: any) => handleTableRowClick("prov_id", row.id)}
            />
          </WidgetBase>
        </div>
      </div>
      <div className={styles.widgetContainer}>
        {/* <div style={{ width: "50%" }}>
          <WidgetEducation
            widget4={data?.metrics.education}
            title={"Estadística por educación"}
          />
        </div> */}
        {/* <div style={{ width: "50%" }}>
          <WidgetAge
            widget2={data?.metrics.age}
            title={"Estadística por edad"}
          />
        </div> */}
      </div>
      <FiltersModal
        open={openFilter}
        onClose={_onClose}
        onSave={onFilter}
        title="Filtros"
        buttonCancel=""
        buttonText="Aplicar filtros"
        buttonExtra={
          <Button variant="secondary" onClick={deleteFilter}>
            Limpiar filtros
          </Button>
        }
        filtersList={[
          {
            title: "Edad",
            data: lAges,
            filters: filters,
            setFilters: setFilters,
            type: "ages",
          },
          {
            title: "Género",
            data: lGreader,
            filters: filters,
            setFilters: setFilters,
            type: "gender",
          },
          {
            title: "Educación",
            data: extraData?.educations || [],
            filters: filters,
            setFilters: setFilters,
            type: "education",
          },
          {
            title: "Departamento",
            data: dataFormattedProvs() || [],
            filters: filters,
            setFilters: setFilters,
            type: "dpto_id",
          },
          {
            title: "Opciones",
            data: dataFormatted || [],
            filters: filters,
            setFilters: setFilters,
            type: "soption_id",
          },
        ]}
      />
    </div>
  );
};

export default ViewSurveys;
