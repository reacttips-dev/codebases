'use es6';

import { SET_AUTH } from './ActionTypes';
export function setAuth(auth) {
  return {
    type: SET_AUTH,
    auth: auth
  };
}