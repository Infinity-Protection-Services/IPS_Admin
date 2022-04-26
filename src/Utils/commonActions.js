import * as actionTypes from "../Common/actionTypes";

export function SetData(value) {
  const type = value.type ? value.type : actionTypes.FETCH;
  return {
    type: type,
    entity: value.entity,
    payload: value.payload,
  };
}

export function SetLoader(value) {
  return { type: actionTypes.LOADER, payload: value };
}

export function SetNull(entity) {
  return async function (dispatch) {
    return dispatch(SetData(entity));
  };
}

export function setredux(value, entity, type = actionTypes.FETCH) {
  return {
    type: type,
    payload: value,
    entity: entity,
  };
}
