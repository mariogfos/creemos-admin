import dynamic from "next/dynamic";
import React, { use, useEffect, useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const GraphCategories = ({ data }: any) => {
  const [chartOptions, setChartOptions]: any = useState(null);
  const [chartSeries, setChartSeries]: any = useState([
    {
      data: [0, 0, 0, 0, , 0, 0],
    },
  ]);
  const colors = [
    "var(--cRandom15)",
    "var(--cRandom14)",
    "#A2D2BF",
    "#FAEDCB",
    "#A9CCE3",
    "#39ACEC",
    "#D3C4E3",
  ];
  // useEffect(() => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: "65%",
        distributed: true,
        borderRadius: 5,
        borderRadiusApplication: "end",
        endingShape: "flat",
        dataLabels: {
          position: "top",
        },
        horizontal: true,
      },
    },
    //   dataLabels: {
    //     enabled: true,
    //     formatter: function (val: number) {
    //       return val.toLocaleString();
    //     },
    //     offsetX: 24,
    //     style: {
    //       fontSize: "12px",
    //       colors: dataLabelColors,
    //     },
    //   },
    //   xaxis: {
    //     categories: categories,
    //     labels: {
    //       show: false,
    //     },
    //   },
    xaxis: {
      categories: [
        "Recintos donde Creemos gana con más del 80%",
        "Recintos donde Creemos gana entre el 50% y 80%",
        "Recintos donde Creemos gana sin superar el 50%",
        "Recintos donde MAS-IPSP gana sin superar el 50%",
        "Recintos donde MAS-IPSP gana con el 50% y 80%",
        "Recintos donde MAS-IPSP gana con más 80%",
        "Recintos donde gana otro partido diferente a Creemos y MAS-IPSP",
      ],
      labels: {
        style: {
          colors: "var(--cWhite)",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#7d7d7d",
        },
        show: false,
      },
    },
    grid: {
      borderColor: "#656F78",
    },
    legend: {
      show: false,
      // position: "bottom",
      // horizontalAlign: "center",
      labels: {
        colors: "#C6C6C6",
      },
      // markers: {
      //   fillColors: colors,
      //   radius: 10,
      // },
      itemMargin: {
        horizontal: 16,
      },
      // customLegendItems: categories,
    },
    dataLabels: {
      enabled: false,
    },
    //   legend: false,
    tooltip: {
      enabled: true,
      hideEmptySeries: true,
      y: {
        formatter: function (val: number) {
          return val.toLocaleString();
        },
        title: {
          formatter: (seriesName: any) => "",
        },
      },
    },
  };

  // setChartOptions(options);
  // }, [data]);
  useEffect(() => {
    // if (!data) return;
    setChartOptions(options);
    setChartSeries([
      {
        data: [
          data?.A ?? 0,
          data?.B ?? 0,
          data?.C ?? 0,
          data?.D ?? 0,
          data?.E ?? 0,
          data?.F ?? 0,
          data?.G ?? 0,
        ],
      },
    ]);
  }, [data]);
  if (!chartOptions || !chartSeries) return null;

  return (
    <div style={{ width: "60%" }}>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={380}
      />
    </div>
  );
};

export default GraphCategories;
