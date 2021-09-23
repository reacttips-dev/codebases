'use es6';

import { useSelectedObjectTypeId } from '../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import get from 'transmute/get';
import { useObjectTypeDefinitions } from './useObjectTypeDefinitions';
export var useSelectedObjectTypeDef = function useSelectedObjectTypeDef() {
  var objectTypeId = useSelectedObjectTypeId();
  var typeDefs = useObjectTypeDefinitions();
  return get(objectTypeId, typeDefs);
};