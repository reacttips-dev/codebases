import { DONE, NOT_STARTED } from '../constants/TourStates';
export default (function (tour) {
  var step = tour.getStep();
  var tourSteps = tour.getConfig().steps;

  if (step === NOT_STARTED) {
    return tourSteps[0];
  }

  var nextIndex = tourSteps.indexOf(step) + 1;
  return nextIndex >= tourSteps.length ? DONE : tourSteps[nextIndex];
});