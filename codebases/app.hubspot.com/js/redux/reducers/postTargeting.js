'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import { Map as ImmutableMap } from 'immutable';
import actionTypes from '../actions/actionTypes';
var DEFAULTS = ImmutableMap({
  locations: ImmutableMap(),
  languages: ImmutableMap()
});
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, actionTypes.TARGET_LOCATIONS_UPDATE, function (state, action) {
  return state.setIn(['locations', action.payload.network], action.payload.data.map(function (d) {
    return {
      value: d.targetCode,
      text: d.targetLabel
    };
  }));
}), _defineProperty(_handleActions, actionTypes.TARGET_LANGUAGES_UPDATE, function (state, action) {
  return state.setIn(['languages', action.payload.network], action.payload.data.map(function (d) {
    return {
      value: d.targetCode,
      text: d.targetLabel
    };
  }));
}), _handleActions), DEFAULTS);