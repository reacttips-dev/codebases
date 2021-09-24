'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { handleActions } from 'flux-actions';
import { UPDATE_VIEW } from '../constants/actionTypes';
var initialState = null;
var currentView = handleActions(_defineProperty({}, UPDATE_VIEW, function (state, action) {
  var view = action.payload.view;
  return view;
}), initialState);
export default currentView;