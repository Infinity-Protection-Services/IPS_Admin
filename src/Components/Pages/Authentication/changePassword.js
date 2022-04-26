import React from "react";
import { Row, Col, CardBody, Card, Container } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Colorful_IPS_logo } from "../../../Assets/Images/web";
import { bindActionCreators } from "redux";
import { authActions, crudAction } from "../../../Store/Actions";
import { commonActions } from "../../../Utils";

export function renderPassword(field, Placeholder, rules) {
  return (
    <>
      <AvField
        autoComplete="off"
        name={field}
        className="form-control authentication-ip"
        placeholder={Placeholder}
        type="password"
        id={field}
        validate={rules}
        required
      />
    </>
  );
}

function ChangePassword(props) {

  // handle ValidSubmit
  const handleValidSubmit = (values, flag) => {
    if (flag) {
      if (values.password === values.confirmPassword) {
        if (props.userDataToChangePassword) {
          props.actions.ChangePasswordHandler(props, values);
        }
      }
      else {
        props.actions.setredux("Entered password and confirm password doesn't match", 'error_message', "ERROR_MESSAGE")
      }
    }
  }

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="ml-24">
              <img src={Colorful_IPS_logo} alt="ips-logo" />
            </div>
          </div>
        </header>
        <Container>
          <Row className="justify-content-center change-password-wrapper">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden" style={{ paddingTop: "20px" }}>
                <CardBody className="pt-0">
                  <div>
                    <div>
                      <p className="sign-title">Change Password</p>
                      <p className="sign-text">Enter <b>password </b>and <b>confirm password</b></p>
                    </div>
                  </div>
                  <div className="p-2">
                    <AvForm className="form-horizontal mt-9" onValidSubmit={(e, v) => { handleValidSubmit(v, "submit click"); }}                    >
                      <div className="form-group">
                        {renderPassword(
                          "password",
                          "Enter password",
                          {
                            required: { value: true, errorMessage: "Please enter a password", },
                            minLength: { value: 6, errorMessage: "Password length should be minimum 6", },
                            maxLength: { value: 16 },
                          }
                        )}
                      </div>
                      <div className="form-group mt-7">
                        {renderPassword(
                          "confirmPassword",
                          "Re-enter password",
                          {
                            required: { value: true, errorMessage: "Please Confirm Password by re-entering", },
                            maxLength: { value: 16 },
                          }
                        )}
                      </div>
                      <div className="mt-3 pt-8">
                        <button className="btn btn-primary btn-block waves-effect waves-light btn btn-Auth" type="submit" >Submit</button>
                      </div>
                    </AvForm>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

const mapStatetoProps = ({ crud }) => {
  return (crud)
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, authActions, crudAction, commonActions), dispatch),
});
export default withRouter(
  connect(mapStatetoProps, mapDispatchToProps)(ChangePassword)
);
