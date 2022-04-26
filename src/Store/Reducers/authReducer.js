import { SUCCESS_LOGIN } from "../../Common/actionTypes";

const login = (state = {}, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case SUCCESS_LOGIN:
      newState[action.entity] = action.payload;
      return newState;
    default:
      return newState
  }
};

export default login;
