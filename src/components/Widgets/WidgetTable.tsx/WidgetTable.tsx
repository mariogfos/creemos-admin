import { useEffect, useState } from "react";
import Table from "@/mk/components/ui/Table/Table";
import style from "./WidgetTable.module.css";
import { formatNumber } from "@/mk/utils/numbers";
import HorizontalProgresiveBar from "@/mk/components/ui/HorizontalProgresiveBar/HorizontalProgresiveBar";
import { RandomsColors } from "@/mk/utils/utils";
import ColoredCircle from "@/mk/components/ui/ColoredCircle/ColoredCircle";
import Select from "@/mk/components/forms/Select/Select";

// let _goals = [
//   { title: '', color: "var(--cSuccess)" },
//   { title: '', color: "var(--cWarning)" },
//   { title: ' ', color: "var(--cInfo)" },
// ];
const colorPalette = [
  "var(--cSuccess)",
  "var(--cWarning)",
  "var(--cInfo)",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  // Añade más colores si es necesario
];

const WidgetTable = ({ data, level, onClickLevel, title }: any) => {
  // console.log(level,'lv')
  const titleFirstColumnLabel =
    level === 1 ? "Departamento" : level === 2 ? "Municipio" : "Barrio";
  const [goals, setGoals]: any = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "percentage_hab",
    direction: "descending",
  });
  let headGoal: any = [];
  const dataWithPercentage = data?.map((item: any, i: number) => {
    const percentage_hab = (item.affiliate_count / item.habilitados) * 100;
    let metas: any = {};
    const goal_ids = Object.keys(item.goals);
    let headGoal1: any = [];

    goal_ids.map((goal, index) => {
      if (headGoal.length === 0 && goal !== "") {
        headGoal1.push({
          key: goal,
          label: goal,
          width: "120px",
          responsive: "",
          style: { justifyContent: "flex-end", textAlign: "right" },
          onRender: (item: any) => {
            return formatNumber(item.value, 0);
          },
          sumarize: true,
        });
      }
      metas[goal] = item.goals[goal];
    });
    if (headGoal.length === 0) {
      headGoal = headGoal1;
    }

    return {
      ...item,
      ...metas,
      percentage_hab,
      i, // Añade el índice aquí
    };
  });

  // useEffect(() => {

  //   let g = _goals
  //     _goals.map((goal,index) => {
  //       // console.log(g[index].title,"TITLEEEEE")
  //       g[index].title = headGoal[index]?.key
  //     }
  //     )
  //     setGoals([...g]);
  //     // console.log("GG",g)
  //     }, [data]);

  useEffect(() => {
    if (headGoal.length > 0) {
      const colorsForGoals = colorPalette.slice(0, headGoal.length);
      const newGoals = headGoal.map((goalItem: any, index: number) => ({
        title: goalItem.key,
        color: colorsForGoals[index],
      }));
      setGoals(newGoals);
    }
  }, [data]);
  const sortedData = dataWithPercentage?.sort((a: any, b: any) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
  const header = [
    {
      key: "index",
      label: "Nº",
      width: "50px",
      responsive: "",
      style: { justifyContent: "flex-end", textAlign: "right" },
      onRender: (item: any) => {
        return item.i;
      },
    },
    {
      key: "name",
      label: titleFirstColumnLabel,
      responsive: "",
    },
    {
      key: "habitantes",
      label: "Población Censo 2023",
      width: "180px",
      responsive: "onlyDesktop",
      style: { justifyContent: "flex-end", textAlign: "right" },
      onRender: (item: any) => {
        return formatNumber(item.value, 0);
      },
      sumarize: true,
    },
    {
      key: "habilitados",
      label: "Votantes habilitados 2023",
      width: "200px",
      responsive: "",
      sumarize: true,
      style: { justifyContent: "flex-end", textAlign: "right" },
      onRender: (item: any) => {
        return formatNumber(item.value, 0);
      },
    },
    {
      key: "affiliate_count",
      label: "Afiliados registrados en Elekta",
      width: "200px",
      responsive: "",
      style: { justifyContent: "flex-end", textAlign: "right" },
      onRender: (item: any) => {
        return formatNumber(item.value, 0);
      },
      sumarize: true,
    },
    //  {
    //    key: "pid",
    //    label: "Votos PID 2023",
    //    responsive: "",
    //    style: { justifyContent: "flex-end", textAlign: "right" },
    //    onRender: (item: any) => {
    //      return formatNumber(item.value, 0);
    //    },
    //    sumarize: true,
    //  },
    ...headGoal,

    {
      key: "percentage_hab",
      label: "Porcentaje de afiliados",
      width: "220px",
      responsive: "onlyDesktop",
      style: { textAlign: "right", display: "block" },

      onRenderFoot: (item: any, index: number, sumas: any) => {
        const percentage = (sumas.affiliate_count * 100) / sumas.habilitados;
        return (
          <HorizontalProgresiveBar
            total={sumas?.habilitados}
            current={sumas?.affiliate_count}
            height={24}
            color="var(--cAccent)"
            goal={[sumas.pid]}
          />
        );
      },
      onRender: (item: any) => {
        // console.log(item?.item?.goals['META 1'],'item.item/goals')
        return (
          <HorizontalProgresiveBar
            total={item.item?.habilitados}
            current={item.item?.affiliate_count}
            height={24}
            color={RandomsColors[item.i]}
            goal={Object.values(item.item?.goals)}
            goalColors={goals.map((goal: any) => goal.color)}
          />
        );
      },
    },
  ];

  const sortingOptions = [
    { id: "name", name: titleFirstColumnLabel },
    { id: "habilitados", name: "Habilitados totales" },
    { id: "affiliate_count", name: "Afiliados totales" },
    { id: "percentage_hab", name: "Porcentaje de afiliación" },
  ];
  const sortDirectionOptions = [
    { id: "ascending", name: "Ascendente" },
    { id: "descending", name: "Descendente" },
  ];
  const onClick = (row: any) => {
    onClickLevel(row);
  };
  return (
    <div className={style.container}>
      <section>
        <p>{title}</p>
        <div className={style.sortControls}>
          <label
            style={{
              display: "flex",
              width: 260,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            Ordenar por :
          </label>

          <Select
            name="sortKey"
            options={sortingOptions}
            optionLabel="name"
            optionValue="id"
            value={sortConfig.key}
            className={style.select}
            inputStyle={{ marginBottom: 0, maxWidth: 200 }}
            onChange={(e: any) =>
              setSortConfig({ ...sortConfig, key: e.target.value })
            }
          />
          <Select
            name="sortDirection"
            options={sortDirectionOptions}
            optionLabel="name"
            optionValue="id"
            value={sortConfig.direction}
            className={style.select}
            inputStyle={{ marginBottom: 0, maxWidth: 200 }}
            onChange={(e: any) =>
              setSortConfig({ ...sortConfig, direction: e.target.value })
            }
          />
        </div>
        {/* <IconExport color="var(--cWhiteV2)" /> */}
      </section>
      <Table
        data={sortedData}
        header={header}
        onRowClick={(row: any) => onClick(row)}
        className="striped"
        sumarize={true}
      />
      {goals.length > 0 && (
        <div className={style.coloresSection}>
          Metas
          {goals.map((goal: any, index: number) => (
            <ColoredCircle
              key={index}
              color={goal.color}
              tooltipText={goal.title}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WidgetTable;
