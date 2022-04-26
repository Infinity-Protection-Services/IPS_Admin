import React from "react";
import { withNamespaces } from "react-i18next";
import ReactApexChart from "react-apexcharts";
import { connect } from "react-redux";

function Spinearea(props) {
  const series = [
    { name: `${props.t("Users")} (${props.t("All Users")})`, data: [50, 42, 50, 42, 48, 50, 51, 52], },
    { name: `${props.t("Users")} (${props.t("Bounced Users")})`, data: [40, 32, 41, 32, 38, 40, 48, 40], },
    { name: `${props.t("Users")} (${props.t("Direct Traffic")})`, data: [30, 25, 32, 32, 28, 30, 41, 32], },
  ];

  const options = {
    dataLabels: { enabled: false, },
    stroke: { curve: "smooth", width: 3, },
    chart: { toolbar: { tools: { download: false, }, }, },
    colors: ["#74DBF5", "#556ee6", "#f46a6a"],
    xaxis: {
      type: "date",
      categories: ["2 Nov", "4 Nov", "11 Nov", "11 Nov", "18 Nov", "25 Nov", "2 Dec",],
    },
    yaxis: { title: { text: `$ (${props.t("thousands")})`, }, },
    grid: { borderColor: "#f1f1f1", },
    tooltip: { x: { format: "dd MMM yyyy", }, },
  };

  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height="350"
      />
      <div className={`options ${!props.isMobile ? "toggle-icon" : ""} `} >
        <select />
      </div>
    </>
  );
};

const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
};

export default withNamespaces()(connect(mapStateToProps, null)(Spinearea));


// import React from 'react';
// import {
//   Chart,
//   Series,
//   ArgumentAxis,
//   CommonSeriesSettings,
//   Margin,
//   Legend
// } from 'devextreme-react/chart';

// import { withNamespaces } from "react-i18next";


// function App(props) {
//   const dataSource = [{
//     name: "2 Nov",
//     directtraffic: 50,
//     alluser: 40,
//     bounceduser: 30,

//   }, {
//     name: "4 Nov",
//     directtraffic: 42,
//     alluser: 32,
//     bounceduser: 25,
//   }, {
//     name: "11 Nov",
//     directtraffic: 50,
//     alluser: 41,
//     bounceduser: 32,
//   }, {
//     name: "11 Nov",
//     directtraffic: 42,
//     alluser: 32,
//     bounceduser: 32,
//   }, {
//     name: "18 Nov",
//     directtraffic: 48,
//     alluser: 38,
//     bounceduser: 28,
//   }, {
//     name: "25 Nov",
//     directtraffic: 50,
//     alluser: 40,
//     bounceduser: 30,
//   }];


//   const types = ['splinearea', 'stackedsplinearea', 'fullstackedsplinearea'];

//   const type = types[0]

//   return (
//     <div id="chart-demo">
//       <Chart
//         // palette="Harmony Light"
//         title=""
//         dataSource={dataSource}>
//         <CommonSeriesSettings
//           argumentField="name"
//           type={type}
//         />
//         <Series valueField="alluser" name={`${props.t("Users")} (${props.t("All Users")})`}></Series>
//         <Series valueField="bounceduser" name={`${props.t("Users")} (${props.t("Bounced Users")})`}></Series>
//         <Series valueField="directtraffic" name={`${props.t("Users")} (${props.t("Direct Traffic")})`}></Series>
//         <ArgumentAxis valueMarginsEnabled={false} />
//         <Legend
//           verticalAlignment="bottom"
//           horizontalAlignment="center"
//         />
//         <Margin bottom={20} />

//       </Chart>
//       <div className={`options ${!props.isMobile ? "toggle-icon" : ""} `} >
//         <div className="option">
//           <SelectBox
//             dataSource={types}
//             value={""}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// const mapStateToProps = ({ crud, layout }) => {
//   return { ...crud, ...layout }
// };

// export default withNamespaces()(connect(mapStateToProps, null)(App));
