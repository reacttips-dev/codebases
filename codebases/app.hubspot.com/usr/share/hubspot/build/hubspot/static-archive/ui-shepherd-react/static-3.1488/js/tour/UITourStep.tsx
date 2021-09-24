import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/esm/taggedTemplateLiteralLoose";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  html,\n  body {\n    overflow: hidden;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

import I18n from 'I18n';
import { createRef, Children, cloneElement, isValidElement, Component, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import emptyFunction from 'react-utils/emptyFunction';
import { createGlobalStyle } from 'styled-components';
import UIPopover from 'UIComponents/tooltip/UIPopover'; // @ts-expect-error dependency missing types

import domElementPropType from 'UIComponents/utils/propTypes/domElement';
import TourContext from '../contexts/TourContext';
import UITourPulser from '../pulser/UITourPulser';
import handleCallback from '../lib/handleCallback';
import { deactivateTour } from '../lib/deactivateTour';
import { getAttachedElement, isElementVisible } from '../utils/elementUtils';
var UITourPulserGlobalStyle = createGlobalStyle(_templateObject());

var UITourStep = /*#__PURE__*/function (_Component) {
  _inherits(UITourStep, _Component);

  function UITourStep(props, context) {
    var _this;

    _classCallCheck(this, UITourStep);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITourStep).call(this, props));

    var _ref = context || {},
        tour = _ref.tour;

    _this.state = {};
    _this._mounted = false;

    if (typeof tour !== 'undefined') {
      _this.state = {
        currentTour: tour.getTour(),
        currentStep: tour.getStep(),
        readyToStart: false
      };
    }

    _this.pulserRef = /*#__PURE__*/createRef();
    _this.targetRef = /*#__PURE__*/createRef();
    _this.onOpenComplete = _this.onOpenComplete.bind(_assertThisInitialized(_this));
    _this.onOpenStart = _this.onOpenStart.bind(_assertThisInitialized(_this));
    _this.scrollToTarget = _this.scrollToTarget.bind(_assertThisInitialized(_this));
    _this.unsubscribes = [];
    return _this;
  }

  _createClass(UITourStep, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          tourKey = _this$props.tourKey,
          stepKey = _this$props.stepKey,
          beforeStart = _this$props.beforeStart;
      var tour = this.context.tour;
      this._mounted = true;

      if (typeof tour !== 'undefined') {
        var unsubscribe = tour.subscribe(function (currentStep, currentTour) {
          if (_this2._mounted) {
            _this2.setState({
              currentTour: currentTour,
              currentStep: currentStep
            });
          }
        });
        this.unsubscribes = this.unsubscribes.concat(unsubscribe);
        var currentTour = tour.getTour();
        var currentStep = tour.getStep();
        var isActive = this.isActive(tourKey, stepKey, currentTour, currentStep); // if the tour is active when we mount, we need to kick off the beforeStart.
        // This is because if this is already active on mount, there will be no state updates.
        // That means componentWillUpdate is never run.

        if (isActive) {
          handleCallback(beforeStart, function () {
            _this2.setState({
              readyToStart: true
            });
          }, {
            tourKey: currentTour,
            stepKey: currentStep
          });
        }
      }

      var _this$props2 = this.props,
          attachTo = _this$props2.attachTo,
          toggleOnTargetVisibilityChange = _this$props2.toggleOnTargetVisibilityChange;

      if (attachTo && toggleOnTargetVisibilityChange) {
        this.initTargetElementObserver();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this3 = this;

      var _this$props3 = this.props,
          beforeStart = _this$props3.beforeStart,
          tourKey = _this$props3.tourKey,
          stepKey = _this$props3.stepKey;
      var _this$state = this.state,
          readyToStart = _this$state.readyToStart,
          currentStep = _this$state.currentStep,
          currentTour = _this$state.currentTour;
      var wasReadyToStart = prevState.readyToStart;
      var isActive = this.isActive(tourKey, stepKey, currentTour, currentStep);

      if (isActive && !wasReadyToStart && !readyToStart) {
        handleCallback(beforeStart, function () {
          _this3.setState({
            readyToStart: true
          });
        }, {
          tourKey: currentTour,
          stepKey: currentStep
        });
      }

      if (!isActive && wasReadyToStart && readyToStart) {
        this.setState({
          readyToStart: false
        });
      }

      var toggleOnTargetVisibilityChange = this.props.toggleOnTargetVisibilityChange;

      if (toggleOnTargetVisibilityChange && readyToStart !== wasReadyToStart) {
        if (readyToStart) {
          this.beginTargetElementObserver();
        } else {
          this.endTargetElementObserver();
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var tour = this.context.tour;
      this._mounted = false;

      if (typeof tour !== 'undefined') {
        this.unsubscribes.forEach(function (unsubscribe) {
          return unsubscribe();
        });
      }

      this.endTargetElementObserver();
    }
    /**
     * Setup MutationObserver for hide/resume tooltip when target element is removed/re-mounted
     */

  }, {
    key: "initTargetElementObserver",
    value: function initTargetElementObserver() {
      var _this4 = this;

      var _this$props4 = this.props,
          attachTo = _this$props4.attachTo,
          tourKey = _this$props4.tourKey,
          stepKey = _this$props4.stepKey;
      this.targetObserver = new MutationObserver(function () {
        var readyToStart = _this4.state.readyToStart;

        if (!readyToStart || !_this4.isActive(tourKey, stepKey)) {
          return;
        }

        var target = getAttachedElement(attachTo);
        var isTargetVisible = isElementVisible(target); // If target is removed/resumed or visibility has changed, re-render tour step to hide/resume tour step

        if (_this4.wasTargetVisible !== isTargetVisible) {
          // Re-render tour step
          _this4.setState({});

          _this4.wasTargetVisible = isTargetVisible;
        }
      });
    }
  }, {
    key: "beginTargetElementObserver",
    value: function beginTargetElementObserver() {
      if (!this.targetObserver) {
        return;
      }

      this.targetObserver.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "endTargetElementObserver",
    value: function endTargetElementObserver() {
      if (!this.targetObserver) {
        return;
      }

      this.targetObserver.disconnect();
      this.wasTargetVisible = undefined;
    }
  }, {
    key: "isActive",
    value: function isActive(tourKey, stepKey, currentTourKey, currentStepKey) {
      var _this$state2 = this.state,
          currentTour = _this$state2.currentTour,
          currentStep = _this$state2.currentStep;
      currentTourKey = currentTourKey || currentTour;
      currentStepKey = currentStepKey || currentStep;
      var isOnTour = !tourKey || tourKey === currentTourKey;
      var isOnStep = stepKey === currentStepKey;
      return isOnTour && isOnStep;
    }
  }, {
    key: "getStepText",
    value: function getStepText(_ref2) {
      var steps = _ref2.steps,
          stepKey = _ref2.stepKey;
      var stepIndex = steps.indexOf(stepKey);
      var totalSteps = steps.length;
      return I18n.text('shepherd-react.stepProgress', {
        currentStep: stepIndex + 1,
        totalSteps: totalSteps
      });
    }
  }, {
    key: "onOpenComplete",
    value: function onOpenComplete() {
      var onOpenComplete = this.props.onOpenComplete;

      if (onOpenComplete) {
        handleCallback(onOpenComplete, this.scrollToTarget, undefined);
      }
    }
  }, {
    key: "onOpenStart",
    value: function onOpenStart() {
      var onOpenStart = this.props.onOpenStart;

      if (onOpenStart) {
        onOpenStart();
      }

      if (this.pulserRef.current && this.pulserRef.current.showPulser) {
        this.pulserRef.current.showPulser();
      }
    }
  }, {
    key: "scrollToTarget",
    value: function scrollToTarget() {
      var _this$props5 = this.props,
          attachTo = _this$props5.attachTo,
          scrollTo = _this$props5.scrollTo;

      if (!scrollTo || this._scrolled) {
        return;
      }

      var target = getAttachedElement(attachTo) || this.targetRef.current;

      if (target && target.scrollIntoView) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: scrollTo
        });
        this._scrolled = true;
      }
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(target) {
      var _this$props6 = this.props,
          childOnActive = _this$props6.childOnActive,
          pulser = _this$props6.pulser,
          scrollTo = _this$props6.scrollTo,
          stepKey = _this$props6.stepKey,
          children = _this$props6.children,
          tourKey = _this$props6.tourKey;
      var showScrollToTarget = scrollTo && !target;
      var showChildOnActive = this.state.readyToStart && childOnActive;
      var showPulser = this.state.readyToStart && pulser;
      var isActive = this.isActive(tourKey, stepKey); // Using isActive instead of readyToStart here because global style needs to be appended before `beforeStart` hook and `scrollToTarget`

      var shouldPreventOverflow = isActive && typeof pulser === 'object' && pulser.preventOverflow === true;
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [children, showScrollToTarget && /*#__PURE__*/_jsx("span", {
          ref: this.targetRef
        }), showChildOnActive && childOnActive, showPulser && /*#__PURE__*/_jsx(UITourPulser, Object.assign({
          ref: this.pulserRef,
          target: target || findDOMNode(this)
        }, pulser)), shouldPreventOverflow && /*#__PURE__*/_jsx(UITourPulserGlobalStyle, {})]
      }, stepKey);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          attachTo = _this$props7.attachTo,
          children = _this$props7.children,
          stepKey = _this$props7.stepKey,
          tourKey = _this$props7.tourKey,
          content = _this$props7.content,
          __childOnActive = _this$props7.childOnActive,
          onClickCloseButton = _this$props7.onClickCloseButton,
          __onOpenComplete = _this$props7.onOpenComplete,
          __onOpenStart = _this$props7.onOpenStart,
          __open = _this$props7.open,
          __pulser = _this$props7.pulser,
          __scrollTo = _this$props7.scrollTo,
          showCloseButton = _this$props7.showCloseButton,
          showSteps = _this$props7.showSteps,
          __toggleOnTargetVisibilityChange = _this$props7.toggleOnTargetVisibilityChange,
          __beforeStart = _this$props7.beforeStart,
          extraProps = _objectWithoutProperties(_this$props7, ["attachTo", "children", "stepKey", "tourKey", "content", "childOnActive", "onClickCloseButton", "onOpenComplete", "onOpenStart", "open", "pulser", "scrollTo", "showCloseButton", "showSteps", "toggleOnTargetVisibilityChange", "beforeStart"]);

      var readyToStart = this.state.readyToStart;
      var tour = this.context.tour;
      var target = getAttachedElement(attachTo) || null;
      var hasTarget = attachTo ? !!target && isElementVisible(target) : true;
      var isActive = this.isActive(tourKey, stepKey) && hasTarget && readyToStart;

      if (typeof content === 'undefined' && children) {
        var child = Children.only(content);
        return /*#__PURE__*/cloneElement(child, {
          isStepActive: isActive
        });
      }

      if ( /*#__PURE__*/isValidElement(content) && isActive) {
        return content;
      }

      var config = tour.getConfig();
      var stepText = showSteps && this.getStepText({
        steps: config.steps,
        stepKey: stepKey
      });

      var handleDeactivation = function handleDeactivation() {
        if (typeof onClickCloseButton === 'function' && onClickCloseButton(stepKey, tourKey) === false) {
          return null;
        }

        return deactivateTour(tour, tourKey);
      };

      var _this$props$open = this.props.open,
          open = _this$props$open === void 0 ? isActive : _this$props$open;
      return /*#__PURE__*/_jsx(UIPopover, Object.assign({
        use: "shepherd",
        open: open,
        width: 350,
        target: target,
        content: Object.assign({
          step: stepText
        }, typeof content === 'object' ? content : undefined),
        onOpenComplete: this.onOpenComplete,
        onOpenStart: this.onOpenStart,
        closeOnOutsideClick: false,
        showCloseButton: showCloseButton // showCloseButton in UIPopover triggers onOpenChange when clicked. Set onOpenChange to
        // end tour if showCloseButton is provided, otherwise leave unset since used otherwise.
        ,
        onOpenChange: showCloseButton ? handleDeactivation : undefined
      }, extraProps, {
        children: this.renderChildren(target)
      }));
    }
  }]);

  return UITourStep;
}(Component);

