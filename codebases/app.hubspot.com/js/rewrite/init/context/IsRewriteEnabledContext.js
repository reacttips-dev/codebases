'use es6';

import { createContext, useContext } from 'react';
import PropTypes from 'prop-types'; // This context stores a value representing whether the redux rewrite
// is enabled or not. DO NOT change this value during runtime.

export var IsRewriteEnabledContext = /*#__PURE__*/createContext(false);
IsRewriteEnabledContext.Provider.propTypes = {
  value: PropTypes.bool.isRequired
};
export var useIsRewriteEnabled = function useIsRewriteEnabled() {
  return useContext(IsRewriteEnabledContext);
};