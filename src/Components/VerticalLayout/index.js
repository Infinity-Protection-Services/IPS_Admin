import { connect } from "react-redux";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import Header from "./header";
import { commonActions } from "../../Utils";
import Dashboard from "../Pages/Dashboard-ui";
import { crudAction } from "../../Store/Actions";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  capitalizeFirstLetter(string) {
    return string.charAt(1).toUpperCase() + string.slice(2);
  }

  componentDidMount() {
    if (this.props.isPreloader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";
      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }

    // Scroll Top to 0
    window.scrollTo(0, 0);
    let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

    document.title = currentage + "- IPS";
    if (this.props.leftSideBarTheme) {
      this.props.actions.setredux(this.props.leftSideBarTheme, "leftSideBarTheme");
    }

    if (this.props.layoutWidth) {
      this.props.actions.setredux(this.props.layoutWidth, "layoutWidth");
    }

    if (this.props.leftSideBarType) {
      this.props.actions.setredux(this.props.leftSideBarType, "leftSideBarType");
    }

    if (this.props.topbarTheme) {
      this.props.actions.setredux(this.props.topbarTheme, "topbarTheme");
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.breadcrumb !== prevProps.breadcrumb) {
      this.props.isMobile && this.toggleMenuCallback();
    }
  }

  toggleMenuCallback(toggle) {
    const { leftSideBarType } = this.props;
    if ((leftSideBarType === "default" || leftSideBarType === undefined) && toggle) {
      this.props.actions.setredux("condensed", "leftSideBarType");
      if (document.body) document.body.classList.add("sidebar-enable");
      if (document.body) document.body.classList.add("vertical-collapsed");
    } else {
      this.props.actions.setredux("default", "leftSideBarType");
      if (document.body) document.body.classList.remove("sidebar-enable");
      if (document.body) document.body.classList.remove("vertical-collapsed");
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
            </div>
          </div>
        </div>

        <div id="layout-wrapper">
          <Header
            toggleMenuCallback={(toggle) => this.toggleMenuCallback(toggle)}
          />
          <Dashboard
            leftSideBarTheme={this.props.leftSideBarTheme}
            type={this.props.leftSideBarType}
            children={this.props.children}
          />
          {/* <Footer /> */}
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = ({ layout, crud }) => {
  const isMobile = layout.isMobile;
  return { ...crud, isMobile, };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});

export default connect(mapStatetoProps, mapDispatchToProps)(withRouter(Layout));
