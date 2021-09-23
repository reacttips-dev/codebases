'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { memo, useEffect } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import UIButton from 'UIComponents/button/UIButton';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIImage from 'UIComponents/image/UIImage';
import UIMediaObject from 'UIComponents/layout/UIMediaObject';
import styled from 'styled-components';
import TwilioLogo from 'bender-url!../../../img/twilio-logo.png';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import { RegisterPhoneNumberButton } from './RegisterPhoneNumberButton';
var Wrapper = styled.div.withConfig({
  displayName: "RegisterOrLearn__Wrapper",
  componentId: "l0z3sa-0"
})(["display:flex;flex:1;flex-direction:column;justify-content:center;align-self:center;max-width:", "px;"], function (_ref) {
  var maxwidth = _ref.maxwidth;
  return maxwidth;
});

function RegisterOrLearn(_ref2) {
  var onRegisterNumber = _ref2.onRegisterNumber,
      onLearnMore = _ref2.onLearnMore,
      isUsingTwilioConnect = _ref2.isUsingTwilioConnect,
      maxWidth = _ref2.maxWidth,
      isUngatedForPhoneNumberAcquisition = _ref2.isUngatedForPhoneNumberAcquisition;
  useEffect(function () {
    CommunicatorLogger.log('communicator_callSignup', {
      action: 'zero state'
    });
  }, []);
  return /*#__PURE__*/_jsxs(Wrapper, {
    maxwidth: maxWidth,
    children: [!isUsingTwilioConnect && /*#__PURE__*/_jsx(UIMediaObject, {
      className: "p-all-4",
      itemLeft: /*#__PURE__*/_jsx(UIIllustration, {
        name: "calling",
        width: 85
      }),
      children: /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(H4, {
          className: "m-bottom-2",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: 'callingOnboarding.connectOrLearnMore.title'
          })
        }), /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: 'callingOnboarding.connectOrLearnMore.message'
          })
        })]
      })
    }), isUsingTwilioConnect && /*#__PURE__*/_jsxs("div", {
      className: "p-all-4",
      children: [/*#__PURE__*/_jsx(UIImage, {
        src: TwilioLogo,
        name: "calling",
        width: 120
      }), /*#__PURE__*/_jsx(H4, {
        className: "m-bottom-2 m-top-3",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: 'callingOnboarding.connectOrLearnMore.twilioTitle'
        })
      }), /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: 'callingOnboarding.connectOrLearnMore.message'
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "p-all-4 justify-center display-flex",
      children: [RegisterPhoneNumberButton({
        onRegisterNumber: onRegisterNumber,
        isUngatedForPhoneNumberAcquisition: isUngatedForPhoneNumberAcquisition
      }), /*#__PURE__*/_jsx(UIButton, {
        responsive: false,
        onClick: onLearnMore,
        className: "flex-grow-1",
        "data-selenium-test": "calling-onboarding-learn-more",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callingOnboarding.connectOrLearnMore.buttons.learnMore"
        })
      })]
    })]
  });
}

RegisterOrLearn.propTypes = {
  onRegisterNumber: PropTypes.func.isRequired,
  onLearnMore: PropTypes.func.isRequired,
  isUsingTwilioConnect: PropTypes.bool.isRequired,
  maxWidth: PropTypes.number,
  isUngatedForPhoneNumberAcquisition: PropTypes.bool
};
RegisterOrLearn.defaultProps = {
  maxWidth: 520
};
export default /*#__PURE__*/memo(RegisterOrLearn);