'use es6';

import * as ActionTypes from 'crm_data/actions/ActionTypes';
import { dispatch } from 'crm_data/flux/dispatch';
export var authLoaded = function authLoaded(auth) {
  return dispatch(ActionTypes.AUTH_LOADED, auth);
};