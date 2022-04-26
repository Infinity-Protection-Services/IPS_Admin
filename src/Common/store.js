import { combineReducers, createStore, applyMiddleware } from "redux";

import crud from "../Store/Reducers/crudReducer";
import layout from "../Store/Reducers/layoutReducer";
import auth from "../Store/Reducers/authReducer";

import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const rootreducer = combineReducers({
  crud,
  layout,
  auth,
});

const store = createStore(rootreducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
