import { jsx as _jsx } from "react/jsx-runtime";
import { callingToolSettings } from '../../utils/urlUtils';
import PortalIdParser from 'PortalIdParser';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
export function RegisterPhoneNumberButton(_ref) {
  var onRegisterNumber = _ref.onRegisterNumber,
      isUngatedForPhoneNumberAcquisition = _ref.isUngatedForPhoneNumberAcquisition;
  return /*#__PURE__*/_jsx(UIButton, {
    responsive: false,
    use: "primary",
    className: "flex-grow-1 display-inline-block",
    external: isUngatedForPhoneNumberAcquisition,
    onClick: isUngatedForPhoneNumberAcquisition ? function () {
      return void 0;
    } : onRegisterNumber,
    href: isUngatedForPhoneNumberAcquisition ? callingToolSettings(PortalIdParser.get() || '') : void 0,
    "data-selenium-test": "calling-onboarding-register-number",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: 'callingOnboarding.connectOrLearnMore.buttons.registerNumber'
    })
  });
}