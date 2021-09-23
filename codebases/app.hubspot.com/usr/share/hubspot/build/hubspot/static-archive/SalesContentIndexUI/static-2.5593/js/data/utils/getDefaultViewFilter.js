'use es6';

import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';
import { UserViewFilter } from 'SalesContentIndexUI/data/utils/viewFilters/UserViewFilter';
import { TeamViewFilter } from 'SalesContentIndexUI/data/utils/viewFilters/TeamViewFilter';
import * as FilterTypes from 'SalesContentIndexUI/data/lib/FilterTypes';

var parseSelection = function parseSelection(selectedViewFilterId) {
  var userAndTeamRegExp = /(USER|TEAM)-(\d+)/;
  return userAndTeamRegExp.test(selectedViewFilterId) ? {
    id: Number(userAndTeamRegExp.exec(selectedViewFilterId)[2]),
    view: userAndTeamRegExp.exec(selectedViewFilterId)[1]
  } : {
    view: selectedViewFilterId
  };
};

export default (function (_ref) {
  var viewFilters = _ref.viewFilters,
      currentViewFilterName = _ref.currentViewFilterName,
      isModal = _ref.isModal,
      looseItemContentType = _ref.looseItemContentType;

  if (currentViewFilterName) {
    var _parseSelection = parseSelection(currentViewFilterName),
        id = _parseSelection.id,
        view = _parseSelection.view;

    if (!id) {
      return viewFilters.get(view);
    }

    var ViewFilter = view === FilterTypes.USER ? UserViewFilter : TeamViewFilter;
    return ViewFilter({
      looseItemContentType: looseItemContentType,
      id: id
    });
  }

  return isModal ? viewFilters.get(DefaultFilterNames.CREATED_BY_ME) : viewFilters.get(DefaultFilterNames.ALL);
});