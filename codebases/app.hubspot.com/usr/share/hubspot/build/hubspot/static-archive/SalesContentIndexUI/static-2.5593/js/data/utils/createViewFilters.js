'use es6';

import { OrderedMap } from 'immutable';
import AllViewFilter from './viewFilters/AllViewFilter';
import { MyTeamViewFilter } from './viewFilters/TeamViewFilter';
import { MyUserViewFilter } from './viewFilters/UserViewFilter';
import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';
export default (function (_ref) {
  var looseItemContentType = _ref.looseItemContentType,
      folderContentType = _ref.folderContentType,
      getUserId = _ref.getUserId,
      getTeamIds = _ref.getTeamIds,
      additionalViewFilters = _ref.additionalViewFilters,
      useOwnerViewFilters = _ref.useOwnerViewFilters;
  return OrderedMap().set(DefaultFilterNames.ALL, AllViewFilter({
    looseItemContentType: looseItemContentType,
    folderContentType: folderContentType
  })).set(useOwnerViewFilters ? DefaultFilterNames.OWNED_BY_MY_TEAM : DefaultFilterNames.CREATED_BY_MY_TEAM, MyTeamViewFilter({
    looseItemContentType: looseItemContentType,
    getTeamIds: getTeamIds,
    useOwnerViewFilters: useOwnerViewFilters
  })).set(useOwnerViewFilters ? DefaultFilterNames.OWNED_BY_ME : DefaultFilterNames.CREATED_BY_ME, MyUserViewFilter({
    looseItemContentType: looseItemContentType,
    getUserId: getUserId,
    useOwnerViewFilters: useOwnerViewFilters
  })).merge(additionalViewFilters);
});