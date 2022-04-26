import * as actionTypes from "../../Common/actionTypes";

const initialstate = {
  showAddPage: false,
  showEditPage: false,
  showViewPage: false,
  isTimedOut: false
};

const reducer = (state = initialstate, action) => {
  let newState = {};
  switch (action.type) {
    case actionTypes.FETCH:
      newState = Object.assign({}, state);
      if (action.entity === "GetOrderList") {
        newState["GetOrderList"] = action.payload ? (action.payload.data)?.length >= 0 ? action.payload.data : action.payload : null;
      }
      else {
        newState[action.entity] = action.payload;
      }
      return newState;
    default:
      return state;
  }
};

export default reducer;
