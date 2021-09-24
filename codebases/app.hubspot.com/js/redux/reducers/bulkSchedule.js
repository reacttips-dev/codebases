'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import { Map as ImmutableMap } from 'immutable';
import actionTypes from '../actions/actionTypes';
import ActionMapper from '../../lib/legacyRequestActionMapper';
var DEFAULTS = {
  error: undefined,
  loading: false,
  uploadCount: undefined
};
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.began(actionTypes.BULK_SCHEDULE_UPLOAD), function (state) {
  return state.merge({
    loading: true,
    uploadCount: undefined,
    error: undefined
  });
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BULK_SCHEDULE_UPLOAD), function (state, action) {
  return state.merge({
    error: undefined,
    uploadCount: action.data.uploadCount,
    loading: false
  });
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.BULK_SCHEDULE_UPLOAD), function (state, action) {
  return state.merge({
    error: action.error,
    uploadCount: undefined,
    loading: false
  });
}), _defineProperty(_handleActions, actionTypes.BULK_SCHEDULE_UPLOAD_DONE, function (state) {
  return state.merge({
    error: undefined,
    uploadCount: undefined,
    loading: false
  });
}), _handleActions), new ImmutableMap(DEFAULTS));