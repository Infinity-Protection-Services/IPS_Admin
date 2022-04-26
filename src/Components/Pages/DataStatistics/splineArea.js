import React from "react";
import ReactApexChart from "react-apexcharts";

const Spinearea = (props) => {
  const series = [
    {
      name: "Quater1",
      data: [34, 40, 28, 52, 42, 109, 100],
    },
    {
      name: "Quater2",
      data: [32, 60, 34, 46, 34, 52, 41],
    },
    {
      name: "Quater3",
      data: [38, 50, 34, 76, 14, 15, 90],
    },
  ];

  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },

    colors: ["#74DBF5", "#556ee6", "#f46a6a"],
    xaxis: {
      type: "date",
      categories: [
        "2 Nov",
        "4 Nov",
        "11 Nov",
        "11 Nov",
        "18 Nov",
        "25 Nov",
        "2 Dec",
      ],
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    chart: {
      toolbar: {
        tools: {
          download: false,
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height="350"
    />
  );
};

export default Spinearea;
