'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import { Set as ImmutableSet } from 'immutable';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
import Relationships from '../../data/model/Relationships';
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.success(actionTypes.RELATIONSHIPS_FETCH), function (state, action) {
  if (!state) {
    return action.data;
  }

  return state.merge({
    following: state.following.concat(action.data.following),
    follower: state.follower.concat(action.data.follower)
  });
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.FOLLOW), function (state, action) {
  if (!state) {
    return undefined;
  }

  var userFollowing = state.following.get(action.data.remoteUserIdOfActor) || ImmutableSet();
  userFollowing = userFollowing.add(action.data.remoteUserIdOfActedUpon);
  return state.set('following', state.following.set(action.data.remoteUserIdOfActor, userFollowing));
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.UNFOLLOW), function (state, action) {
  if (!state) {
    return undefined;
  }

  var userFollowing = state.following.get(action.data.remoteUserIdOfActor) || ImmutableSet();
  userFollowing = userFollowing.delete(action.data.remoteUserIdOfActedUpon);
  return state.set('following', state.following.set(action.data.remoteUserIdOfActor, userFollowing));
}), _handleActions), new Relationships());