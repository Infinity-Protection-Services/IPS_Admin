import React from "react";

import { Row, Col, CardBody, Card, Container } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Colorful_IPS_logo, Success } from "../../../Assets/Images/web";

const SuccessMessage = (props) => {
  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="ml-24">
              <img src={Colorful_IPS_logo} alt="colorful_ips" />
            </div>
          </div>
        </header>
        <Container>
          <Row className="justify-content-center success-message-wrapper">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden" style={{ paddingTop: "20px" }}>
                <CardBody className="pt-0">
                  <div>
                    <div>
                      <p className="sign-title">Success</p>
                      <p className="sign-text">
                        Password Successfully Changed.
                      </p>
                    </div>
                  </div>
                  <div className="success-image-wrapper">
                    <img src={Success} alt="success" />
                  </div>
                  <div className="p-2">
                    <div className="mt-3">
                      <button
                        className="btn btn-primary btn-block waves-effect waves-light btn"
                        type="submit"
                        onClick={() => {
                          props.history.push("/login");
                        }}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => ({});

export default withRouter(connect(mapStatetoProps, null)(SuccessMessage));
