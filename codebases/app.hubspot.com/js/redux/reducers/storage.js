'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import { Map as ImmutableMap, OrderedSet } from 'immutable';
import PortalStorage from '../../lib/storage';
import actionTypes from '../actions/actionTypes';
import { SHOW_RECENT_STREAM_COUNT } from '../../lib/constants';
var portalStorage = PortalStorage.getInstance();
var DEFAULTS = ImmutableMap({
  recentStreamGuids: OrderedSet()
});
var currentStorageData = DEFAULTS.merge(portalStorage.get() || {});

if (currentStorageData.get('recentStreamGuids')) {
  currentStorageData = currentStorageData.set('recentStreamGuids', currentStorageData.get('recentStreamGuids').toOrderedSet());
}

export default handleActions((_handleActions = {}, _defineProperty(_handleActions, actionTypes.STORAGE_UPDATE, function (state, action) {
  state = state.merge(action.payload);
  portalStorage.set(action.payload);
  return state;
}), _defineProperty(_handleActions, actionTypes.SET_ROUTE, function (state, action) {
  if (action.payload.params.streamGuid) {
    var recentStreamGuids = state.get('recentStreamGuids').toList(); // avoid swapping order of items already in the set

    if (!recentStreamGuids.includes(action.payload.params.streamGuid)) {
      recentStreamGuids = recentStreamGuids.unshift(action.payload.params.streamGuid).slice(0, SHOW_RECENT_STREAM_COUNT).toOrderedSet();
      state = state.set('recentStreamGuids', recentStreamGuids);
      portalStorage.set({
        recentStreamGuids: recentStreamGuids
      });
    }
  }

  return state;
}), _defineProperty(_handleActions, actionTypes.INBOX_UPDATE, function (state, action) {
  if (action.payload.interactingAs) {
    state = state.set('interactingAs', action.payload.interactingAs);
    portalStorage.set({
      interactingAs: action.payload.interactingAs
    });
  }

  return state;
}), _handleActions), currentStorageData);