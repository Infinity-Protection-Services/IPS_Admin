import React, { useEffect } from "react";
import { withNamespaces } from "react-i18next";
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { crudAction } from "../../Store/Actions";
import { commonActions, storageUtils } from "../../Utils";

// src/Assets

function SidebarContent(props) {
  useEffect(() => {
    var pathName = props.location.pathname;
    const initMenu = () => {
      new MetisMenu("#side-menu");
      var matchingMenuItem = null;
      var ul = document.getElementById("side-menu");
      var items = ul.getElementsByTagName("a");
      for (var i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu()
  }, [props.location.pathname]);

  const activateParentDropdown = (item) => {
    props.actions.setredux(item.text, "breadcrumb");
    item.classList.add("active");
    const parent = item.parentElement;

    if (item.text.toLowerCase().includes('job')) {
      var jobs = document.getElementById('jobs')
      jobs.classList.add("active");
    }
    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");
        const parent3 = parent2.parentElement;
        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  }

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {/* Dashboard */}
          {/* <li>
            <Link to="/dashboard" className="waves-effect">
              <i className="bx bxs-dashboard"></i>
              <span>{props.t("Dashboard")}</span>
            </Link>
          </li> */}

          {/* IPS Users */}
          <li>
            <Link to="/users" className="waves-effect" onClick={() => props.actions.setredux(false, "userDetailVisibility")}            >
              <i className="fas fa-users"></i>
              <span>{props.t("Users")}</span>
            </Link>
          </li>


          {/* Jobs */}
          <li>
            <Link to='/#' className="waves-effect" id="jobs" ><i className="fa fa-briefcase"></i><span>{props.t("Jobs")}</span></Link>
            <ul className={props.isMobile ? 'bg-sidebar ' : ''} >
              <li>
                <Link to="/new-jobs" className={props.isMobile ? "dropdown-item color-white" : "dropdown-item"} onClick={() => props.actions.setredux(false, "jobDetailsVisibility")} >
                  <i className="far fa-plus-square"></i>
                  <span>{props.t('New Job Details')}</span>
                </Link>
              </li>
              <li>  <Link to="/inprogress-jobs" className={props.isMobile ? "dropdown-item color-white" : "dropdown-item"} onClick={() => props.actions.setredux(false, "jobDetailsVisibility")} >
                <i className="fas fa-tasks"></i>
                <span>{props.t('In-Progress Jobs')}</span>
              </Link>
              </li>
              <li>  <Link to="/completed-jobs" className={props.isMobile ? "dropdown-item color-white" : "dropdown-item"} onClick={() => props.actions.setredux(false, "jobDetailsVisibility")} >
                <i className="fas fa-check-circle"></i>
                <span>{props.t('Completed Jobs')}</span>
              </Link>
              </li>
            </ul>
          </li>

          {/* Payment  */}
          <li onClick={() => {
            props.actions.setredux(false, "paymentDetailsVisibility")
            props.actions.SetNull({ payload: null, entity: "jobDetailsVisibility" })
          }}>
            <Link to="/payment" className="waves-effect">
              <i className="fab fa-cc-stripe"></i>
              <span>{props.t("Payment")}</span>
            </Link>
          </li>

          {/* Category */}
          <li>
            <Link to="/category" className="waves-effect">
              <i className="fas fa-list-alt" aria-hidden="true"></i>
              <span>{props.t("Category")}</span>
            </Link>
          </li>

          {/* Products */}
          <li>
            <Link to="/products" className="waves-effect" onClick={() => {
              props.actions.setredux(false, "showEditPage");
              props.actions.setredux(false, "showViewPage");
              props.actions.setredux(false, "showAddPage");
            }}
            >
              <i className="fas fa-box-open"></i>
              <span>{props.t("Products")}</span>
            </Link>
          </li>

          {/* Orders */}
          <li onClick={() => { props.actions.setredux(false, "orderDetailVisibility") }}>
            <Link to="/orders" className="waves-effect">
              <i className="fas fa-cart-arrow-down" aria-hidden="true"></i>
              <span>{props.t("Orders")}</span>
            </Link>
          </li>


          {/* Customer Support */}
          <li onClick={() => {
            props.actions.setredux(false, "supportDetailVisibility")
            storageUtils.removeSupportorDispute()
          }}>
            <Link to="/support" className="waves-effect">
              <i className="bx bx-support"></i>
              <span>{props.t("Customer Support")}</span>
            </Link>
          </li>

          {/* Dispute request */}
          <li onClick={() => {
            props.actions.setredux(false, "supportDetailVisibility")
            storageUtils.removeSupportorDispute()
          }}>
            <Link to="/dispute" className="waves-effect">
              <i className="mdi mdi-chat-alert"></i>
              <span>{props.t("Dispute Requests")}</span>
            </Link>
          </li>

          {/* Chat list */}
          <li onClick={() => {
            storageUtils.removeSupportorDispute()
          }}>
            <Link to="/chat" className="waves-effect">
              <i className="fas fa-comments"></i>
              <span>{props.t("Chat List")}</span>
            </Link>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});

export default React.memo(withRouter(withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(SidebarContent))));
