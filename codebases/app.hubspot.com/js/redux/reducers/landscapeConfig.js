'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
import LandscapeConfig from '../../data/model/LandscapeConfig';
import { LANDSCAPE_SETTING } from '../../lib/constants';
import { parse } from 'hub-http/helpers/params';
var getParamsFromQuery = parse(window.location.search.substring(1));
var pathname = window.location.pathname.split('/').reverse();
var companyId = ['companies', 'competitors'].includes(pathname[1]) ? parseInt(pathname[0], 10) : null;
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.success(actionTypes.HUB_SETTINGS_FETCH), function (state, action) {
  var landscapeSetting = action.data.get(LANDSCAPE_SETTING);
  var id = landscapeSetting && landscapeSetting.get('id');
  var companies = landscapeSetting && landscapeSetting.get('companies');

  if (state) {
    return state.set('id', id).set('companies', companies);
  }

  return new LandscapeConfig().set('id', id).set('companies', companies);
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.HUB_SETTINGS_SAVE), function (state, action) {
  if (action.key === LANDSCAPE_SETTING) {
    var landscapeSetting = action.value;
    var id = landscapeSetting && landscapeSetting.get('id');
    var companies = landscapeSetting && landscapeSetting.get('companies');
    return state.set('id', id).set('companies', companies);
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.began(actionTypes.LANDSCAPE_FOLLOW_COMPANY), function (state) {
  return state.set('loading', true);
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.LANDSCAPE_FOLLOW_COMPANY), function (state) {
  return state.set('loading', false);
}), _defineProperty(_handleActions, ActionMapper.began(actionTypes.LANDSCAPE_CREATE), function (state) {
  return state.set('loading', true);
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.LANDSCAPE_CREATE), function (state) {
  return state.set('loading', false);
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.LANDSCAPE_FETCH_SOCIAL_POSTS), function (state) {
  return state.set('loading', false);
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.LANDSCAPE_FETCH_SOCIAL_POSTS), function (state) {
  return state.set('loading', false);
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.LANDSCAPE_FETCH_PENDING_OPERATION_STATUS), function (state) {
  return state.set('loading', false);
}), _defineProperty(_handleActions, actionTypes.LANDSCAPE_CONFIG_UPDATE, function (state, action) {
  return state.merge(action.payload);
}), _handleActions), LandscapeConfig.createFromQueryParams(Object.assign({}, getParamsFromQuery)).set('companyId', companyId));