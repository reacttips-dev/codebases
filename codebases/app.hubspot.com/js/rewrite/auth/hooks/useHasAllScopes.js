'use es6';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useIsRewriteEnabled } from '../../init/context/IsRewriteEnabledContext';
import { getScopesSet } from '../selectors/authSelectors';
import { hasAllScopes } from '../../../extensions/utils/hasAllScopes';
export var useHasAllScopes = function useHasAllScopes() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var scopesSet = useSelector(getScopesSet); // eslint-disable-next-line react-hooks/rules-of-hooks

    return useCallback(function () {
      for (var _len = arguments.length, scopes = new Array(_len), _key = 0; _key < _len; _key++) {
        scopes[_key] = arguments[_key];
      }

      return scopes.every(function (scope) {
        return scopesSet.has(scope);
      });
    }, [scopesSet]);
  }

  return hasAllScopes;
};