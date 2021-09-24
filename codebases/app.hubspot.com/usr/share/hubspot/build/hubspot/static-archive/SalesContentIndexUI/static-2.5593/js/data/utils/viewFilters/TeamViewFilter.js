'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import I18n from 'I18n';
import { List } from 'immutable';
import SearchViewFilterRecord from 'SalesContentIndexUI/data/records/SearchViewFilterRecord';
import filter from 'SalesContentIndexUI/data/utils/filter';
import * as SearchFields from 'SalesContentIndexUI/data/constants/SearchFields';
import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';
import DefaultSort from 'SalesContentIndexUI/data/lib/DefaultSort';

var getTeamFilters = function getTeamFilters(_ref) {
  var looseItemContentType = _ref.looseItemContentType,
      teamIds = _ref.teamIds;
  var filterContentTypeByLooseItems = filter(SearchFields.CONTENT_TYPE_FIELD, looseItemContentType);
  var filterByTeamId = filter.apply(void 0, [SearchFields.TEAM_ID_FIELD].concat(_toConsumableArray(teamIds)));
  return List([filterContentTypeByLooseItems, filterByTeamId]);
};

var hideAllContentFilters = function hideAllContentFilters() {
  var hideLooseItems = filter(SearchFields.CONTENT_TYPE_FIELD);
  var hideFolders = filter(SearchFields.FOLDER_ID_FIELD);
  return List([hideLooseItems, hideFolders]);
};

export var MyTeamViewFilter = function MyTeamViewFilter(_ref2) {
  var looseItemContentType = _ref2.looseItemContentType,
      getTeamIds = _ref2.getTeamIds,
      sort = _ref2.sort,
      useOwnerViewFilters = _ref2.useOwnerViewFilters;
  return SearchViewFilterRecord({
    id: useOwnerViewFilters ? DefaultFilterNames.OWNED_BY_MY_TEAM : DefaultFilterNames.CREATED_BY_MY_TEAM,
    getFilters: function getFilters() {
      var teamIds = getTeamIds();
      return teamIds ? getTeamFilters({
        looseItemContentType: looseItemContentType,
        teamIds: teamIds
      }) : hideAllContentFilters();
    },
    getSort: function getSort() {
      return sort || DefaultSort;
    },
    getDisabledTooltipCopy: function getDisabledTooltipCopy() {
      return I18n.text('salesContentIndexUI.search.notAddedToATeam');
    },
    isDisabled: function isDisabled() {
      return !getTeamIds();
    }
  });
};
export var TeamViewFilter = function TeamViewFilter(_ref3) {
  var looseItemContentType = _ref3.looseItemContentType,
      sort = _ref3.sort,
      id = _ref3.id;
  return SearchViewFilterRecord({
    id: DefaultFilterNames.TEAM + "-" + id,
    type: DefaultFilterNames.TEAM,
    getFilters: function getFilters() {
      return getTeamFilters({
        looseItemContentType: looseItemContentType,
        teamIds: [id]
      });
    },
    getSort: function getSort() {
      return sort || DefaultSort;
    }
  });
};