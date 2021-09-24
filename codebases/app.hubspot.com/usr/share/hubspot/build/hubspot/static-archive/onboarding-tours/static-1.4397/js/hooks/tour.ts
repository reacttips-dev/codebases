import { useContext } from 'react';
import TourContext from 'ui-shepherd-react/contexts/TourContext';
export var useTourContext = function useTourContext() {
  return useContext(TourContext);
};
export var useIsLastStep = function useIsLastStep() {
  var _useTourContext = useTourContext(),
      tour = _useTourContext.tour;

  var _tour$getConfig = tour.getConfig(),
      steps = _tour$getConfig.steps;

  return steps.indexOf(tour.getStep()) === steps.length - 1;
};