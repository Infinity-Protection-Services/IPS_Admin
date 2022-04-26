import React from "react";
import { withNamespaces } from "react-i18next";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";

import StackedColumnChart from "./stackedColumnChart";
import SplineArea from "./splineArea";
import Apaexlinecolumn from "./lineColumn";
import Users from "./users";


const DataStatistics = (props) => {
  return (
    <React.Fragment>
      <Row>
        <Col md="6">
          <Card className="statistics-ips-revenue">
            <CardBody className="p-0">
              <CardTitle className="mb-4"> IPS Revenue </CardTitle>
              <SplineArea />
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Users />
        </Col>

        <Col md="6">
          <Card>
            <CardBody className="p-0">
              <CardTitle className="mb-4"> Number Of Downloads </CardTitle>
              <Apaexlinecolumn />
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card>
            <CardBody className="p-0">
              <CardTitle className="mb-4"> Location vise Providers </CardTitle>
              <StackedColumnChart />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default withNamespaces()(DataStatistics);
