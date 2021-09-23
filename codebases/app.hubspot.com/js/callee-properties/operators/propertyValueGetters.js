'use es6';

import getIn from 'transmute/getIn';
import formatName from 'I18n/utils/formatName';
export var getFirstname = getIn(['firstname', 'value']);
export var getLastname = getIn(['lastname', 'value']);
export var getName = getIn(['name', 'value']);
export var getEmail = getIn(['email', 'value']);
export var getFormattedName = function getFormattedName(additionalProperties) {
  var name = getName(additionalProperties);
  var firstName = getFirstname(additionalProperties);
  var lastName = getLastname(additionalProperties);
  var email = getEmail(additionalProperties);
  return formatName({
    firstName: firstName,
    lastName: lastName,
    name: name,
    email: email
  });
};