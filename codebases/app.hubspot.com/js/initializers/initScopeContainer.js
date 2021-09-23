'use es6';

import ScopeContainer from 'SequencesUI/data/ScopeContainer';
export default (function (scopes) {
  return ScopeContainer.set(scopes.reduce(function (scopesMap, scope) {
    scopesMap[scope] = scope;
    return scopesMap;
  }, {}));
});