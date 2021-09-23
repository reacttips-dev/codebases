'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UIAlert from 'UIComponents/alert/UIAlert';

var ErrorMessage = function ErrorMessage() {
  return /*#__PURE__*/_jsx(UIAlert, {
    type: "danger",
    children: "Sorry, an error has occurred. Please save your work and refresh the page."
  });
};

ErrorMessage.propTypes = {};
ErrorMessage.defaultProps = {};
export default ErrorMessage;