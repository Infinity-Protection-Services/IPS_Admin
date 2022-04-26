import React from "react";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import "font-awesome/css/font-awesome.css";

import StackedColumnChart from "./stackedColumnChart";
import SplineArea from "./splineArea";
import Apaexlinecolumn from "./lineColumn";
import Users from "./users";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { bounced_Session, all_users, direct_Traffic, } from "../../../Assets/Images/web";

function Dashboard(props) {
  const reports = [
    {
      title: props.t("All Users"),
      iconClass: (<img src={all_users} alt={props.t("All Users")} className="dashboard_all_users" />),
      description: "200k",
      rate: { raised: true, value: "17%" }
    },
    {
      title: props.t("Bounced Session"),
      iconClass: (<img src={bounced_Session} alt={props.t("Bounced Session")} className="dashboard_bounced_Session" />),
      description: "20k",
      rate: { raised: false, value: "27%" }
    },
    {
      title: props.t("Direct Traffic"),
      iconClass: (<img src={direct_Traffic} alt={props.t("Direct Traffic")} className="dashboard_direct_Traffic" />),
      description: "96K",
      rate: { raised: false, value: "27%" }
    },
  ];

  return (
    <div>
      <div className="input-group Dashboard-heading-container">
        <div className="Dashboard-heading">
          <span>{props.t("Analytical Overview")}</span>
        </div>
      </div>
      <Row className="dashboard-wrapper p-r">
        <Col md="12" className="dashboard-options">
          <div className="aud-overview">
            <div>{props.t("audience overview")}</div>
            <ExpandMoreIcon />
          </div>
          <div className="p-a r-0 ">
            <span>{props.t("Save")}</span>
            <span>{props.t("Export")}</span>
            <ExpandMoreIcon className="export-svg" />
            <span >{props.t("Email")}</span>
            <span className="mr-15">{props.t("Insight")}</span>
          </div>
        </Col>
        {reports.map((report, key) => (
          <Col md={props.isMobile ? "6" : "3"} key={"_col_" + key}>
            <Card className="mini-stats-wid ">
              <CardBody className="p-0">
                <div>
                  <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                    <span className="avatar-title">{report.iconClass}</span>
                  </div>
                  <div body className="dashboard-card">
                    <div className="l-0">
                      <h4 className="mb-0 ">{report.description}</h4>
                      <p className="text-muted font-weight-medium">
                        {report.title}
                      </p>
                    </div>
                    <div>
                      <i className={report.rate.raised ? "fa fa-arrow-up " : "fa fa-arrow-down color-red"}></i>
                      <p className="text-muted font-weight-medium">{report.rate.value}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}

        <Col md={props.isMobile ? "6" : "3"}>
          <Card className="mini-stats-wid background-dashboard">
            <CardBody className="p-0 d-flex">
              <AddCircleOutlineIcon />
              <div body className="dashboard-card">
                <div className="">
                  <h4 className="mb-0 ">{props.t("Add a segment")}</h4>
                </div>
              </div>
              <div>
                <i className="far fa-plus-circle color-red"></i>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Graph */}
        <Col md="6">
          <Card>
            <CardBody className="p-0">
              <CardTitle className="mb-4">{props.t("Overview")}</CardTitle>
              <SplineArea />
            </CardBody>
          </Card>
        </Col>

        {/* Devices - Bar graph */}
        <Col md="6">
          <Card>
            <CardBody className="p-0">
              <CardTitle className="mb-4">{props.t("Devices")}</CardTitle>
              <Apaexlinecolumn />
            </CardBody>
          </Card>
        </Col>

        {/* User Comparision - Bar Graph */}
        <Col md="4">
          <Card>
            <CardBody className="p-0">
              <CardTitle className="mb-4">{props.t("User comparison")}</CardTitle>
              <StackedColumnChart />
            </CardBody>
          </Card>
        </Col>

        {/* Users */}
        <Col md="4">
          <Users />
        </Col>

        {/* Demographic */}
        <Col md="4">
          <Card>
            <CardBody className="p-0">
              <CardTitle className="mb-4">{props.t("Demographic")}</CardTitle>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = ({ layout }) => {
  return { ...layout }
}

export default withNamespaces()(connect(mapStateToProps, null)(Dashboard));
