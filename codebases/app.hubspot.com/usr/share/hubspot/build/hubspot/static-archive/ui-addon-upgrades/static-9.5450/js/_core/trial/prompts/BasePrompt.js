'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import UIDialog from 'UIComponents/dialog/UIDialog';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import H1 from 'UIComponents/elements/headings/H1';
import { FLINT } from 'HubStyleTokens/colors';
var StickyContainer = styled.div.withConfig({
  displayName: "BasePrompt__StickyContainer",
  componentId: "s3yk3h-0"
})(["position:fixed;bottom:90px;right:16px;z-index:100;width:450px;box-shadow:2px 2px 7px ", ";"], FLINT);

var BasePrompt = function BasePrompt(_ref) {
  var headerText = _ref.headerText,
      bodyText = _ref.bodyText,
      cta = _ref.cta,
      handleClose = _ref.handleClose;
  return /*#__PURE__*/_jsx(StickyContainer, {
    children: /*#__PURE__*/_jsxs(UIDialog, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: handleClose
      }), /*#__PURE__*/_jsx(UIDialogHeader, {
        children: /*#__PURE__*/_jsx(H1, {
          children: headerText
        })
      }), /*#__PURE__*/_jsx(UIDialogBody, {
        children: bodyText
      }), /*#__PURE__*/_jsx(UIDialogFooter, {
        children: cta
      })]
    })
  });
};

export default BasePrompt;