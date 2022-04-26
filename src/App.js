import React, { Component } from "react";

import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { userRoutes, authRoutes } from "./Routes/allRoutes";
import Authmiddleware from "./Routes/middleware/Authmiddleware";
import IdleTimer from 'react-idle-timer';

// layouts Format
import VerticalLayout from "./Components/VerticalLayout";
import NonAuthLayout from "./Components/nonAuthLayout";

import "./Assets/Scss/theme.scss";
import { authActions, crudAction } from "./Store/Actions";
import { commonActions, storageUtils } from "./Utils";
import * as actionTypes from "./Common/actionTypes";
import Loader from "./Components/Pages/Loader";
import Snackbar from "./Common/snackbar";
import "./i18n";

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
// import { initFirebaseBackend } from "./Components/helpers/firebase_helper";
// import Config from '../src/Components/helpers/config'


Amplify.configure(awsconfig);

export const NonAuthmiddleware = ({ component: Component, layout: Layout }) => {
  return <Route
    render={(props) => {
      return (<Layout><Component {...props} /></Layout>);
    }}
  />
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeout: 1 * 3600 * 1000,
      Layout: this.getLayout()
    }
    this.idleTimer = null
    this.onAction = this._onAction.bind(this)
    this.onActive = this._onActive.bind(this)
    this.onIdle = this._onIdle.bind(this)
  }

  // commented because it's affecting default behaviour of rate dialog
  _onAction(e) {
    // this.props.actions.setredux(false, "isTimedOut");
  }

  _onActive(e) {
    // this.props.actions.setredux(false, "isTimedOut");
  }

  _onIdle(e) {
    if (storageUtils.getAuthenticatedUser()) {
      const isTimedOut = this.props.isTimedOut
      if (isTimedOut) {
        this.props.actions.LogoutWithCognitoHandler()
      } else {
        this.idleTimer.reset();
        this.props.actions.setredux(true, "isTimedOut");
      }
    }
  }

  getLayout() {
    let layoutCls = VerticalLayout;
    switch (this.props.layout.layoutType) {
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  componentWillMount() {
    const IdleTime = storageUtils.getIdleTime()
    if (IdleTime) {
      if (parseInt(IdleTime) + this.state.timeout < Date.parse(new Date())) {
        this.props.actions.LogoutWithCognitoHandler()
      }
    }
  }

  onUnload() {
    storageUtils.setIdleTime();
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onUnload);
    storageUtils.removeIdleTime()
  }

  componentWillUnmount() {
    window.addEventListener("beforeunload", this.onUnload);
  }

  render() {
    return (
      <React.Fragment>
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={260}
          timeout={this.state.timeout}
        // crossTab={{
        //   emitOnAllTabs: true
        // }}
        />

        <Router>
          <Switch>
            {authRoutes.map((route, idx) => (
              <NonAuthmiddleware
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
              />
            ))}

            {userRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={this.state.Layout}
                component={route.component}
                key={idx}
              />
            ))}
          </Switch>
        </Router>

        {(this.props.layout.success_message || this.props.layout.error_message) && (
          <Snackbar
            message={this.props.layout.success_message || this.props.layout.error_message}
            success={this.props.layout.success_message ? true : false}
            open={true}
            handleClose={() => {
              this.props.actions.SetNull({
                type: this.props.layout.success_message ? actionTypes.SUCCESS_MESSAGE : actionTypes.ERROR_MESSAGE,
                entity: this.props.layout.success_message ? "success_message" : "error_message",
              });
            }}
          />
        )}
        <Loader />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth, layout, crud }) => {
  return { auth, layout, ...crud }
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions, authActions), dispatch),
});

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(App));
