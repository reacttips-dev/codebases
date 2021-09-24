// Notice: This file is a duplicate that can be found in calling-library.
// TODO: Discuss with team how we might prioritize reducing duplicate code
// and moving it into a sharable library.
'use es6';

import http from 'hub-http/clients/apiClient';
export function validatePhoneNumberApi(propertyName, phoneNumberString) {
  var url = "twilio/v1/phonenumberinfo/validate/" + phoneNumberString;
  return http.get(url, {
    query: {
      propertyName: propertyName,
      isUsingConnectAccount: true
    }
  });
}