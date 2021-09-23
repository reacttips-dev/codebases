import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, Component } from 'react';
import styled from 'styled-components';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import TourContext from 'ui-shepherd-react/contexts/TourContext';
import UITourStep from 'ui-shepherd-react/tour/UITourStep';
import UIImage from 'UIComponents/image/UIImage';
import UIFlex from 'UIComponents/layout/UIFlex';
import { SLINKY } from 'HubStyleTokens/colors';
import OnboardingTourButtons from './OnboardingTourButtons';
import OnboardingTourFinishModal from './modals/OnboardingTourFinishModal';
import OnboardingTourCloseModal from './modals/OnboardingTourCloseModal';
import OnboardingTourImageModal from './modals/OnboardingTourImageModal';
import OnboardingTourModal from './modals/OnboardingTourModal';
import { TOUR_ID, ONBOARDING_TOUR_ID } from '../constants/URL';
import { getAttachToElementQuery } from '../util/attachToUtil';
import { getElement } from '../util/elementUtil';
import { beforeStepStartListener, attachEscapeHatchListeners } from '../util/tourListener';
import { handleCompletionTracking } from '../util/tourTracking';
import { removeQueryParams } from '../util/urlUtils';
import { MESSAGE_KEY, MESSAGE_ACTIONS } from '../constants/TourMessageConstants';
import { DONE_STEP, FINISH } from '../constants/TourActions';
import { isBannerEnabled } from '../util/banner';
import { addOnboardingTourBodyClass, removeOnboardingTourBodyClass } from '../util/body';
var StyledTourStep = styled(UITourStep).withConfig({
  displayName: "OnboardingTourSteps__StyledTourStep",
  componentId: "zxrfbm-0"
})(["header{padding:12px 24px;}"]);
var ConstrainedStepBody = styled.div.withConfig({
  displayName: "OnboardingTourSteps__ConstrainedStepBody",
  componentId: "zxrfbm-1"
})(["ul{margin-bottom:0;padding-left:20px;}"]);
var StepText = styled.div.withConfig({
  displayName: "OnboardingTourSteps__StepText",
  componentId: "zxrfbm-2"
})(["font-size:12px;color:", ";font-weight:400;"], SLINKY);

