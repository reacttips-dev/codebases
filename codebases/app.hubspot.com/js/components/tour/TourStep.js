'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _TOUR_LNG_PATH_MAP;

import PropTypes from 'prop-types';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useCallback, useEffect, useRef } from 'react';
import { SHEPHERD_TOURS } from '../../lib/constants';
import UITourStep from 'ui-shepherd-react/tour/UITourStep';
import UIButton from 'UIComponents/button/UIButton';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import { useTourActions } from './useTourActions';
import { elementTopAndBottomIsInViewport } from '../../lib/utils';
var TOUR_LNG_PATH_MAP = (_TOUR_LNG_PATH_MAP = {}, _defineProperty(_TOUR_LNG_PATH_MAP, SHEPHERD_TOURS.manageDashboard, 'sui.manageDashboardWelcome'), _defineProperty(_TOUR_LNG_PATH_MAP, SHEPHERD_TOURS.composer, 'sui.composer.shepherd'), _defineProperty(_TOUR_LNG_PATH_MAP, SHEPHERD_TOURS.publishingTable, 'sui.publishingWelcome'), _defineProperty(_TOUR_LNG_PATH_MAP, SHEPHERD_TOURS.detailsPanel, 'sui.broadcastDetails.shepherdTour'), _defineProperty(_TOUR_LNG_PATH_MAP, SHEPHERD_TOURS.reportsNextOverview, 'srui.chart'), _defineProperty(_TOUR_LNG_PATH_MAP, SHEPHERD_TOURS.reportsSaveButton, 'srui.chart'), _TOUR_LNG_PATH_MAP);

function TourStep(_ref) {
  var stepKey = _ref.stepKey,
      tourKey = _ref.tourKey,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? null : _ref$children,
      _ref$attachTo = _ref.attachTo,
      attachTo = _ref$attachTo === void 0 ? null : _ref$attachTo,
      _ref$forceHide = _ref.forceHide,
      forceHide = _ref$forceHide === void 0 ? false : _ref$forceHide,
      _ref$showSteps = _ref.showSteps,
      showSteps = _ref$showSteps === void 0 ? true : _ref$showSteps,
      _ref$contentComponent = _ref.contentComponent,
      contentComponent = _ref$contentComponent === void 0 ? null : _ref$contentComponent,
      _ref$nextActionText = _ref.nextActionText,
      nextActionText = _ref$nextActionText === void 0 ? null : _ref$nextActionText,
      _ref$finishActionText = _ref.finishActionText,
      finishActionText = _ref$finishActionText === void 0 ? null : _ref$finishActionText,
      _ref$hideSkipTour = _ref.hideSkipTour,
      hideSkipTour = _ref$hideSkipTour === void 0 ? false : _ref$hideSkipTour,
      placement = _ref.placement,
      _ref$onEndTour = _ref.onEndTour,
      onEndTour = _ref$onEndTour === void 0 ? null : _ref$onEndTour,
      _ref$bodyText = _ref.bodyText,
      bodyText = _ref$bodyText === void 0 ? null : _ref$bodyText;
  var rootRef = useRef();
  var tourPath = TOUR_LNG_PATH_MAP[tourKey];

  var _useTourActions = useTourActions(),
      nextStep = _useTourActions.nextStep,
      endTour = _useTourActions.endTour,
      isLastStep = _useTourActions.isLastStep,
      tourStep = _useTourActions.tourStep,
      isSingleStep = _useTourActions.isSingleStep;

  useEffect(function () {
    if (!rootRef.current) return;

    if (!forceHide && !elementTopAndBottomIsInViewport(rootRef.current) && tourStep === stepKey) {
      rootRef.current.scrollIntoView();
    }
  }, [rootRef, forceHide, tourStep, stepKey]);
  var isLast = isLastStep(stepKey);
  var handleNextStepClick = useCallback(function () {
    if (isLast) {
      endTour();

      if (onEndTour) {
        onEndTour();
      }
    } else {
      nextStep(stepKey);
    }
  }, [nextStep, stepKey, isLast, endTour, onEndTour]);
  var handleSkipClick = useCallback(function () {
    endTour();

    if (onEndTour) {
      onEndTour();
    }
  }, [onEndTour, endTour]);
  if (!tourPath || forceHide) return children;

  var body = bodyText || /*#__PURE__*/_jsx(FormattedMessage, {
    message: tourPath + "." + stepKey + ".content"
  });

  var header = /*#__PURE__*/_jsx(FormattedMessage, {
    message: tourPath + "." + stepKey + ".heading"
  });

  var nextButtonText = nextActionText || I18n.text('sui.shepherdPopovers.nextTip');
  var finishButtonText = finishActionText || I18n.text('sui.shepherdPopovers.endTour');
  return /*#__PURE__*/_jsx("span", {
    ref: rootRef,
    children: /*#__PURE__*/_jsx(UITourStep, {
      placement: placement,
      showSteps: !isSingleStep && showSteps,
      showCloseButton: isSingleStep,
      attachTo: attachTo,
      tourKey: tourKey,
      stepKey: stepKey,
      content: contentComponent || {
        header: header,
        body: body,
        footer: isSingleStep ? null : /*#__PURE__*/_jsxs(UIButtonWrapper, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            size: "small",
            use: "primary",
            onClick: handleNextStepClick,
            children: isLast ? finishButtonText : nextButtonText
          }), !hideSkipTour && !isLast && /*#__PURE__*/_jsx(UIButton, {
            size: "small",
            "data-test-purpose": "skip-tour",
            onClick: handleSkipClick,
            children: I18n.text('sui.shepherdPopovers.skipTour')
          })]
        })
      },
      children: children
    })
  });
}

TourStep.propTypes = {
  attachTo: PropTypes.string,
  children: PropTypes.any,
  contentComponent: PropTypes.any,
  finishActionText: PropTypes.string,
  forceHide: PropTypes.bool,
  hideSkipTour: PropTypes.bool,
  nextActionText: PropTypes.string,
  placement: PropTypes.string,
  showSteps: PropTypes.bool,
  stepKey: PropTypes.string,
  tourKey: PropTypes.string,
  onEndTour: PropTypes.func,
  bodyText: PropTypes.any
};
export default TourStep;