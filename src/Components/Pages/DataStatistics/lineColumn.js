import React from "react";
import ReactApexChart from "react-apexcharts";

const Apaexlinecolumn = (props) => {
  const series = [
    {
      name: "Net Profit",
      data: [46, 57, 59, 54, 62],
    },
    {
      name: "Revenue",
      data: [74, 83, 102, 97, 86],
    },
    {
      name: "Free Cash Flow",
      data: [37, 50, 54, 55, 43],
    },
  ];
  const options = { 
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    colors: ["#74DBF5", "#556ee6", "#f46a6a"],
    xaxis: {
      categories: [
        "windows",
        "Macintosh",
        "Android",
        "iOS",
        "Chrome OS",
      ],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
  };

  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  );
};

export default Apaexlinecolumn;
