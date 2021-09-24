'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';

var NotFound = function NotFound() {
  return /*#__PURE__*/_jsx(UIErrorMessage, {
    type: "notFound",
    children: /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "notFoundError"
      })
    })
  });
};

export default NotFound;