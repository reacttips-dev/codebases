'use es6';

import { createSelector } from 'reselect';
import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';
import { FilterOptionTypes } from 'ui-asset-management-lib/components/tableFilters/Constants';

var getViewFilters = function getViewFilters(state) {
  return state.viewFilters;
};

export var getIsCustomTeamOptionDisabled = createSelector([getViewFilters], function (viewFilters) {
  var filter = viewFilters.get(DefaultFilterNames.CREATED_BY_MY_TEAM) || viewFilters.get(DefaultFilterNames.OWNED_BY_MY_TEAM);
  return filter.isDisabled();
});

var viewToOption = function viewToOption(view) {
  return {
    text: view.getTitle(),
    value: view.id,
    type: FilterOptionTypes.CUSTOM,
    disabled: view.isDisabled()
  };
};

export var getAdditionalOptions = createSelector([getViewFilters], function (viewFilters) {
  return viewFilters.filter(function (__view, key) {
    return !Object.values(DefaultFilterNames).includes(key);
  }).map(viewToOption).valueSeq().toArray();
});