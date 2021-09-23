'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { handleActions } from 'flux-actions';
import { UPDATE_SHOW_EXIT_INTENT_COOKIE_BANNER } from '../constants/ActionTypes';
var initialState = false;
export default handleActions(_defineProperty({}, UPDATE_SHOW_EXIT_INTENT_COOKIE_BANNER, function (state, action) {
  var visible = action.payload.visible;
  return visible;
}), initialState);