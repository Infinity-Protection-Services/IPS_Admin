import React, { useEffect, useState } from "react";
import { withNamespaces } from "react-i18next";

import { connect } from "react-redux";
import { IPS_logo } from "../../Assets/Images/Sidebar";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { authActions, crudAction } from "../../Store/Actions";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { commonActions, storageUtils, commonMethods } from "../../Utils";
import * as entity from "../../Common/entity";
import { Button } from "reactstrap";
import { commissionIcon } from "../../Assets/Images/web";
import eye from "../../Assets/Images/web/info.svg";
import infoData from "../../Common/info";
import { useLocation, useHistory } from "react-router-dom";
import closeIcon from "../../Assets/Images/web/remove-toggle.svg";


function Header(props) {
  const [rateDialog, setRateDialogVisibility] = useState(false);
  const [infoDialog, setInfoDialog] = useState(false);
  const [rate, setRate] = useState();
  const location = useLocation();

  const history = useHistory();


  useEffect(() => {
    if (props.Logout) {
      const a = storageUtils.getLoggedUser();
      storageUtils.setLoggedUser(a);
      localStorage.clear();
      // window.location.reload();
      history.push("/login");
    }
  }, [props.Logout]);

  useEffect(() => {
    if (!props.getCommissionRate) {
      // props.actions.SetLoader(false);
      const payload = {
        type: "getCommissionRate",
      };
      props.actions.postAll(
        entity.commissionRate,
        payload,
        "getCommissionRate"
      );
    }
    props.actions.SetLoader(false);
  }, []);

  useEffect(() => {
    if (rateDialog) {
      setRate(props.getCommissionRate?.data?.commision_rate);
    }
  }, [rateDialog]);

  const toggleMenu = (toggle) => {
    props.toggleMenuCallback(toggle);
  };

  const SetCommissionRate = () => {
    const rate = document.getElementById("amount").value;
    setRate(rate);
    if (rate) {
      const payload = {
        type: "setCommissionRate",
        commission_rate: parseFloat(rate),
        commission_rate_id: props.getCommissionRate?.data?.id || 0,
      };
      props.actions.postAll(
        entity.commissionRate,
        payload,
        "getCommissionRate",
        true
      );
    }
  };

  const isTextSelected = (input) => {
    if (typeof input.selectionStart == "number") {
      return (
        input.selectionStart == 0 && input.selectionEnd == input.value.length
      );
    } else if (typeof document.selection != "undefined") {
      input.focus();
      // setRate(input.value)
      return document.selection.createRange().text === input.value;
    }
  };

  useEffect(() => {
    if (props.getCommissionRate) {
      setRateDialogVisibility(false);
    }
  }, [props.getCommissionRate]);

  return (
    <>
      <header
        id="page-topbar"
        className={`${props.isMobile ? "" : "z-index-1"}`}
      >
        {/* Change language */}
        {/* <button onClick={(e) => {
          props.i18n.changeLanguage('sp');
        }}>sba</button> */}
        <div className="navbar-header p-r">
          <div className="d-flex">
            <div className="navbar-brand-box d-none d-xl-inline-block">
              <Link to={props.redirectOn} className="logo logo-dark">
                <span className="logo-sm">
                  <img src={IPS_logo} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={IPS_logo} alt="" height="50" />
                </span>
              </Link>

              <Link to={props.redirectOn} className="logo logo-light">
                <span className="logo-sm">
                  <img src={IPS_logo} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={IPS_logo} alt="" height="50" />
                </span>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => toggleMenu("toggle")}
              className="btn btn-sm px-3 font-size-16 header-item waves-effect toggle-icon"
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars"></i>
            </button>
            <div className="bread-crumb">{props.t(props.breadcrumb)}</div>
          </div>

          <commonMethods.ActionProduct
            className="p-a right-75 cur-point w-40 "
            src={commissionIcon}
            id="Commission"
            onClick={() => setRateDialogVisibility(true)}
          />
          <commonMethods.ActionProduct
            className="p-a right-120 cur-point w-40 "
            src={eye}
            id="View"
            onClick={() => setInfoDialog(true)}
          />
          <span
            className="cur-point"
            onClick={() => {
              props.actions.LogoutWithCognitoHandler();

              // as backup
              const a = storageUtils.getLoggedUser();
              localStorage.clear();
              storageUtils.setLoggedUser(a);
              // window.location.reload();
              history.push("/login");
            }}
            style={{ padding: "15px", color: "red" }}
          >
            {props.t("Logout")}
          </span>
        </div>
      </header>
      {infoDialog && (
        <commonMethods.RenderSweetAlert
          onCancel={() => setInfoDialog(false)}
          Body={() =>
            infoData.find((info) => info.path === location.pathname)?.Body || (
              <p>Something went wrong!</p>
            )
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
      {rateDialog && (
        <commonMethods.RenderSweetAlert
          onCancel={() => setRateDialogVisibility(false)}
          CustomButton={
            <>
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
                onClick={() => setRateDialogVisibility(false)}
              >
                <img
                  className="close-icon"
                  src={closeIcon}
                  alt="close icon"
                  style={{ height: "100%" }}
                />
              </button>
              <Button
                className="cancel-button mr-4"
                onClick={() => {
                  setRateDialogVisibility(false);
                }}
              >
                {props.t("No")}
              </Button>
              <Button
                className="add-button"
                onClick={(e) => {
                  e.preventDefault();
                  SetCommissionRate(e);
                }}
              >
                {props.getCommissionRate?.data?.commision_rate ||
                  props.getCommissionRate?.data?.commision_rate === 0
                  ? props.t("Update")
                  : props.t("Add")}
              </Button>
            </>
          }
          Body={() => (
            <>
              <AvForm id="create-course-form" className="needs-validation">
                <div className="sweet-alert">
                  <div className="form-wrapper">
                    <span className="category">
                      {props.t("Commission Rate*")}
                    </span>
                    <AvField
                      type="text"
                      className="input"
                      name="amount"
                      id="amount"
                      value={rate > 0 ? rate : "0"}
                      focus={true}
                      autoComplete="off"
                      errorMessage={props.t("Please enter rate")}
                      placeholder={props.t("Please enter rate")}
                      validate={{ required: { value: true } }}
                      onKeyDown={(e) => {
                        const input = document.getElementById("amount").value;
                        if (
                          !isTextSelected(document.getElementById("amount"))
                        ) {
                          if (String(input).length === 0 && e.keyCode === 48) {
                            e.preventDefault();
                          } else if (e.keyCode !== 38 && e.keyCode !== 40) {
                            commonMethods.AllowOnlyNumbersHanlder(e, 1);
                          } else {
                            e.preventDefault();
                          }
                        }
                      }}
                    />
                    <span className="category color-red">
                      {props.t(
                        "*Change amount if you want to change your commission rate"
                      )}
                    </span>
                  </div>
                </div>
              </AvForm>
            </>
          )}
        />
      )}
    </>
  );
}

const mapStatetoProps = ({ layout, crud }) => {
  return { ...layout, ...crud };
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    Object.assign({}, authActions, crudAction, commonActions),
    dispatch
  ),
});

export default React.memo(
  connect(mapStatetoProps, mapDispatchToProps)(withNamespaces()(Header))
);
