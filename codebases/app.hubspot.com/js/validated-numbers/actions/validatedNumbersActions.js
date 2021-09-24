'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { ValidatedNumber } from 'calling-lifecycle-internal/callees/records/CalleesRecords';
import { getEntry } from 'conversations-async-data/indexed-async-data/operators/getEntry';
import { isFailed, isUninitialized } from 'conversations-async-data/async-data/operators/statusComparators';
import { validatePhoneNumberClient } from '../clients/validatePhoneNumberClients';
import { VALIDATE_PHONE_NUMBER } from '../constants/validatedNumbersActionTypes';
import { getValidatedNumbers } from '../../active-call-settings/selectors/getActiveCallSettings';
var validatePhoneNumber = createAsyncAction({
  actionTypes: VALIDATE_PHONE_NUMBER,
  requestFn: function requestFn(_ref) {
    var phoneNumberString = _ref.phoneNumberString,
        isUsingConnectAccount = _ref.isUsingConnectAccount,
        phoneNumberIdentifier = _ref.phoneNumberIdentifier;
    var propertyName = phoneNumberIdentifier.get('propertyName');
    return validatePhoneNumberClient({
      propertyName: propertyName,
      phoneNumberString: phoneNumberString,
      isUsingConnectAccount: isUsingConnectAccount
    });
  },
  toRecordFn: function toRecordFn(res) {
    return new ValidatedNumber(res);
  }
});
export var validatePhoneNumberIfNeeded = function validatePhoneNumberIfNeeded(_ref2) {
  var phoneNumberIdentifier = _ref2.phoneNumberIdentifier,
      phoneNumberString = _ref2.phoneNumberString,
      isUsingConnectAccount = _ref2.isUsingConnectAccount;
  return function (dispatch, getState) {
    var validatedNumbers = getValidatedNumbers(getState());
    var numberKey = phoneNumberIdentifier.toKey();
    var validatedNumberEntry = getEntry(numberKey, validatedNumbers);

    if (!validatedNumberEntry || isUninitialized(validatedNumberEntry) || isFailed(validatedNumberEntry)) {
      dispatch(validatePhoneNumber({
        phoneNumberIdentifier: phoneNumberIdentifier,
        phoneNumberString: phoneNumberString,
        isUsingConnectAccount: isUsingConnectAccount
      }));
    }
  };
};