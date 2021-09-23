'use es6';

import { logCallingError } from 'calling-error-reporting/report/error';
import { validatePhoneNumberApi } from '../../callee-number-validation/clients/numberValidationClient';
import { ValidatedNumber } from 'calling-lifecycle-internal/callees/records/CalleesRecords';
export function validateToPhoneNumber(propertyName, phoneNumberString) {
  return validatePhoneNumberApi(propertyName, phoneNumberString).then(function (res) {
    return new ValidatedNumber(res);
  }).catch(function (e) {
    logCallingError({
      errorMessage: 'Error validating "to phone number"',
      extraData: {
        error: e,
        propertyName: propertyName,
        phoneNumberString: phoneNumberString
      }
    });
  });
}