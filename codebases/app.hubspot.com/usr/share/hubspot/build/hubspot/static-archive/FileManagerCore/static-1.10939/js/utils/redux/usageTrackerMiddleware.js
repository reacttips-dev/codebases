'use es6';

import Raven from 'Raven';
import enviro from 'enviro';
import { TRACK_EVENT } from '../../Constants';
import { isCurrentUsageTracker } from '../tracking';
var FILE_MANAGER_LIB_EVENT_KEY_TO_VERIFY = 'fileManagerExploreFiles';
var isDeployed = enviro.deployed('file_manager_lib');

var warnIfLocal = function warnIfLocal(message) {
  if (!isDeployed) {
    console.warn(message);
  }
};

export default function usageTrackerMiddleware(usageTracker) {
  var getEventPayload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (eventAction) {
    var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return Object.assign({}, extra, {
      action: eventAction
    });
  };
  var canTrack = false;

  if (!usageTracker || !isCurrentUsageTracker(usageTracker)) {
    warnIfLocal('FileManagerLib should must be passed a usage-tracker-js tracker as `usageTracker` prop.');
  } else if (!usageTracker.config.events[FILE_MANAGER_LIB_EVENT_KEY_TO_VERIFY]) {
    warnIfLocal('Please import `FileManagerLib` into the event dictionary of usageTracker passed to configureFileManager');
  } else {
    canTrack = true;
  }

  return function () {
    return function (next) {
      return function (action) {
        if (!canTrack || !action.meta || !action.meta[TRACK_EVENT]) {
          return next(action);
        }

        var _action$meta$TRACK_EV = action.meta[TRACK_EVENT],
            eventKey = _action$meta$TRACK_EV.eventKey,
            eventAction = _action$meta$TRACK_EV.action,
            meta = _action$meta$TRACK_EV.meta;
        Raven.captureBreadcrumb({
          type: 'message',
          message: "[usage tracker] " + eventKey + " " + eventAction
        });
        var eventPayload = getEventPayload(eventAction, meta);
        usageTracker.track(eventKey, eventPayload);
        return next(action);
      };
    };
  };
}