'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { Map as ImmutableMap, fromJS } from 'immutable';
import { handleActions } from 'flux-actions';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
import BroadcastCounts from '../../data/model/BroadcastCounts';
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_COUNT_FETCH), function (state, action) {
  var counts = action.data.counts ? action.data.counts : action.data;
  var countEntries = ImmutableMap(counts).map(function (v, k) {
    return [k.toLowerCase(), v];
  }).toArray();
  return state.set('byStatus', ImmutableMap(countEntries));
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_CHANNEL_COUNT_FETCH), function (state, action) {
  return state.setByChannel(action.data.current, action.data.previous);
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_LIKE_COUNT_FETCH), function (state, action) {
  return state.setLikesByChannel(action.data.current, action.data.previous).set('likesSeries', fromJS([action.data.currentSeries, action.data.previousSeries]));
}), _handleActions), new BroadcastCounts());