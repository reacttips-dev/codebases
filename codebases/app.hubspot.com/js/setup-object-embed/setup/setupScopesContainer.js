'use es6'; // The following disable directive for no-restricted-imports is intentional. We need to mport it for setup.
// eslint-disable-next-line no-restricted-imports

import GlobalScopesContainer from 'crm-legacy-global-containers/GlobalScopesContainer';
import ScopesContainer from '../containers/ScopesContainer';
export var setupScopesContainer = function setupScopesContainer(auth) {
  var user = auth.user;
  var scopes = user.scopes.reduce(function (acc, scope) {
    acc[scope] = true;
    return acc;
  }, {});
  ScopesContainer.set(scopes);
  GlobalScopesContainer.setContainer(ScopesContainer);
};