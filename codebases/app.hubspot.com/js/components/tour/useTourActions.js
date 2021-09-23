'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SHEPHERD_TOURS, SHEPHERD_TOURS_STEPS, SHEPHERD_TOURS_USER_ATTRIBUTES } from '../../lib/constants';
import { getComposerShepherdSeen, getDetailsPanelTourStepsSeen, getManageDashboardStepsSeen, getPublishingTableStepsSeen, getReportsTourStepsSeen } from '../../redux/selectors/users';
import { useSingleStepContext, useTourContext } from './TourContextWrapper';
import { dismissTourStep, dismissTour, saveUserAttribute } from '../../redux/actions/users';
export var checkIfLastStep = function checkIfLastStep(currentTour, stepKey) {
  if (!currentTour) return false;
  var tourSteps = SHEPHERD_TOURS_STEPS[currentTour].toArray();
  var stepIndex = tourSteps.findIndex(function (item) {
    return item === stepKey;
  });
  return stepIndex === tourSteps.length - 1;
};
export var useTourActions = function useTourActions() {
  var _useTourContext = useTourContext(),
      tourContext = _useTourContext.tour;

  var _useSingleStepContext = useSingleStepContext(),
      isSingleStep = _useSingleStepContext.isSingleStep,
      setIsSingleStep = _useSingleStepContext.setIsSingleStep;

  var currentTour = tourContext ? tourContext.getTour() : null;
  var tourStep = tourContext ? tourContext.getStep() : null;
  var dispatch = useDispatch();
  var manageDashboardStepsSeen = useSelector(getManageDashboardStepsSeen);
  var composerStepsSeen = useSelector(getComposerShepherdSeen);
  var publishingTableStepsSeen = useSelector(getPublishingTableStepsSeen);
  var detailsPanelTourStepsSeen = useSelector(getDetailsPanelTourStepsSeen);
  var reportsTourStepsSeen = useSelector(getReportsTourStepsSeen);
  var stepsSeenMap = useMemo(function () {
    var _ref;

    return _ref = {}, _defineProperty(_ref, SHEPHERD_TOURS.manageDashboard, manageDashboardStepsSeen), _defineProperty(_ref, SHEPHERD_TOURS.composer, composerStepsSeen), _defineProperty(_ref, SHEPHERD_TOURS.publishingTable, publishingTableStepsSeen), _defineProperty(_ref, SHEPHERD_TOURS.detailsPanel, detailsPanelTourStepsSeen), _defineProperty(_ref, SHEPHERD_TOURS.reportsNextOverview, reportsTourStepsSeen), _ref;
  }, [manageDashboardStepsSeen, composerStepsSeen, publishingTableStepsSeen, detailsPanelTourStepsSeen, reportsTourStepsSeen]);

  var getStepsRemaining = function getStepsRemaining(stepsSeen, tourKey) {
    return SHEPHERD_TOURS_STEPS[tourKey].filter(function (step) {
      return !stepsSeen[step];
    }).toArray();
  };

  var startTour = useCallback(function (tourKey) {
    if (!tourContext) return;
    if (currentTour === tourKey) return;
    var seenSteps = stepsSeenMap[tourKey];
    if (tourKey === SHEPHERD_TOURS.composer && seenSteps === true) return;
    if (seenSteps.tourSkipped) return;
    var remainingSteps = getStepsRemaining(seenSteps, tourKey);
    if (remainingSteps.length <= 0) return;
    var nextStep = remainingSteps[0];
    tourContext.start(tourKey);
    tourContext.next(nextStep, tourKey);
    setIsSingleStep(false);
  }, [stepsSeenMap, tourContext, currentTour, setIsSingleStep]);
  var startSingleStep = useCallback(function (tourKey, stepKey) {
    setIsSingleStep(true);
    tourContext.start(tourKey);
    tourContext.next(stepKey, tourKey);
  }, [setIsSingleStep, tourContext]);

  var isLastStep = function isLastStep(stepKey) {
    return checkIfLastStep(currentTour, stepKey);
  };

  var markComposerTourComplete = useCallback(function () {
    dispatch(saveUserAttribute({
      key: SHEPHERD_TOURS_USER_ATTRIBUTES.composer,
      value: 'true'
    }));
  }, [dispatch]);
  var endTour = useCallback(function () {
    tourContext.finish();

    if (currentTour !== SHEPHERD_TOURS.composer) {
      dispatch(dismissTour(currentTour));
    } else {
      // composer tour is different from others in that it only stores a boolean. TODO: refactor it later.
      markComposerTourComplete();
    }
  }, [tourContext, dispatch, markComposerTourComplete, currentTour]);
  var nextStep = useCallback(function (stepId) {
    if (currentTour === SHEPHERD_TOURS.composer) {
      tourContext.next();
      return;
    }

    dispatch(dismissTourStep(currentTour, stepId, function () {
      tourContext.next();
    }));
  }, [tourContext, dispatch, currentTour]);
  return {
    startTour: startTour,
    nextStep: nextStep,
    endTour: endTour,
    isLastStep: isLastStep,
    tourKey: currentTour,
    startSingleStep: startSingleStep,
    isSingleStep: isSingleStep,
    tourStep: tourStep
  };
};