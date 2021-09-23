'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap } from 'immutable';
import { handleActions } from 'flux-actions';
import { ADD_AVAILABILITY_MESSAGE_TIMEOUT } from '../constants/actionTypes';
var initialState = ImmutableMap();
export default handleActions(_defineProperty({}, ADD_AVAILABILITY_MESSAGE_TIMEOUT, function (state, action) {
  var _action$payload = action.payload,
      channel = _action$payload.channel,
      timeout = _action$payload.timeout;
  return state.set(channel, timeout);
}), initialState);