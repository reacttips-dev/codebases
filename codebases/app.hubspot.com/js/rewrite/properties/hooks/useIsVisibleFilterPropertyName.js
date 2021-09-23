'use es6';

import { isVisibleFilterProperty } from 'crm_data/properties/GridProperties';
import { useCallback } from 'react';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import { useScopes } from '../../auth/hooks/useScopes';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { useProperties } from './useProperties';
import get from 'transmute/get';
export var useIsVisibleFilterPropertyName = function useIsVisibleFilterPropertyName() {
  var objectTypeId = useSelectedObjectTypeId();
  var hasAllGates = useHasAllGates();
  var hasGate = useCallback(function (gate) {
    return hasAllGates(gate);
  }, [hasAllGates]);
  var scopes = useScopes();
  var properties = useProperties();
  return useCallback(function (propertyName) {
    var property = get(propertyName, properties);

    if (!property) {
      return false;
    }

    return isVisibleFilterProperty(scopes, property, denormalizeTypeId(objectTypeId), hasGate);
  }, [hasGate, objectTypeId, properties, scopes]);
};