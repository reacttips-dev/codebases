'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import UserAttributes from '../../data/model/UserAttributes';
import actionTypes from '../actions/actionTypes';
import { USER_ATTR_FAVORITE_CHANNEL_KEYS, getNetworkFromChannelKey } from '../../lib/constants';
export var userAttributes = handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.success(actionTypes.USER_ATTRIBUTES_FETCH), function (state, action) {
  return action.data;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.USER_ATTRIBUTE_SAVE), function (state, action) {
  return state.merge(action.data);
}), _defineProperty(_handleActions, actionTypes.USER_ATTR_FAV_CHANNEL_REPLACE_FOR_NETWORK, function (state, action) {
  var _action$payload = action.payload,
      network = _action$payload.network,
      keys = _action$payload.keys;
  var currentChannelKeys = JSON.parse(state[USER_ATTR_FAVORITE_CHANNEL_KEYS]).filter(function (k) {
    return getNetworkFromChannelKey(k) !== network;
  }).concat(keys);
  return state.setIn([USER_ATTR_FAVORITE_CHANNEL_KEYS], JSON.stringify(currentChannelKeys));
}), _handleActions), new UserAttributes());