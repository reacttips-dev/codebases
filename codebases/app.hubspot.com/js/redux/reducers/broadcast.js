'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Object$assign;

import { handleActions } from 'flux-actions';
import { List, Map as ImmutableMap } from 'immutable';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import { coreBroadcastExtra } from './broadcastCore';
import actionTypes from '../actions/actionTypes'; // several actions/requests make up the complete fetching of a Broadcast for details page
// this is why we handle the case of interactions, social feed users, or assists coming in first or after the main
// broadcast details request.  We also store the broadcast itself so we don't loose track of it updating the page of broadcasts.

export default handleActions(Object.assign({}, coreBroadcastExtra, (_Object$assign = {}, _defineProperty(_Object$assign, ActionMapper.success(actionTypes.BROADCAST_FEED_FETCH), function (state, action) {
  return state.mergeIn([action.payload.broadcastGuid], action.data);
}), _defineProperty(_Object$assign, ActionMapper.success(actionTypes.BROADCAST_CORE_FEED_FETCH), function (state, action) {
  var existingInteractions = state.get(action.payload.broadcastGuid).get('interactions', List());
  var existingForeignids = existingInteractions.map(function (i) {
    return i.foreignId;
  });

  if (!action.data) {
    return state;
  }

  action.data.interactions = existingInteractions.concat(action.data.interactions.filter(function (i) {
    return !existingForeignids.contains(i.foreignId);
  }));
  return state.mergeIn([action.payload.broadcastGuid], action.data);
}), _Object$assign)), ImmutableMap());