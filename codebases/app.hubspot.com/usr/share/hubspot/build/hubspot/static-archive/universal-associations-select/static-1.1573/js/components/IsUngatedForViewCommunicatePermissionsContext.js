'use es6';

import { createContext, useContext } from 'react';
/**
 * Context for whether view and communication permissions are ungated
 *
 * @param {Boolean} value the boolean value that represents whether the portal is ungated for view and communication permissions.
 */

export var IsUngatedForViewCommunicatePermissionsContext = /*#__PURE__*/createContext(false);
export var useIsUngatedForViewCommunicatePermissionsContext = function useIsUngatedForViewCommunicatePermissionsContext() {
  return useContext(IsUngatedForViewCommunicatePermissionsContext);
};