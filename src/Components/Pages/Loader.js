import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";

function Loader(props) {
  return (
    <div>
      <div className={props.loader ? "loader loader-show" : "loader"}>
        <CircularProgress />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  loader: state.layout.loader,
});
export default connect(mapStateToProps, null)(Loader);
