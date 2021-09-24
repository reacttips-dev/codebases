'use es6';

export default function createAction(type, payload) {
  var action = {
    type: type,
    payload: payload
  };
  return action;
}