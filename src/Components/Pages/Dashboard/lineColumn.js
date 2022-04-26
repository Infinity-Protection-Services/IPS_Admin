import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { withNamespaces } from "react-i18next";

function Chart(props) {

  const series = [
    { name: props.t("All Users"), data: [74, 83, 102, 97, 86], },
    { name: props.t("Bounced Session"), data: [46, 57, 59, 54, 62], },
    { name: props.t("Direct Traffic"), data: [37, 50, 54, 55, 43], },
  ];

  const options = {
    chart: { toolbar: { tools: { download: false, }, }, },
    plotOptions: { bar: { horizontal: false, columnWidth: "45%", endingShape: "rounded", }, },
    dataLabels: { enabled: false, },
    stroke: { show: true, width: 2, colors: ["transparent"], },
    colors: ["#74DBF5", "#556ee6", "#f46a6a"],
    xaxis: { categories: [props.t("windows"), props.t("Macintosh"), props.t("Android"), props.t("iOS"), props.t("Chrome OS")], },
    yaxis: { title: { text: `$ (${props.t("thousands")})`, }, },
    grid: { borderColor: "#f1f1f1", },
    fill: { opacity: 1, },
    tooltip: { y: { formatter: function (val) { return "$ " + val + " " + props.t("thousands"); }, }, },
  };

  return (
    <React.Fragment>
      <ReactApexChart options={options} series={series} type="bar" height="359" />
    </React.Fragment>
  )
}

export default withNamespaces()(Chart);



// import React from "react";
// import { withNamespaces } from "react-i18next";

// import ReactApexChart from "react-apexcharts";

// function Apaexlinecolumn(props) {

//   const series = [
//     { name: props.t("All Users"), data: [74, 83, 102, 97, 86], },
//     { name: props.t("Bounced Session"), data: [46, 57, 59, 54, 62], },
//     { name: props.t("Direct Traffic"), data: [37, 50, 54, 55, 43], },
//   ];

//   const options = {
//     chart: { toolbar: { tools: { download: false, }, }, },
//     plotOptions: { bar: { horizontal: false, columnWidth: "45%", endingShape: "rounded", }, },
//     dataLabels: { enabled: false, },
//     stroke: { show: true, width: 2, colors: ["transparent"], },
//     colors: ["#74DBF5", "#556ee6", "#f46a6a"],
//     xaxis: { categories: [props.t("windows"), props.t("Macintosh"), props.t("Android"), props.t("iOS"), props.t("Chrome OS")], },
//     yaxis: { title: { text: `$ (${props.t("thousands")})`, }, },
//     grid: { borderColor: "#f1f1f1", },
//     fill: { opacity: 1, },
//     tooltip: { y: { formatter: function (val) { return "$ " + val + " " + props.t("thousands"); }, }, },
//   };

//   return (
//     <ReactApexChart options={options} series={series} type="bar" height={350} />
//   );
// };

// export default withNamespaces()(Apaexlinecolumn);
