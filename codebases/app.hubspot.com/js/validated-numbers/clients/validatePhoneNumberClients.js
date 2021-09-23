'use es6';

import http from 'hub-http/clients/apiClient';
export function validatePhoneNumberClient(_ref) {
  var propertyName = _ref.propertyName,
      phoneNumberString = _ref.phoneNumberString,
      _ref$isUsingConnectAc = _ref.isUsingConnectAccount,
      isUsingConnectAccount = _ref$isUsingConnectAc === void 0 ? false : _ref$isUsingConnectAc;
  var url = "twilio/v1/phonenumberinfo/validate/" + encodeURIComponent(phoneNumberString);
  return http.get(url, {
    query: {
      propertyName: propertyName,
      isUsingConnectAccount: isUsingConnectAccount,
      includeCarrierInfo: true
    }
  });
}