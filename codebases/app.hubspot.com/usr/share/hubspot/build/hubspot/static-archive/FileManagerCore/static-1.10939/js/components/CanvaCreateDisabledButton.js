'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIImage from 'UIComponents/image/UIImage';
import UIButton from 'UIComponents/button/UIButton';
import ScopedFeatureTooltip from './permissions/ScopedFeatureTooltip';
import canvaLogoUrl from 'bender-url!FileManagerImages/images/canva-logo.png';

var CanvaCreateDisabledButton = function CanvaCreateDisabledButton() {
  return /*#__PURE__*/_jsx(ScopedFeatureTooltip, {
    children: /*#__PURE__*/_jsxs(UIButton, {
      disabled: true,
      children: [/*#__PURE__*/_jsx(UIImage, {
        alt: I18n.text('FileManagerCore.actions.addFromCanva'),
        className: "m-x-1",
        height: 20,
        responsive: false,
        src: canvaLogoUrl
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        className: "canva-button-text m-x-1",
        message: "FileManagerCore.actions.addFromCanva"
      })]
    })
  });
};

export default CanvaCreateDisabledButton;