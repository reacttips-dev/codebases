'use es6';

import formatName from 'I18n/utils/formatName';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { List, Map as ImmutableMap, fromJS } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';

var formatOwnerId = function formatOwnerId(owner) {
  return String(owner.ownerId);
};

export var formatOwnerLabel = function formatOwnerLabel(owner) {
  var firstName = owner.firstName;
  var lastName = owner.lastName;
  var fullName = formatName({
    firstName: firstName,
    lastName: lastName
  });

  if (fullName !== null && fullName.length > 0) {
    return fullName;
  } else {
    return owner.email;
  }
};

var formatOwnerReference = function formatOwnerReference(owner) {
  return new ReferenceRecord({
    id: formatOwnerId(owner),
    label: formatOwnerLabel(owner),
    description: owner.email,
    referencedObject: fromJS(owner)
  });
};

var formatDisabledOwnerReference = function formatDisabledOwnerReference(owner, disabled) {
  return new ReferenceRecord({
    id: formatOwnerId(owner),
    label: formatOwnerLabel(owner),
    description: owner.email,
    referencedObject: fromJS(owner),
    disabled: disabled
  });
};

export var formatOwners = function formatOwners(response) {
  return indexBy(get('id'), List(response).map(formatOwnerReference));
};
export var formatOwnersPaged = function formatOwnersPaged(response, allowList) {
  var results = response.results,
      hasMore = response.hasMore,
      offset = response.offset;
  var formattedResults = allowList ? List(results).map(function (owner) {
    return formatDisabledOwnerReference(owner, !allowList.includes(owner.activeUserId));
  }) : List(results).map(formatOwnerReference);
  return ImmutableMap({
    hasMore: hasMore,
    offset: offset || 0,
    count: results.length,
    results: formattedResults
  });
};