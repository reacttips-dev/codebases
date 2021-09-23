import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/esm/taggedTemplateLiteralLoose";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  .uiFullScreenBackground #onboarding-tours-banner-frame {\n    filter: blur(5px);\n    z-index: auto !important\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIModal from 'UIComponents/dialog/UIModal';
import H3 from 'UIComponents/elements/headings/H3';
import OnboardingTourButtons from '../OnboardingTourButtons';
import { useTourContext, useIsLastStep } from '../../hooks/tour';
// Hide the banner from modals and show it only after the user action on the modal CTA.
var HandholdingBannerGlobalStyle = createGlobalStyle(_templateObject());

var OnboardingTourModal = function OnboardingTourModal(props) {
  var _props$step = props.step,
      title = _props$step.title,
      text = _props$step.text,
      buttons = _props$step.buttons,
      rest = _objectWithoutProperties(props, ["step"]);

  var _useTourContext = useTourContext(),
      tour = _useTourContext.tour;

  var isOnLastStep = useIsLastStep();

  var handleClose = function handleClose() {
    tour.finish();
  };

  return /*#__PURE__*/_jsxs(UIModal, Object.assign({}, rest, {
    className: "m-top-0",
    use: "conversational",
    width: 550,
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      className: "text-left",
      children: [/*#__PURE__*/_jsx(H3, {
        children: title
      }), isOnLastStep && /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: handleClose
      })]
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      className: "p-top-6 text-left",
      children: /*#__PURE__*/_jsx("div", {
        children: text
      })
    }), /*#__PURE__*/_jsx(UIDialogFooter, {
      children: /*#__PURE__*/_jsx(OnboardingTourButtons, {
        buttons: buttons || []
      })
    }), /*#__PURE__*/_jsx(HandholdingBannerGlobalStyle, {})]
  }));
};

OnboardingTourModal.propTypes = {
  step: PropTypes.object
};
export default OnboardingTourModal;