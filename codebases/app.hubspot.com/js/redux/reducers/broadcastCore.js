'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions, _coreBroadcastExtra;

import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
import { Map as ImmutableMap, List } from 'immutable';
import { handleActions } from 'flux-actions';
import { BROADCAST_MEDIA_TYPE, CHANNEL_TYPES } from '../../lib/constants';
export var broadcastCores = handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_CORE_FETCH), function (state, action) {
  return state.set(action.data.broadcastGuid, action.data);
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_CORE_PATCH), function (state, action) {
  return state.set(action.data.broadcastGuid, action.data);
}), _defineProperty(_handleActions, actionTypes.BROADCAST_CORE_UPDATE, function (state, action) {
  if (!state.has(action.payload.id)) {
    return state;
  }

  return state.mergeIn([action.payload.id], action.payload.attrs);
}), _handleActions), ImmutableMap());
export var coreBroadcastExtra = (_coreBroadcastExtra = {}, _defineProperty(_coreBroadcastExtra, ActionMapper.success(actionTypes.BROADCAST_INTERACTIONS_FETCH), function (state, action) {
  return state.mergeIn([action.payload.broadcastGuid], action.data);
}), _defineProperty(_coreBroadcastExtra, ActionMapper.success(actionTypes.FILE_MANAGER_FILE_FETCH), function (state, action) {
  if (action.payload.broadcastGuid) {
    // FM API can 204 for not found, so don't assume action.data
    return state.setIn([action.payload.broadcastGuid, 'file'], action.data);
  }

  return state;
}), _defineProperty(_coreBroadcastExtra, ActionMapper.success(actionTypes.BROADCAST_VIDEO_INSIGHTS_FETCH), function (state, action) {
  return state.setIn([action.payload.broadcastGuid, 'videoInsights'], action.data);
}), _defineProperty(_coreBroadcastExtra, ActionMapper.success(actionTypes.BROADCAST_CLICKS_REPORT_FETCH), function (state, action) {
  return state.mergeIn([action.payload.broadcastGuid, 'reports'], action.data.get('totals'));
}), _defineProperty(_coreBroadcastExtra, ActionMapper.success(actionTypes.BROADCAST_SESSION_REPORT_FETCH), function (state, action) {
  return state.mergeIn([action.payload.broadcastGuid, 'reports'], action.data.get('totals'));
}), _defineProperty(_coreBroadcastExtra, ActionMapper.success(actionTypes.BROADCAST_SOCIAL_ASSISTS_FETCH), function (state, action) {
  return state.setIn([action.payload.broadcastGuid, 'assists'], action.data);
}), _defineProperty(_coreBroadcastExtra, actionTypes.REPORTING_POSTS_FETCH_SUCCESS, function (state, action) {
  // lb todo - think we can remove this after deciding that singular Post fetch is enough, this was for the FB video edge case
  action.data.results.filter(function (post) {
    return Boolean(post.broadcastGuid);
  }).forEach(function (post) {
    var key = 'reportingPost';

    if (post.channelSlug === CHANNEL_TYPES.facebookpage && post.mediaType === BROADCAST_MEDIA_TYPE.VIDEO_MEDIA) {
      key = 'reportingPostVideo';
    }

    state = state.setIn([post.broadcastGuid, key], post);
  });
  return state;
}), _defineProperty(_coreBroadcastExtra, actionTypes.REPORTING_POST_FETCH_SUCCESS, function (state, action) {
  if (action.data && action.data.broadcastGuid) {
    state = state.setIn([action.data.broadcastGuid, 'reportingPost'], action.data);
  }

  return state;
}), _defineProperty(_coreBroadcastExtra, ActionMapper.success(actionTypes.BROADCAST_BOOSTED_POSTS_FETCH), function (state, action) {
  return state.setIn([action.payload.broadcastGuid, 'boostedPosts'], List(action.data));
}), _defineProperty(_coreBroadcastExtra, ActionMapper.success(actionTypes.BROADCAST_AD_CAMPAIGNS_FETCH), function (state, action) {
  return state.setIn([action.payload.broadcastGuid, 'adCampaigns'], List(action.data));
}), _coreBroadcastExtra);
export var broadcastExtra = handleActions(coreBroadcastExtra, ImmutableMap());