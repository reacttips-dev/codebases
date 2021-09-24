'use es6';

import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
import { List, fromJS } from 'immutable';
import formatName from 'I18n/utils/formatName';

var formatUserId = function formatUserId(user) {
  return String(user.id);
};

var formatLabel = function formatLabel(user) {
  var firstName = user.firstName,
      lastName = user.lastName,
      email = user.email;
  var fullName = formatName({
    firstName: firstName,
    lastName: lastName
  });

  if (fullName !== null && fullName.length > 0) {
    return fullName;
  }

  return email;
};

var formatUserReference = function formatUserReference(user) {
  return new ReferenceRecord({
    description: user.email,
    id: formatUserId(user),
    label: formatLabel(user),
    referencedObject: fromJS(user)
  });
};

export var formatUsersV2 = function formatUsersV2(response) {
  return List(response.map(formatUserReference));
};
export var formatUsersV2Map = function formatUsersV2Map(response) {
  return indexBy(get('id'), formatUsersV2(response));
};