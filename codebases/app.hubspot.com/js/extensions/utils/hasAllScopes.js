'use es6';

import ScopesContainer from '../../containers/ScopesContainer';
import { isScoped } from '../../containers/ScopeOperators';
/**
 *
 * @param  {...String} scopesToCheck
 * @deprecated Do not use directly. Prefer useHasAllScopes.
 */

export var hasAllScopes = function hasAllScopes() {
  var scopes = ScopesContainer.get();

  for (var _len = arguments.length, scopesToCheck = new Array(_len), _key = 0; _key < _len; _key++) {
    scopesToCheck[_key] = arguments[_key];
  }

  return scopesToCheck.every(function (scope) {
    return isScoped(scopes, scope);
  });
};