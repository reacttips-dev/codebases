'use es6';

import formatName from 'I18n/utils/formatName';
import filter from 'transmute/filter';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import hasIn from 'transmute/hasIn';
import ifElse from 'transmute/ifElse';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
var hasIdentity = hasIn(['identityProfiles', 0, 'identity']); // if v3 contact API format

var getIdentity = getIn(['identityProfiles', 0, 'identity']); // v3 identity format

var getIdentities = getIn(['identity-profiles', 0, 'identities']); // v1 identity format

var getIdentityProfile = ifElse(hasIdentity, getIdentity, getIdentities);
var getEmailIdentities = filter(function (identity) {
  return get('type', identity) === 'EMAIL';
});
var getEmailValues = map(get('value'));

var formatEmailValues = function formatEmailValues(emailValues) {
  return emailValues.join(', ');
};

export var formatContactName = function formatContactName(contact) {
  var firstName = getIn(['properties', 'firstname', 'value'], contact) || '';
  var lastName = getIn(['properties', 'lastname', 'value'], contact) || '';
  var email = getIn(['properties', 'email', 'value'], contact);
  var fullName = formatName({
    firstName: firstName,
    lastName: lastName
  });

  if (fullName != null && fullName.length > 0) {
    return fullName;
  } else if (email) {
    return email;
  } else {
    return ''; // anonymous visitors (contacts with `isContact: false`) have no name or email address
  }
};
export var formatContactDescription = pipe(getIdentityProfile, getEmailIdentities, getEmailValues, formatEmailValues);