UITourStep.contextType = TourContext;
UITourStep.defaultProps = {
  beforeStart: emptyFunction,
  onOpenComplete: emptyFunction
};
UITourStep.propTypes = {
  tourKey: PropTypes.string,
  stepKey: PropTypes.string.isRequired,
  beforeStart: PropTypes.func,
  childOnActive: PropTypes.node,
  children: PropTypes.node,
  onClickCloseButton: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onOpenStart: PropTypes.func,
  open: PropTypes.bool,
  pulser: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
    attachTo: PropTypes.string,
    borderColor: PropTypes.string,
    borderRadius: PropTypes.number,
    borderSize: PropTypes.number,
    enableBorder: PropTypes.bool,
    enableOverlay: PropTypes.bool,
    enablePulse: PropTypes.bool,
    pulserDistance: PropTypes.number,
    pulserDuration: PropTypes.string,
    pulserPadding: PropTypes.number,
    pulserZIndex: PropTypes.number
  })]),
  attachTo: PropTypes.oneOfType([PropTypes.string, PropTypes.func, domElementPropType]),
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.shape({
    header: PropTypes.node,
    body: PropTypes.node,
    footer: PropTypes.node,
    step: PropTypes.node
  })]),
  scrollTo: PropTypes.oneOf(['start', 'center', 'end', 'nearest']),
  showCloseButton: PropTypes.bool,
  showSteps: PropTypes.bool,
  toggleOnTargetVisibilityChange: PropTypes.bool
};
export default UITourStep;