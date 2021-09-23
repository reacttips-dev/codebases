'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { TRACK_EVENT } from './constants';
import getTrackPayload from './getTrackPayload';

function createAction(payload) {
  return {
    type: TRACK_EVENT,
    meta: _defineProperty({}, TRACK_EVENT, payload)
  };
}

export function track(eventKey, eventProperties) {
  return createAction(getTrackPayload(eventKey, eventProperties));
}