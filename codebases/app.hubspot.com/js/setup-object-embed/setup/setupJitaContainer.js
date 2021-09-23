'use es6'; // The following disable directive for no-restricted-imports is intentional. We need to mport it for setup.
// eslint-disable-next-line no-restricted-imports

import GlobalJitaContainer from 'crm-legacy-global-containers/GlobalJitaContainer';
import JitaContainer from '../containers/JitaContainer'; // The following disable directive for no-restricted-imports is intentional. We need to mport it for setup.
// eslint-disable-next-line no-restricted-imports

import { isJitaUser } from 'crm-legacy-global-containers/isJitaUser';
export var setupJitaContainer = function setupJitaContainer(auth, ownerId) {
  JitaContainer.set(isJitaUser(ownerId, auth));
  GlobalJitaContainer.setContainer(JitaContainer);
};