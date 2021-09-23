import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import emptyFunction from 'react-utils/emptyFunction';
import UIButton from 'UIComponents/button/UIButton';
import TourContext from '../contexts/TourContext';
import getNextStep from '../lib/getNextStep';
import { DONE } from '../constants/TourStates';
import handleCallback from '../lib/handleCallback';

var renderDefaultText = function renderDefaultText(tour) {
  if (getNextStep(tour) === DONE) {
    return I18n.text('shepherd-react.finish');
  }

  return I18n.text('shepherd-react.next');
};

var isTourStepMatched = function isTourStepMatched(tourContext, stepKey) {
  // If stepKey is empty, consider as matched
  if (!stepKey) {
    return true;
  }

  var currentStepKey = tourContext.getStep();
  return currentStepKey === stepKey;
};

var UITourNextButton = function UITourNextButton(props) {
  var _useContext = useContext(TourContext),
      tour = _useContext.tour;

  var beforeNext = props.beforeNext,
      tourKey = props.tourKey,
      stepKey = props.stepKey,
      _props$children = props.children,
      children = _props$children === void 0 ? renderDefaultText(tour) : _props$children,
      useInStepKey = props.useInStepKey,
      buttonProps = _objectWithoutProperties(props, ["beforeNext", "tourKey", "stepKey", "children", "useInStepKey"]);

  var getTour = tour.getTour,
      getStep = tour.getStep;
  var isHandlingClick = useRef(false);

  var handleClick = function handleClick() {
    // Skip click handler if:
    //   1. tour handler is executing
    //   2. Or current tour step are not matched with given props
    if (isHandlingClick.current || !isTourStepMatched(tour, useInStepKey)) {
      return null;
    }

    isHandlingClick.current = true;

    try {
      return handleCallback(beforeNext, function () {
        tour.next(stepKey);
        isHandlingClick.current = false;
      }, {
        tourKey: tourKey || getTour(),
        stepKey: stepKey || getStep()
      });
    } catch (error) {
      isHandlingClick.current = false;
      throw error;
    }
  };

  return /*#__PURE__*/_jsx(UIButton, Object.assign({}, buttonProps, {
    onClick: handleClick,
    children: children
  }));
};

UITourNextButton.propTypes = {
  /**
   * Callback before go to next tour step
   */
  beforeNext: PropTypes.func.isRequired,

  /**
   * Tour of this button lives
   */
  tourKey: PropTypes.string,

  /**
   * The step when clicking the button to jump to
   */
  stepKey: PropTypes.string,
  children: PropTypes.node,

  /**
   * The step which the button binds to and enables clicking to next step
   */
  useInStepKey: PropTypes.string
};
UITourNextButton.defaultProps = {
  beforeNext: emptyFunction
};
export default UITourNextButton;