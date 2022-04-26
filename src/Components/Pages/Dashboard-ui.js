import React from "react";
import Sidebar from "../VerticalLayout/sideBar";

function Dashboard(props) {
  return (
    <>
      <Sidebar theme={props.leftSideBarTheme} type={props.type} />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">{props.children}</div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
