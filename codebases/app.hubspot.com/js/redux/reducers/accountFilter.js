'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { handleActions } from 'flux-actions';
import ActionTypes from '../actions/actionTypes';
var defaultState = '';
export default handleActions(_defineProperty({}, ActionTypes.ACCOUNT_FILTER_UPDATE, function (state, action) {
  return action.payload.accountSlug;
}), defaultState);