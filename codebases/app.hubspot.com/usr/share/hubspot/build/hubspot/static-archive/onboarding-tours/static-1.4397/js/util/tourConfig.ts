import { EVENTS } from '../constants/TrackingConstants';
import { debug } from './debugUtil';
import { UsageTracker } from './usageTracker';
import bindArg from './bindArg';
import { markTaskComplete as _markTaskComplete } from './taskUtil';
export var buildTourConfig = function buildTourConfig(tourId, tourData, prevTourId) {
  var beforeEnter = tourData.beforeEnter,
      beforeExit = tourData.beforeExit,
      _beforeStart = tourData.beforeStart,
      beforeFinish = tourData.beforeFinish,
      completeActionKey = tourData.completeActionKey,
      escapeHatches = tourData.escapeHatches,
      nextTourAlias = tourData.nextTourAlias;
  return {
    steps: tourData.steps.map(function (step) {
      return step.id;
    }),
    nextTourAlias: nextTourAlias,
    escapeHatches: escapeHatches || [],
    beforeEnter: bindArg(beforeEnter, tourData),
    beforeExit: bindArg(beforeExit, tourData),
    beforeFinish: bindArg(beforeFinish, tourData),
    beforeStart: function beforeStart() {
      UsageTracker.track(EVENTS.TOUR_START, {
        tourId: tourId,
        prevTourId: prevTourId
      });

      if (_beforeStart) {
        _beforeStart(tourData);
      }
    },
    markTaskComplete: function markTaskComplete(options) {
      if (completeActionKey) {
        debug("Marking task with actionName " + completeActionKey + " as complete");

        _markTaskComplete(completeActionKey, options);
      } else {
        debug("No taskCompleteActionKey for tour with id " + tourId);
      }
    }
  };
};