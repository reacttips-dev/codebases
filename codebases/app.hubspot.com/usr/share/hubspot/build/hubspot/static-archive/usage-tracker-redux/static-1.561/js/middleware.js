'use es6';

import { TRACK_EVENT } from './constants';

function getTrackHandler(Tracker) {
  return function (_ref) {
    var eventKey = _ref.eventKey,
        eventProperties = _ref.eventProperties;
    Tracker.track(eventKey, eventProperties);
  };
}

export default (function (Tracker) {
  var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var track = getTrackHandler(Tracker);
  return function (store) {
    return function (next) {
      return function (action) {
        var prevState = store.getState();
        var result = next(action);
        var explicitEventSpec = action.meta && action.meta[TRACK_EVENT];
        var handler = handlers[action.type];

        if (explicitEventSpec) {
          track(explicitEventSpec);
        } else if (typeof handler === 'function') {
          handler(action, store.getState(), store.dispatch, prevState);
        } else if (typeof handler === 'object') {
          track(handler);
        }

        return result;
      };
    };
  };
});