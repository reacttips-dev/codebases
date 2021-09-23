'use es6';

import { useMemo } from 'react';
import get from 'transmute/get';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
export var getScopeMapping = function getScopeMapping(mappings, requestAction, accessLevel) {
  var scopeMapping = mappings.find(function (mapping) {
    return mapping.accessLevel === accessLevel && mapping.requestAction === requestAction;
  });
  return get('scopeName', scopeMapping) || null;
};
export var useScopeMapping = function useScopeMapping(_ref) {
  var requestAction = _ref.requestAction,
      accessLevel = _ref.accessLevel;

  var _useSelectedObjectTyp = useSelectedObjectTypeDef(),
      scopeMappings = _useSelectedObjectTyp.scopeMappings;

  return useMemo(function () {
    return getScopeMapping(scopeMappings, requestAction, accessLevel);
  }, [accessLevel, requestAction, scopeMappings]);
};