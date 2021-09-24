'use es6';

import invariant from 'react-utils/invariant';
import { fromJS } from 'immutable';
import identity from 'transmute/identity';

var _userIsScoped = function _userIsScoped(scopes, scopeToCheck) {
  var value = scopes[scopeToCheck];
  return value === true;
};

export var isScoped = function isScoped(scopes, scopesToCheck) {
  return Array.isArray(scopesToCheck) ? scopesToCheck.every(function (scopeToCheck) {
    return _userIsScoped(scopes, scopeToCheck);
  }) : _userIsScoped(scopes, scopesToCheck);
};
export var someScoped = function someScoped(scopes, scopesToCheck) {
  invariant(Array.isArray(scopesToCheck), 'ScopesContainer: expected scopes to be Array but got "%s"');
  return scopesToCheck.some(function (scopeToCheck) {
    return _userIsScoped(scopes, scopeToCheck);
  });
};
export var getAsSet = function getAsSet(scopes) {
  return fromJS(scopes).filter(identity).keySeq().toSet();
};