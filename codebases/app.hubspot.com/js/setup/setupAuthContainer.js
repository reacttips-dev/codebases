'use es6'; // The following disable directive for no-restricted-imports is intentional. We need to mport it for setup.
// eslint-disable-next-line no-restricted-imports

import GlobalAuthContainer from 'crm-legacy-global-containers/GlobalAuthContainer';
import AuthContainer from '../containers/AuthContainer';
export var setupAuthContainer = function setupAuthContainer(auth) {
  AuthContainer.set(auth);
  GlobalAuthContainer.setContainer(AuthContainer);
};