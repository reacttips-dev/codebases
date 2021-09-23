'use es6';

import { useMemo } from 'react';
import { useSelectedObjectTypeDef } from '../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useHasAllGates } from '../../rewrite/auth/hooks/useHasAllGates';
import { useHasAllScopes } from '../../rewrite/auth/hooks/useHasAllScopes';
import { runBehavior } from '../utils/runBehavior';
export var useBehavior = function useBehavior(behaviorType) {
  var typeDef = useSelectedObjectTypeDef();
  var hasAllScopes = useHasAllScopes();
  var hasAllGates = useHasAllGates();
  return useMemo(function () {
    return runBehavior(behaviorType, {
      typeDef: typeDef,
      hasAllScopes: hasAllScopes,
      hasAllGates: hasAllGates
    });
  }, [behaviorType, hasAllGates, hasAllScopes, typeDef]);
};