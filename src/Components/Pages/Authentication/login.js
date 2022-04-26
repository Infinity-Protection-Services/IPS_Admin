import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Container } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useLocation, useHistory } from "react-router-dom";
import { authActions, crudAction } from "../../../Store/Actions";
import { commonActions, storageUtils, commonMethods } from "../../../Utils";
import { Colorful_IPS_logo } from "../../../Assets/Images/web";
import eye from "../../../Assets/Images/web/info.svg";
import infoData from "../../../Common/info";
import closeIcon from "../../../Assets/Images/web/remove-toggle.svg";


function Login(props) {
  const [infoDialog, setInfoDialog] = useState(false);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (storageUtils.getAuthenticatedUser()) {
      history.push("/new-jobs");
    }
  }, [props.LoginUser]);

  useEffect(() => {
    if (props.userDataToChangePassword) {
      props.history.push("/changepassword");
    }
  }, [props.userDataToChangePassword]);

  const handleValidSubmit = (values) => {

    if (storageUtils.getRememberCred() || storageUtils.getLoggedUser()) {
      storageUtils.setLoggedUser(values);
    }
    props.actions.LoginWithCognitoHandler({ values });
  };

  return (
    <>
      <div className="account-pages my-5 pt-sm-5">
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="ml-24">
              <img src={Colorful_IPS_logo} alt="IPS-logo" />
            </div>
            <commonMethods.ActionProduct
              className="p-a right-120 cur-point w-40 "
              src={eye}
              id="View"
              onClick={() => setInfoDialog(true)}
            />
          </div>
        </header>
        {infoDialog && (
          <commonMethods.RenderSweetAlert
            onCancel={() => setInfoDialog(false)}

            Body={() =>
              infoData.find((info) => info.path === location.pathname)
                ?.Body || <p >Something went wrong!</p>
            }
            title={
              infoData.find((info) => info.path === location.pathname)?.page ||
              "NO DATA"
            }
            CustomButton={
              <button
                style={{
                  position: "absolute",
                  top: -16,
                  right: -15,
                  background: "transparent",
                  border: "none",
                  height: 25,
                  width: 25,
                }}
                onClick={() => setInfoDialog(false)}
              >
                <img
                  className="close-icon"
                  src={closeIcon}
                  alt="close icon"
                  style={{ height: "100%" }}
                />
              </button>
            }
          />
        )}
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden" style={{ paddingTop: "20px" }}>
                <CardBody className="pt-0 mt-15">
                  <div className="pl-9 mt-9 ">
                    <div>
                      <p className="sign-title">Sign in to IPS</p>
                      <p className="sign-text">
                        Enter Your <b>Email Address </b>And <b>Password.</b>
                      </p>
                    </div>
                  </div>
                  <div className="p-2 mt-9">
                    <AvForm
                      className="form-horizontal"
                      onValidSubmit={(e, value) => {
                        handleValidSubmit(value);
                      }}
                    >
                      <div className="form-group">
                        <AvField
                          name="email"
                          className="form-control"
                          id="email"
                          placeholder="Enter Email"
                          type="email"
                          required
                          errorMessage="Please enter valid email"
                          value={
                            storageUtils.getLoggedUser()?.email ||
                            document.getElementById("email")?.value
                          }
                        />
                      </div>
                      <div className="form-group">
                        <AvField
                          name="password"
                          id="password"
                          type="password"
                          className="mt-7"
                          autoComplete="off"
                          required
                          value={
                            storageUtils.getLoggedUser()?.password ||
                            document.getElementById("password")?.value
                          }
                          errorMessage="Please enter password"
                          placeholder="Enter Password"
                        />
                      </div>
                      <div className="mt-3 pt-8">
                        <button className="btn btn-primary btn-block waves-effect waves-light btn btn-Auth">
                          Sign in
                        </button>
                      </div>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customControlInline"
                          defaultChecked={storageUtils.getLoggedUser()}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customControlInline"
                          onClick={() => {
                            if (storageUtils.getLoggedUser()) {
                              storageUtils.removeLoggedUser();
                              storageUtils.removeRememberCred();
                            } else {
                              storageUtils.setRememberCred();
                            }
                          }}
                        >
                          <span> Remember me</span>
                        </label>
                      </div>
                    </AvForm>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

const mapStatetoProps = ({ crud, auth, layout }) => {
  return { ...crud, ...auth, ...layout };
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    Object.assign({}, authActions, crudAction, commonActions),
    dispatch
  ),
});

export default React.memo(
  withRouter(connect(mapStatetoProps, mapDispatchToProps)(Login))
);
