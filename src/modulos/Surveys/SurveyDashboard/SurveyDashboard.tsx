"use client";
import { useEffect, useState } from "react";
import {
  IconAsterisk,
  IconCircleCheck,
  IconCirclePlay,
  IconFluentRecord,
  IconSegmentation,
  IconTimer,
} from "@/components/layout/icons/IconsBiblioteca";
import WidgetStatusSummary from "@/components/Widgets/WidgetStatusSummary/WidgetStatusSummary";
import styles from "./SurveyDashboard.module.css";
import useAxios from "@/mk/hooks/useAxios";
import WidgetBase from "@/components/ Widgets/WidgetBase/WidgetBase";
import WidgetDonut from "@/components/ Widgets/WidgetDonut/WidgetDonut";
import WidgetEducation from "@/components/ Widgets/WidgetEducation/WidgetEducation";
import WidgetAge from "@/components/ Widgets/WidgetAge/WidgetAge";
import TagLabel from "@/mk/components/ui/TagLabel/TagLabel";
import InfoCard from "@/mk/components/ui/InfoCard/InfoCard";
import { formatNumber } from "@/mk/utils/numbers";

const SurveyDashboard = () => {
  const [surveySummaryItems, setSurveyItems]: any = useState([
    {
      id: "1",
      label: "Activas",
      value: 0,
      color: "#39ACEC33",
      icon: <IconFluentRecord size={24} color={"var(--cInfo)"} />,
    },
    {
      id: "2",
      label: "Finalizadas",
      value: 0,
      color: "#00AF9033",
      icon: <IconCircleCheck size={24} color={"var(--cSuccess)"} />,
    },
    {
      id: "3",
      label: "Programadas",
      value: 0,
      color: "#E1C15133",
      icon: <IconTimer size={24} color={"var(--cWarning)"} />,
    },
    {
      id: "4",
      label: "Obligatorias",
      value: 0,
      color: "#DA5D5D33",
      icon: <IconAsterisk size={24} color={"var(--cError)"} />,
    },
  ]);
  const [destiniesNames, setDestiniesNames] = useState([]);
  const [participationPercentage, setParticipationPercentage]: any =
    useState(0);

  const { data: dashboard } = useAxios("/surveys", "GET", {
    fullType: "GEN",
    extraData: 1,
  });

  const [ageData, setAgeData]: any = useState({});
  const [educationData, setEducationData]: any = useState({});
  const [genderData, setGenderData]: any = useState({
    labels: [],
    values: [],
  });

  useEffect(() => {
    if (dashboard?.data?.metrics) {
      const { active, finished, scheduled, mandatory, age, education, gender } =
        dashboard.data.metrics;
      setSurveyItems([
        {
          id: "1",
          label: "Activas",
          value: formatNumber(active, 0),
          color: "#39ACEC33",
          icon: <IconFluentRecord size={24} color={"var(--cInfo)"} />,
        },
        {
          id: "2",
          label: "Finalizadas",
          value: formatNumber(finished, 0),
          color: "#00AF9033",
          icon: <IconCircleCheck size={24} color={"var(--cSuccess)"} />,
        },
        {
          id: "3",
          label: "Programadas",
          value: formatNumber(scheduled, 0),
          color: "#E1C15133",
          icon: <IconTimer size={24} color={"var(--cWarning)"} />,
        },
        {
          id: "4",
          label: "Obligatorias",
          value: formatNumber(mandatory, 0),
          color: "#DA5D5D33",
          icon: <IconAsterisk size={24} color={"var(--cError)"} />,
        },
      ]);
      setAgeData(age);
      setEducationData(education);

      const { m, f, x, 0: incomplete } = dashboard?.data?.metrics?.gender;
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
      setGenderData(newSexGraphData);
    }

    setParticipationPercentage(
      calcPercentage(dashboard?.data?.alcanceReal, dashboard?.data?.alcanceEst)
    );
    // const destiniesNames = destinyArray?.map((item:any) => item.prov?.name).join(', ');
    setDestiniesNames(
      dashboard?.data?.latestSurvey?.sdestinies
        ?.map((item: any) => item.prov?.name)
        .join(", ")
    );
  }, [dashboard]);

  function calcPercentage(current: number, total: number) {
    if (total === 0) {
      return 0; // Evita dividir por cero
    }
    const percentage = (current / total) * 100;
    return Number.isInteger(percentage) ? percentage : percentage.toFixed(2);
  }
  // const participationPercentage = calcPercentage(2, 10);

  const levelOfDestiny: any = {
    1: "Pais",
    2: "Provincia",
    3: "Cantón",
  };

  console.log(participationPercentage, "participationPercentage");

  return (
    <div className={styles.surveyDashboard}>
      <div>
        <WidgetStatusSummary
          title="Resumen general de encuestas"
          items={surveySummaryItems}
          subtitle={"Distribución de encuestas según tipo y estado"}
        />
        {/* {dashboard?.data?.latestSurvey?.squestions?.map((item:any, index:number) => (               
                    <WidgetPercentage title={'Última encuesta publicada'} index={index} data={item} />         
                ))} */}

        <WidgetBase className={styles.countOfAnswers}>
          <section>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3 className={styles.headTitle}>Última encuesta publicada</h3>{" "}
              {dashboard?.data?.isActive ? (
                <div className={`${styles.statusTag} ${styles.activeTag}`}>
                  <IconFluentRecord size={16} color={"var(--cInfo)"} />
                  Activa
                </div>
              ) : (
                <div className={`${styles.statusTag} ${styles.finishedTag}`}>
                  {" "}
                  <IconCircleCheck size={16} color={"var(--cSuccess)"} />
                  Finalizada
                </div>
              )}
            </div>
            <div className={styles.nameSurvey}>
              {dashboard?.data?.latestSurvey?.name}
            </div>
            <div className={styles.descriptionSurvey}>
              {dashboard?.data?.latestSurvey?.description}
            </div>
            {destiniesNames?.length > 0 && (
              <div className={styles.provTitleSurvey}>
                <IconSegmentation style={{ marginRight: 4 }} />{" "}
                {levelOfDestiny[dashboard?.data?.latestSurvey?.destiny]}{" "}
                {destiniesNames}
              </div>
            )}{" "}
          </section>
          <section className={styles.cardsInfoContainer}>
            <InfoCard
              label="Alcance estimado"
              value={formatNumber(dashboard?.data?.alcanceEst, 0)}
              tooltipText={
                "Representa el número total de afiliados que fueron elegidos como destinatarios de la encuesta"
              }
            />
            <InfoCard
              label="Alcance real"
              value={formatNumber(dashboard?.data?.alcanceReal, 0)}
              tooltipText={
                "Indica la cantidad de afiliados que completaron la encuesta correctamente"
              }
            />
            <InfoCard
              label="Participación"
              // value={formatNumber(participationPercentage)}
              value={participationPercentage + "%"}
              tooltipText={
                "Muestra el porcentaje de afiliados que respondieron la encuesta en comparación con el alcance estimado"
              }
            />
            <InfoCard
              label="Preguntas"
              value={formatNumber(
                dashboard?.data?.latestSurvey?.squestions?.length,
                0
              )}
              tooltipText={"Indica el número total de preguntas en la encuesta"}
            />
          </section>

          <WidgetDonut
            title={
              <TagLabel
                label={"Sexo"}
                styles={{
                  backgroundColor: "var(--cRandom3)",
                  fontSize: 14,
                  fontWeight: "var(--bRegular)",
                }}
              />
            }
            emptyTitle={"No hay estadísticas"}
            allCountZero={genderData.values.every((val: any) => val === 0)}
            graphData={genderData}
            style={{ backgroundColor: "var(--cBlackV1)" }}
          />
          <WidgetAge
            widget2={ageData}
            title={
              <TagLabel
                label={"Edad"}
                styles={{ backgroundColor: "var(--cRandom17)" }}
              />
            }
          />
          <WidgetEducation
            widget4={educationData}
            title={
              <TagLabel
                label={"Educación"}
                styles={{ backgroundColor: "var(--cRandom8)" }}
              />
            }
            educations={dashboard?.data?.educations}
          />
        </WidgetBase>
      </div>
    </div>
  );
};

export default SurveyDashboard;
