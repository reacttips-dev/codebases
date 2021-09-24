'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { memo, useCallback, useState } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import UIButton from 'UIComponents/button/UIButton';
import styled from 'styled-components';
import { GYPSUM, OLAF } from 'HubStyleTokens/colors';
import Small from 'UIComponents/elements/Small';
import UIIllustration from 'UIComponents/image/UIIllustration';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import { getAppStorefrontRoute } from 'ecosystem-marketplace-core/utils/routes';
import * as Category from 'ecosystem-marketplace-core/constants/groupTags/Category';
import { getFullUrl } from 'hubspot-url-utils';
import PortalIdParser from 'PortalIdParser';
import { callingToolSettings } from 'calling-internal-common/js/utils/urlUtils';
var FooterWrapper = styled.div.withConfig({
  displayName: "LearnMore__FooterWrapper",
  componentId: "ddy0tv-0"
})(["display:flex;background-color:", ";border-top:1px solid ", ";flex-direction:column;justify-content:center;"], GYPSUM, OLAF);
var FooterBottomRowWrapper = styled.div.withConfig({
  displayName: "LearnMore__FooterBottomRowWrapper",
  componentId: "ddy0tv-1"
})(["flex-wrap:wrap;justify-content:space-between;flex-direction:row-reverse;"]);
var StepWrapper = styled.div.withConfig({
  displayName: "LearnMore__StepWrapper",
  componentId: "ddy0tv-2"
})(["max-width:520px;"]);
var IllustrationWrapper = styled.div.withConfig({
  displayName: "LearnMore__IllustrationWrapper",
  componentId: "ddy0tv-3"
})(["max-width:40%;"]);
var StepIndicator = styled.span.withConfig({
  displayName: "LearnMore__StepIndicator",
  componentId: "ddy0tv-4"
})(["vertical-align:bottom;"]);
var UI_STEPS = [{
  illustration: 'calling-dial',
  title: 'callingOnboardingSteps.step_1.title',
  message: 'callingOnboardingSteps.step_1.message',
  smallMessage: null,
  nextLabel: 'callingOnboardingSteps.step_1.nextLabel',
  prevLabel: null
}, {
  illustration: 'calling-log',
  title: 'callingOnboardingSteps.step_2.title',
  message: 'callingOnboardingSteps.step_2.message',
  smallMessage: null,
  nextLabel: 'callingOnboardingSteps.step_2.nextLabel',
  prevLabel: 'callingOnboardingSteps.step_2.prevLabel'
}, {
  illustration: 'calling-activity',
  title: 'callingOnboardingSteps.step_3.title',
  message: 'callingOnboardingSteps.step_3.message',
  smallMessage: null,
  nextLabel: 'callingOnboardingSteps.step_3.nextLabel',
  prevLabel: 'callingOnboardingSteps.step_3.prevLabel'
}, {
  illustration: 'calling-set-up',
  title: 'callingOnboardingSteps.step_4.title',
  message: 'callingOnboardingSteps.step_4.message',
  smallMessage: 'callingOnboardingSteps.step_4.small_jsx',
  nextLabel: 'callingOnboardingSteps.step_4.nextLabel',
  prevLabel: 'callingOnboardingSteps.step_4.prevLabel',
  twilioConnectMessage: 'callingOnboardingSteps.step_4.twilioConnectMessage'
}];
var MarketplaceUrl = "" + getFullUrl('app') + getAppStorefrontRoute(Category.CALL_CENTER);

function LearnMore(_ref) {
  var totalMinutesPerMonth = _ref.totalMinutesPerMonth,
      showRegisterNumberFlow = _ref.showRegisterNumberFlow,
      isUsingTwilioConnect = _ref.isUsingTwilioConnect,
      isUngatedForPhoneNumberAcquisition = _ref.isUngatedForPhoneNumberAcquisition;

  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      currentStep = _useState2[0],
      setStep = _useState2[1];

  var isLastStep = currentStep === UI_STEPS.length - 1;
  var nextStep = useCallback(function () {
    if (!isLastStep) {
      setStep(currentStep + 1);
    } else {
      if (!isUngatedForPhoneNumberAcquisition) {
        showRegisterNumberFlow();
      }
    }
  }, [currentStep, isLastStep, showRegisterNumberFlow, isUngatedForPhoneNumberAcquisition]);
  var prevStep = useCallback(function () {
    setStep(currentStep - 1);
  }, [currentStep, setStep]);
  var _UI_STEPS$currentStep = UI_STEPS[currentStep],
      title = _UI_STEPS$currentStep.title,
      message = _UI_STEPS$currentStep.message,
      nextLabel = _UI_STEPS$currentStep.nextLabel,
      prevLabel = _UI_STEPS$currentStep.prevLabel,
      smallMessage = _UI_STEPS$currentStep.smallMessage,
      illustration = _UI_STEPS$currentStep.illustration,
      twilioConnectMessage = _UI_STEPS$currentStep.twilioConnectMessage;
  var messageToRender = isUsingTwilioConnect && twilioConnectMessage ? twilioConnectMessage : message;
  var stepIndicatorValue = currentStep + 1 + "/" + UI_STEPS.length;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(StepWrapper, {
      "data-selenium-test": "learn-more-step-" + currentStep,
      className: "p-x-4 justify-center align-center flex-column text-center flex-1",
      children: [/*#__PURE__*/_jsx(IllustrationWrapper, {
        className: "p-bottom-5 center-block",
        children: /*#__PURE__*/_jsx(UIIllustration, {
          name: illustration
        })
      }), /*#__PURE__*/_jsx(H4, {
        className: "m-bottom-2",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: title
        })
      }), /*#__PURE__*/_jsx("p", {
        className: "m-bottom-1",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: messageToRender,
          options: {
            totalMinutesPerMonth: totalMinutesPerMonth
          }
        })
      }), smallMessage && /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(Small, {
          children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: smallMessage,
            elements: {
              UILink: UILink
            },
            options: {
              href: MarketplaceUrl,
              target: '_blank'
            }
          })
        })
      })]
    }), /*#__PURE__*/_jsx(FooterWrapper, {
      className: "m-top-3 p-y-3 p-x-5 width-100",
      children: /*#__PURE__*/_jsxs(FooterBottomRowWrapper, {
        className: "display-flex",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(StepIndicator, {
            className: "m-right-3",
            children: stepIndicatorValue
          }), /*#__PURE__*/_jsx(UIButton, {
            onClick: nextStep,
            responsive: false,
            external: isLastStep && isUngatedForPhoneNumberAcquisition,
            use: "primary",
            href: isUngatedForPhoneNumberAcquisition && isLastStep ? callingToolSettings(PortalIdParser.get()) : void 0,
            "data-selenium-test": "calling-widget-learn-more-next-button",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: nextLabel
            })
          })]
        }), prevLabel && /*#__PURE__*/_jsx(UIButton, {
          onClick: prevStep,
          responsive: false,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: prevLabel
          })
        })]
      })
    })]
  });
}

LearnMore.propTypes = {
  totalMinutesPerMonth: PropTypes.number,
  showRegisterNumberFlow: PropTypes.func.isRequired,
  isUsingTwilioConnect: PropTypes.bool.isRequired,
  isUngatedForPhoneNumberAcquisition: PropTypes.bool
};
LearnMore.defaultProps = {
  isUngatedForPhoneNumberAcquisition: false
};
export default /*#__PURE__*/memo(LearnMore);