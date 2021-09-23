'use es6';

import { Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import memoize from 'transmute/memoize';
import formatName from 'I18n/utils/formatName';
export var getPropertyValue = function getPropertyValue(CRMObject, propertyName) {
  return getIn(['properties', propertyName, 'value'], CRMObject);
};
export var getEnrollmentIdAsNumber = function getEnrollmentIdAsNumber(CRMObject) {
  return +getIn(['properties', 'hs_enrollment_id', 'value'], CRMObject);
};
export var getEnrollmentIdAsNumberMaybeImmutable = function getEnrollmentIdAsNumberMaybeImmutable(enrollment) {
  return ImmutableMap.isMap(enrollment) ? enrollment.get('id') : +getPropertyValue(enrollment, 'hs_enrollment_id');
};
export var maybeGetContactName = memoize(function (sequenceEnrollments, contacts) {
  if (sequenceEnrollments.length > 1) return null;
  var contact = get(+getPropertyValue(sequenceEnrollments[0], 'hs_contact_id'), contacts);
  if (!contact) return null;
  var firstName = getPropertyValue(contact, 'firstname');
  var lastName = getPropertyValue(contact, 'lastname');
  var email = getPropertyValue(contact, 'email');
  return formatName({
    firstName: firstName,
    lastName: lastName,
    email: email
  });
});