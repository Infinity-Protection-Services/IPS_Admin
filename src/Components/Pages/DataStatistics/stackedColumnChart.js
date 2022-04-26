import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

class StackedColumnChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          height: 200,
          type: "bar",
          stacked: !0,
          toolbar: {
            tools: {
              download: false,
            },
          },
          zoom: {
            enabled: !0,
          },
        },
        plotOptions: {
          bar: {
            horizontal: !1,
            columnWidth: "30%",
            // endingShape: "rounded"
          },
        },
        dataLabels: {
          enabled: !1,
        },
        xaxis: {
          categories: ["All Users", "Bounced User", "Direct Traffic"],
        },
        colors: ["#74DBF5", "#556ee6"],
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
      },
      series: [
        {
          name: "New Visiters",
          data: [44, 55, 41],
        },
        {
          name: "Returning Visiters",
          data: [13, 23, 20],
        },
      ],
    };
  }

  render() {
    return (
      <React.Fragment>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height="200"
        />
      </React.Fragment>
    );
  }
}

export default StackedColumnChart;
