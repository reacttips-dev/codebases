'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { TRACK_EVENT } from '../Constants';
import { TRACK_INTERACTION } from './ActionTypes';
import { getUsageTrackerJsEventName } from '../utils/tracking';
export function getTrackingMeta(name, action, meta) {
  return _defineProperty({}, TRACK_EVENT, {
    name: name,
    eventKey: getUsageTrackerJsEventName(name),
    action: action,
    meta: meta
  });
}
export function trackInteraction(name, action) {
  var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return {
    type: TRACK_INTERACTION,
    meta: getTrackingMeta(name, action, meta)
  };
}
var trackedActionsByEvent = {};
export var trackOnce = function trackOnce(eventKey, action) {
  var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch) {
    if (trackedActionsByEvent[eventKey] && trackedActionsByEvent[eventKey].includes(action)) {
      return;
    }

    if (!trackedActionsByEvent[eventKey]) {
      trackedActionsByEvent[eventKey] = [];
    }

    trackedActionsByEvent[eventKey].push(action);
    dispatch(trackInteraction(eventKey, action, meta));
  };
};