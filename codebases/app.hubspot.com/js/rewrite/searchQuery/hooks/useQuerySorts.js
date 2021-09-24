'use es6';

import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { getSortsFromView } from '../utils/getSortsFromView';
export var useQuerySorts = function useQuerySorts() {
  var typeDef = useSelectedObjectTypeDef();
  var view = useCurrentView();
  return getSortsFromView(view, typeDef);
};