'use es6';

import http from 'hub-http/clients/apiClient';
export function validatePhoneNumberApi(propertyName, phoneNumberString) {
  var url = "twilio/v1/phonenumberinfo/validate/" + encodeURIComponent(phoneNumberString);
  return http.get(url, {
    query: {
      propertyName: propertyName,
      isUsingConnectAccount: true
    }
  });
}