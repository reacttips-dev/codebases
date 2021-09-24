'use es6';

import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { Map as ImmutableMap, List, fromJS } from 'immutable';
import formatName from 'I18n/utils/formatName';

var formatUserId = function formatUserId(user) {
  return String(user.user_id);
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

var formatDisabledUserReference = function formatDisabledUserReference(user, disabled) {
  return new ReferenceRecord({
    description: user.email,
    id: formatUserId(user),
    label: formatLabel(user),
    referencedObject: fromJS(user),
    disabled: disabled
  });
};

export var formatUsersSearch = function formatUsersSearch(response) {
  return List(response.map(formatUserReference));
};

var normalizeResults = function normalizeResults(users) {
  return users.map(function (user) {
    return Object.assign({
      id: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name
    }, user);
  });
};

export var formatUsersSearchPaged = function formatUsersSearchPaged(response, allowList) {
  var hasMore = response.hasMore,
      results = response.results,
      offset = response.offset;
  var normalized = normalizeResults(results);
  var users = allowList ? List(normalized.map(function (user) {
    return formatDisabledUserReference(user, !allowList.includes(user.id));
  })) : formatUsersSearch(normalized);
  return ImmutableMap({
    count: users.size,
    hasMore: hasMore,
    offset: offset || 0,
    results: users
  });
};