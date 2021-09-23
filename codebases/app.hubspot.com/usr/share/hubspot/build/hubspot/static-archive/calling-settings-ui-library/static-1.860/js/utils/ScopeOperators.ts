import { List, Map as ImmutableMap } from 'immutable';

var _scopeIsInList = function _scopeIsInList(scopes, scopeToCheck) {
  return scopes.includes(scopeToCheck);
};

var _userIsScoped = function _userIsScoped(scopes, scopeToCheck) {
  var value = ImmutableMap.isMap(scopes) ? scopes.get(scopeToCheck) : scopes[scopeToCheck];
  return value === true;
};

export var isScoped = function isScoped(scopes, scopesToCheck) {
  var scopeValidator = List.isList(scopes) || Array.isArray(scopes) ? _scopeIsInList : _userIsScoped;
  return Array.isArray(scopesToCheck) ? scopesToCheck.every(function (scopeToCheck) {
    return scopeValidator(scopes, scopeToCheck);
  }) : scopeValidator(scopes, scopesToCheck);
};
export var someScoped = function someScoped(scopes, scopesToCheck) {
  var scopeValidator = List.isList(scopes) || Array.isArray(scopes) ? _scopeIsInList : _userIsScoped;
  return scopesToCheck.some(function (scopeToCheck) {
    return scopeValidator(scopes, scopeToCheck);
  });
};