'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import UISection from 'UIComponents/section/UISection';
import SenderSelect from './SenderSelect';
import EmailAddressSelect from './EmailAddressSelect';

var EnrollInSequenceActionConfig = function EnrollInSequenceActionConfig() {
  return /*#__PURE__*/_jsxs(UISection, {
    children: [/*#__PURE__*/_jsx(SenderSelect, {}), /*#__PURE__*/_jsx(EmailAddressSelect, {})]
  });
};

EnrollInSequenceActionConfig.propTypes = {};
export default EnrollInSequenceActionConfig;