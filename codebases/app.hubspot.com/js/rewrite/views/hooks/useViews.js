'use es6';

import { useSelector } from 'react-redux';
import { getViewsInState } from '../selectors/viewsSelectors';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { getFavoriteColumnsUserSettingsKey } from '../../userSettings/utils/getFavoriteColumnsUserSettingsKey';
import { useUserSetting } from '../../userSettings/hooks/useUserSetting';
import memoizeOne from 'react-utils/memoizeOne';
import get from 'transmute/get';
import pipe from 'transmute/pipe';
import update from 'transmute/update';
import fromJS from 'transmute/fromJS';
import { parseUserSettingsValue } from '../../utils/getSettingsValue';
import { useDefaultViews } from './useDefaultViews';
export var generateViews = memoizeOne(function (viewsInState, defaultViews, favoriteColumns) {
  return viewsInState.withMutations(function (mutableViews) {
    defaultViews.forEach(function (defaultView) {
      var viewId = get('id', defaultView);
      var defaultViewWithColumns = update('columns', function (defaultColumns) {
        return favoriteColumns || defaultColumns;
      }, defaultView);
      return update(viewId, function (view) {
        // If a matching view does not exist in state, don't need to do anything
        if (!view) {
          return defaultViewWithColumns;
        } // If one does, it's tracking changes to a default view. We only allow
        // changes to filters and sorts so those are the only things we use.


        var filters = get('filters', view);
        var state = get('state', view);
        return pipe(update('filters', function (defaultFilters) {
          return filters || defaultFilters;
        }), update('state', function (defaultState) {
          return state || defaultState;
        }))(defaultViewWithColumns);
      }, mutableViews);
    });
  });
});
export var parseColumns = memoizeOne(function (key, value) {
  var parsedValue = parseUserSettingsValue({
    key: key,
    value: value
  });

  if (!parsedValue) {
    return null;
  }

  return fromJS(parsedValue.map(function (name) {
    return {
      name: name
    };
  }));
});
export var useViews = function useViews() {
  var objectTypeId = useSelectedObjectTypeId();
  var viewsInState = useSelector(getViewsInState);
  var defaultViews = useDefaultViews();
  var columnsSettingsKey = getFavoriteColumnsUserSettingsKey(objectTypeId);
  var rawColumnsSetting = useUserSetting(columnsSettingsKey, false);
  return generateViews(viewsInState, defaultViews, parseColumns(columnsSettingsKey, rawColumnsSetting));
};