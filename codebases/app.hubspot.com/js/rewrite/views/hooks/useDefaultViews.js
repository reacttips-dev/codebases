'use es6';

import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { getDefaultViewsFromTypeDef } from '../utils/getDefaultViewsFromTypeDef';
export var useDefaultViews = function useDefaultViews() {
  var typeDef = useSelectedObjectTypeDef();
  return getDefaultViewsFromTypeDef(typeDef);
};