'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
export default function CrmContentError() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? 'componentErrorAlert.genericError_jsx' : _ref$message;

  return /*#__PURE__*/_jsx(UIErrorMessage, {
    type: "403",
    illustration: "errors/general",
    children: /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: message,
        options: {
          href: window.location.href
        },
        elements: {
          Link: UILink
        }
      })
    })
  });
}