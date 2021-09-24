'use es6';

import { useMemo } from 'react';
import { Indexable } from '../../extensions/constants/BehaviorTypes';
import { useHasAllScopes } from '../../rewrite/auth/hooks/useHasAllScopes';
import { useHasAllGates } from '../../rewrite/auth/hooks/useHasAllGates';
import { runBehavior } from '../../extensions/utils/runBehavior';
import { useObjectTypeDefinitions } from './useObjectTypeDefinitions';
export var useAvailableObjectTypes = function useAvailableObjectTypes() {
  var hasAllScopes = useHasAllScopes();
  var hasAllGates = useHasAllGates();
  var typeDefs = useObjectTypeDefinitions();
  return useMemo(function () {
    return typeDefs.filter(function (typeDef) {
      return runBehavior(Indexable, {
        typeDef: typeDef,
        hasAllScopes: hasAllScopes,
        hasAllGates: hasAllGates
      });
    });
  }, [hasAllGates, hasAllScopes, typeDefs]);
};