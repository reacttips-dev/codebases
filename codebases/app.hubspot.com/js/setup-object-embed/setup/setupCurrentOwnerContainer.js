'use es6'; // The following disable directive for no-restricted-imports is intentional. We need to mport it for setup.
// eslint-disable-next-line no-restricted-imports

import GlobalCurrentOwnerContainer from 'crm-legacy-global-containers/GlobalCurrentOwnerContainer';
import CurrentOwnerContainer from '../containers/CurrentOwnerContainer';
export var setupCurrentOwnerContainer = function setupCurrentOwnerContainer(auth, ownerId) {
  CurrentOwnerContainer.set(ownerId);
  GlobalCurrentOwnerContainer.setContainer(CurrentOwnerContainer);
};