import { EVENTS } from '../constants/TrackingConstants';
import { UsageTracker, ExternalLinkUsageTracker } from './usageTracker';
var DONE_STEP = 'done';
var currentStepId;
var currentTourId; // Fires when a tour step changes

var stepChanged = function stepChanged(stepId, tourId) {
  if (stepId === DONE_STEP) {
    // Track the last step the user finished the tour on
    ExternalLinkUsageTracker.track(EVENTS.TOUR_FINISH, {
      stepId: currentStepId,
      tourId: tourId
    });
  } else if (stepId === null && tourId === null) {
    UsageTracker.track(EVENTS.TOUR_CLOSE, {
      stepId: currentStepId,
      tourId: currentTourId
    });
  } else {
    currentStepId = stepId;
    currentTourId = tourId;
  }
};

export var handleCompletionTracking = function handleCompletionTracking(tour) {
  tour.subscribe(stepChanged);
};
export var externalLinkClicked = function externalLinkClicked(stepId, tourId) {
  ExternalLinkUsageTracker.track(EVENTS.TOUR_CLICK_EXTERNAL_STEP_LINK, {
    stepId: stepId,
    tourId: tourId
  });
};