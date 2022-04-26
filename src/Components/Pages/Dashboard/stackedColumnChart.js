import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import ReactApexChart from "react-apexcharts";

class StackedColumnChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: { height: 200, type: "bar", stacked: !0, toolbar: { tools: { download: false, }, }, zoom: { enabled: !0, }, },
        plotOptions: { bar: { horizontal: !1, columnWidth: "30%", }, },
        dataLabels: { enabled: !1, },
        xaxis: { categories: [props.t("All Users"), props.t("Bounced Users"), props.t("Direct Traffic")], },
        colors: ["#74DBF5", "#556ee6"],
        legend: { position: "bottom", },
        fill: { opacity: 1, },
      },
      series: [
        { name: props.t("New Visitors"), data: [44, 55, 41], },
        { name: props.t("Returning Visitors"), data: [13, 23, 20], },
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

export default withNamespaces()(StackedColumnChart);
