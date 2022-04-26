import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

function Snackbar1(props) {
  const vertical = 'top', horizontal = 'right';
  return (
    <Snackbar
      style={{ zIndex: '99999999' }}
      anchorOrigin={{ vertical, horizontal }}
      key={vertical + horizontal}
      open={props.open}
      autoHideDuration={2000}
      onClose={props.handleClose}
    >
      <Alert
        onClose={props.handleClose}
        severity={props.success ? "success" : "error"}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}

export default Snackbar1;
