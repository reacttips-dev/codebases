import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/esm/taggedTemplateLiteralLoose";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  .uiFullScreenBackground #onboarding-tours-banner-frame {\n    filter: blur(5px);\n    z-index: auto !important\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import UIImage from 'UIComponents/image/UIImage';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIModal from 'UIComponents/dialog/UIModal';
import H3 from 'UIComponents/elements/headings/H3';
import OnboardingTourButtons from '../OnboardingTourButtons';
// Hide the banner from modals and show it only after the user action on the modal CTA.
var HandholdingBannerGlobalStyle = createGlobalStyle(_templateObject());
var ModalContentWrapper = styled.div.withConfig({
  displayName: "OnboardingTourImageModal__ModalContentWrapper",
  componentId: "ufl7fz-0"
})(["margin:0 auto 0 auto;max-width:660px;@media (max-height:650px){max-width:580px;}@media (max-height:690px){margin-top:30px;}"]);
var LargerText = styled.div.withConfig({
  displayName: "OnboardingTourImageModal__LargerText",
  componentId: "ufl7fz-1"
})(["font-size:16px;"]);

var OnboardingTourModal = function OnboardingTourModal(props) {
  var _props$step = props.step,
      title = _props$step.title,
      text = _props$step.text,
      buttons = _props$step.buttons,
      image = _props$step.image,
      rest = _objectWithoutProperties(props, ["step"]);

  return /*#__PURE__*/_jsx(UIModal, Object.assign({}, rest, {
    className: "m-top-0",
    use: "conversational",
    width: 788,
    children: /*#__PURE__*/_jsxs(ModalContentWrapper, {
      children: [/*#__PURE__*/_jsx(UIDialogHeader, {
        className: "text-center",
        children: /*#__PURE__*/_jsx(H3, {
          children: title
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-top-6 p-bottom-6 text-center",
        children: [/*#__PURE__*/_jsx(LargerText, {
          children: text
        }), image && /*#__PURE__*/_jsx(UIFlex, {
          justify: "center",
          children: /*#__PURE__*/_jsx(UIImage, {
            alt: image.alt,
            className: "m-top-6",
            src: image.src,
            width: image.width
          })
        })]
      }), /*#__PURE__*/_jsx(UIDialogFooter, {
        align: "center",
        className: "p-left-0 p-right-0",
        children: /*#__PURE__*/_jsx(OnboardingTourButtons, {
          buttons: buttons || []
        })
      }), /*#__PURE__*/_jsx(HandholdingBannerGlobalStyle, {})]
    })
  }));
};

OnboardingTourModal.propTypes = {
  step: PropTypes.object
};
export default OnboardingTourModal;