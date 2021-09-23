'use es6';

import { EMPTY } from 'crm_data/constants/LoadingStatus';
import { List } from 'immutable';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { post } from 'crm_data/api/ImmutableAPI';
import PropertyValueRecord from 'customer-data-objects/property/PropertyValueRecord';
export function validateProperties(objectType, properties) {
  return post("inbounddb-objects/v1/property-validation/" + objectType + "/extended", properties);
}
export function validateEmail(email) {
  var emailProperty = PropertyValueRecord.fromJS({
    value: email,
    name: 'email'
  });
  return validateProperties(CONTACT, List([emailProperty])).then(function (response) {
    var emailValidationError = response.get(0);
    return emailValidationError ? emailValidationError.set('value', email) : EMPTY;
  });
}
export var EMAIL_VALIDATION_CONSTANTS = {
  GDPR_BLOCKLISTED_MESSAGE: 'email has been GDPR blacklisted',
  CONTACT_ALREADY_EXISTS: 'CONFLICTING_UNIQUE_VALUE',
  INVALID_EMAIL: 'INVALID_EMAIL'
};