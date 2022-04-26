import React from "react";
import { withNamespaces } from "react-i18next";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SimpleBar from "simplebar-react";

import SidebarContent from "./sidebarContent";

const Sidebar = (props) => {
  // console.log(props);
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? (
            <SimpleBar style={{ maxHeight: "100%" }}>
              <SidebarContent />
            </SimpleBar>
          ) : (
            <SidebarContent />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = ({ layout }) => {
  return {
    layout,
  };
};
export default React.memo(
  connect(mapStatetoProps, {})(withRouter(withNamespaces()(Sidebar)))
);
