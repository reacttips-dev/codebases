'use es6';

export function simpleAction(type, payload) {
  return {
    type: type,
    payload: payload
  };
}