var OnboardingTourSteps = /*#__PURE__*/function (_Component) {
  _inherits(OnboardingTourSteps, _Component);

  function OnboardingTourSteps(props) {
    var _this;

    _classCallCheck(this, OnboardingTourSteps);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OnboardingTourSteps).call(this, props));
    _this.state = {
      shouldShowCloseModal: false,
      stepsWithCounter: _this.getStepsWithCounter(),
      showCompletionModal: false
    };
    _this.beforeStart = _this.beforeStart.bind(_assertThisInitialized(_this));
    _this.getAttachToElement = _this.getAttachToElement.bind(_assertThisInitialized(_this));
    _this.onOnboardingTourMessage = _this.onOnboardingTourMessage.bind(_assertThisInitialized(_this));
    _this.handleTourCompletion = _this.handleTourCompletion.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(OnboardingTourSteps, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleTourCompletion();
      this.startTour();
      window.addEventListener('message', this.onOnboardingTourMessage);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.tourData !== this.props.tourData) {
        this.setState({
          stepsWithCounter: this.getStepsWithCounter()
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('message', this.onOnboardingTourMessage);

      if (this.removeCompletionSubscription) {
        this.removeCompletionSubscription();
      }
    }
  }, {
    key: "handleTourCompletion",
    value: function handleTourCompletion() {
      var _this2 = this;

      handleCompletionTracking(this.context.tour);
      var tourData = this.props.tourData;
      var shouldShowCompleteModal = !isBannerEnabled() && tourData.enableTourCompleteModal && !tourData.returnUrl;

      var _this$context$tour$su = this.context.tour.subscribe(function (stepId) {
        if (stepId === DONE_STEP) {
          if (shouldShowCompleteModal) {
            _this2.setState({
              showCompletionModal: true
            });
          }

          if (tourData.removeTourQueryParamOnCompletion) {
            removeQueryParams([ONBOARDING_TOUR_ID, TOUR_ID]);
          }

          window.postMessage({
            key: MESSAGE_KEY,
            action: MESSAGE_ACTIONS.TOUR_COMPLETED
          }, '*');
          removeOnboardingTourBodyClass();
        }
      }),
          _this$context$tour$su2 = _slicedToArray(_this$context$tour$su, 1),
          completionSubscription = _this$context$tour$su2[0];

      this.removeCompletionSubscription = completionSubscription;
    }
  }, {
    key: "onOnboardingTourMessage",
    value: function onOnboardingTourMessage(event) {
      var _event$data = event.data,
          action = _event$data.action,
          key = _event$data.key;
      var tour = this.context.tour;

      if (key !== MESSAGE_KEY || !tour) {
        return;
      }

      if (action === MESSAGE_ACTIONS.CLOSE) {
        tour.deactivate();
      }
    }
  }, {
    key: "beforeStart",
    value: function beforeStart() {
      var tour = this.context.tour;
      var _this$props$tourData = this.props.tourData,
          prevTourLength = _this$props$tourData.prevTourLength,
          linkedToursTotalStepCount = _this$props$tourData.linkedToursTotalStepCount,
          returnUrl = _this$props$tourData.returnUrl;
      var stepsWithCounter = this.state.stepsWithCounter;
      var currentStepConfig = this.getCurrentStepConfig();
      var beforeStart = currentStepConfig.beforeStart; // The step will execute and wait for both of these to resolve before starting.

      return Promise.all([typeof beforeStart === 'function' && beforeStart(this.context), beforeStepStartListener(tour, currentStepConfig, prevTourLength + stepsWithCounter.length, linkedToursTotalStepCount, returnUrl)]);
    }
  }, {
    key: "startTour",
    value: function startTour() {
      var returnUrl = this.props.tourData.returnUrl;
      var _this$props = this.props,
          tourId = _this$props.tourId,
          _this$props$tourData2 = _this$props.tourData,
          prevTourLength = _this$props$tourData2.prevTourLength,
          linkedToursTotalStepCount = _this$props$tourData2.linkedToursTotalStepCount;
      var stepsWithCounter = this.state.stepsWithCounter;
      var tour = this.context.tour;
      attachEscapeHatchListeners(tour, prevTourLength + stepsWithCounter.length, linkedToursTotalStepCount, returnUrl);
      addOnboardingTourBodyClass();
      tour.start(tourId);
    }
  }, {
    key: "getSteps",
    value: function getSteps(filterFn) {
      var steps = this.props.tourData.steps;
      return (filterFn ? steps.filter(filterFn) : steps).map(function (step) {
        return step.id;
      });
    }
  }, {
    key: "getStepsWithCounter",
    value: function getStepsWithCounter() {
      return this.getSteps(function (step) {
        return !step.isModal;
      });
    }
  }, {
    key: "getStepProgress",
    value: function getStepProgress(stepKey, allStepKeys) {
      var _this$props$tourData3 = this.props.tourData,
          prevTourLength = _this$props$tourData3.prevTourLength,
          linkedToursTotalStepCount = _this$props$tourData3.linkedToursTotalStepCount;
      var currentStepIndex = allStepKeys.indexOf(stepKey);
      var stepIndex = linkedToursTotalStepCount ? prevTourLength + currentStepIndex : currentStepIndex;
      var totalSteps = linkedToursTotalStepCount || allStepKeys.length;
      return {
        stepIndex: stepIndex,
        totalSteps: totalSteps
      };
    }
  }, {
    key: "getStepText",
    value: function getStepText(stepKey) {
      var _this$getStepProgress = this.getStepProgress(stepKey, this.state.stepsWithCounter),
          stepIndex = _this$getStepProgress.stepIndex,
          totalSteps = _this$getStepProgress.totalSteps;

      return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "onboarding-tours.tours.common.stepProgress",
        options: {
          currentStep: stepIndex + 1,
          totalSteps: totalSteps
        }
      });
    }
  }, {
    key: "getIsLastStep",
    value: function getIsLastStep(stepKey) {
      var _this$getStepProgress2 = this.getStepProgress(stepKey, this.getSteps()),
          stepIndex = _this$getStepProgress2.stepIndex,
          totalSteps = _this$getStepProgress2.totalSteps;

      return stepIndex === totalSteps - 1;
    }
  }, {
    key: "getContent",
    value: function getContent(step) {
      var returnUrl = this.props.tourData.returnUrl;
      var buttons = step.buttons,
          _step$showSteps = step.showSteps,
          showSteps = _step$showSteps === void 0 ? true : _step$showSteps,
          id = step.id;

      if (this.getIsLastStep(id) && returnUrl) {
        // If returnUrl exists, redirect user to returnUrl and disable completion modal on tour finish button clicking
        var finishButton = (buttons || []).find(function (button) {
          return button.action === FINISH || button.commonText === 'endTour';
        });

        if (finishButton) {
          finishButton.url = returnUrl;
          finishButton.disableTaskCompletionModal = true;
        } // If returnUrl exists, redirect user to returnUrl instead of User Guide on last step


        var userGuideButton = (buttons || []).find(function (button) {
          return button.url && button.url.startsWith('/user-guide/');
        });

        if (userGuideButton) {
          userGuideButton.url = returnUrl;
        } // If returnUrl exists and button link is another tour, append returnUrl to tour link


        var otherTourButton = (buttons || []).find(function (button) {
          return button.url && button.url.includes('tourId=') && !button.url.includes('returnUrl');
        });

        if (otherTourButton) {
          otherTourButton.url = otherTourButton.url + "&returnUrl=" + returnUrl;
        }
      }

      if (step.attachTo) {
        var actionText = step.actionText,
            beforeBackClickHandler = step.beforeBackClickHandler,
            enableBackButton = step.enableBackButton,
            showMeHowText = step.showMeHowText,
            text = step.text,
            title = step.title,
            image = step.image,
            buttonSize = step.buttonSize,
            externalStepLink = step.externalStepLink;
        return {
          header: title && /*#__PURE__*/_jsx("h5", {
            children: title
          }),
          body: /*#__PURE__*/_jsxs(Fragment, {
            children: [showSteps && /*#__PURE__*/_jsx(StepText, {
              className: "m-bottom-1",
              children: this.getStepText(id)
            }), image && /*#__PURE__*/_jsx(UIFlex, {
              justify: "center",
              children: /*#__PURE__*/_jsx(UIImage, {
                alt: image.alt,
                className: "m-bottom-4",
                src: image.src,
                width: image.width
              })
            }), text && /*#__PURE__*/_jsx(ConstrainedStepBody, {
              children: text
            }), actionText && /*#__PURE__*/_jsx("div", {
              className: "p-top-4",
              children: /*#__PURE__*/_jsx("strong", {
                children: actionText
              })
            }), externalStepLink && /*#__PURE__*/_jsx("div", {
              className: "p-top-4",
              children: externalStepLink
            }), showMeHowText && /*#__PURE__*/_jsx("div", {
              className: "p-top-4",
              children: showMeHowText
            })]
          }),
          footer: buttons && buttons.length > 0 && /*#__PURE__*/_jsx(OnboardingTourButtons, {
            beforeBackClickHandler: beforeBackClickHandler,
            buttons: buttons,
            buttonSize: buttonSize || 'sm',
            completeActionKey: this.props.tourData.completeActionKey,
            enableBackButton: enableBackButton
          })
        };
      }

      var TourModal = step.image ? OnboardingTourImageModal : OnboardingTourModal;
      return /*#__PURE__*/_jsx(TourModal, {
        "data-test-step-index": step.id,
        step: step
      });
    }
  }, {
    key: "getCurrentStepConfig",
    value: function getCurrentStepConfig() {
      var tour = this.context.tour;
      var currentStepId = tour.getStep();
      var steps = this.props.tourData.steps;
      var currentStepConfig = steps.find(function (step) {
        return step.id === currentStepId;
      });
      return currentStepConfig;
    }
  }, {
    key: "getAttachToElement",
    value: function getAttachToElement() {
      var currentStepConfig = this.getCurrentStepConfig();

      if (!currentStepConfig) {
        return null;
      }

      var attachTo = currentStepConfig.attachTo;
      var attachToElementQuery = getAttachToElementQuery(attachTo);
      var attachToElement = getElement({
        contains: attachTo && attachTo.contains,
        elementGetter: attachTo && attachTo.elementGetter,
        elementQuery: attachToElementQuery
      }); // For elements that don't load straight away, we need to pass
      // the element query which will be retried on load of step.

      return attachToElement || null;
    }
  }, {
    key: "renderActiveStep",
    value: function renderActiveStep() {
      var _this3 = this;

      // Loop through the tour data, creating each step
      var currentStepConfig = this.getCurrentStepConfig();

      if (!currentStepConfig) {
        return null;
      }

      var returnUrl = this.props.tourData.returnUrl;
      var arrowSize = currentStepConfig.arrowSize,
          attachTo = currentStepConfig.attachTo,
          id = currentStepConfig.id,
          pulser = currentStepConfig.pulser,
          _currentStepConfig$sh = currentStepConfig.showCloseButton,
          showCloseButton = _currentStepConfig$sh === void 0 ? true : _currentStepConfig$sh,
          toggleOnTargetVisibilityChange = currentStepConfig.toggleOnTargetVisibilityChange,
          width = currentStepConfig.width,
          zIndex = currentStepConfig.zIndex; // Changes the width and z-index of the tour step if values are provided in the step config

      var tourStepProps = Object.assign({}, width && {
        width: width
      }, {}, zIndex && {
        zIndex: zIndex
      });
      var scrollIntoView = attachTo && attachTo.scrollIntoView;
      var scrollTo = scrollIntoView === true ? 'nearest' : scrollIntoView || undefined;
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(StyledTourStep, Object.assign({
          arrowSize: arrowSize // Use function attachTo for:
          //   - get latest element after waitForElement observer and beforeStart callback
          //   - avoid passing incorrect element if waitForElement is not returned or page will be re-rendered
          //   - OnboardingTourSteps can't change attachTo dynamically after mount
          ,
          attachTo: attachTo ? this.getAttachToElement : undefined,
          beforeStart: this.beforeStart,
          content: this.getContent(currentStepConfig),
          "data-test-step-index": id,
          onClickCloseButton: showCloseButton ? function () {
            _this3.setState({
              shouldShowCloseModal: true
            });

            return false; // Keep popover open
          } : undefined,
          placement: attachTo && attachTo.on,
          pulser: pulser,
          scrollTo: scrollTo,
          showCloseButton: showCloseButton,
          stepKey: id,
          toggleOnTargetVisibilityChange: toggleOnTargetVisibilityChange
        }, tourStepProps), id), this.state.shouldShowCloseModal && /*#__PURE__*/_jsx(OnboardingTourCloseModal, {
          onConfirm: function onConfirm() {
            _this3.setState({
              shouldShowCloseModal: false
            });

            removeOnboardingTourBodyClass();
            removeQueryParams([ONBOARDING_TOUR_ID, TOUR_ID]);

            if (returnUrl) {
              window.location.href = returnUrl;
            }
          },
          onReject: function onReject() {
            _this3.setState({
              shouldShowCloseModal: false
            });
          },
          stepId: id,
          tourId: this.props.tourId
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props2 = this.props,
          tourId = _this$props2.tourId,
          tourData = _this$props2.tourData;

      if (this.state.showCompletionModal) {
        return /*#__PURE__*/_jsx(OnboardingTourFinishModal, {
          "data-test-step-index": "finish-modal",
          onClose: function onClose() {
            return _this4.setState({
              showCompletionModal: false
            });
          },
          tourData: tourData,
          tourId: tourId
        });
      }

      return /*#__PURE__*/_jsx("span", {
        children: this.renderActiveStep()
      });
    }
  }]);

  return OnboardingTourSteps;
}(Component);

OnboardingTourSteps.contextType = TourContext;
OnboardingTourSteps.propTypes = {
  tourData: PropTypes.object.isRequired,
  tourId: PropTypes.string.isRequired
};
export default OnboardingTourSteps;