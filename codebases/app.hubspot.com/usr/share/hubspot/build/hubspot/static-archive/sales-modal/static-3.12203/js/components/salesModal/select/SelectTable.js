'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import compose from 'transmute/compose';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import pluck from 'transmute/pluck';
import createConnectedIndexTableContainer from 'SalesContentIndexUI/containers/createConnectedIndexTableContainer';
import DefaultSort from 'SalesContentIndexUI/data/lib/DefaultSort';
import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';
import sort from 'SalesContentIndexUI/data/utils/sort';
import * as SearchApi from 'sales-modal/api/SearchApi';
import ZeroState from 'sales-modal/components/salesModal/zeroStates/ZeroState';
import SelectTableRow from './SelectTableRow';
import SelectFolderRow from './SelectFolderRow';
import getAdditionalViewFilters from 'sales-modal/lib/getAdditionalViewFilters';
import SelectTableColumns from 'sales-modal/lib/SelectTableColumns';
import ZeroStates from 'sales-modal/lib/ZeroStates';
import Checker from 'sales-modal/lib/Checker';
import * as localSettings from 'sales-modal/lib/localSettings';
import { trackSalesModalIndexInteraction as _trackSalesModalIndexInteraction } from 'sales-modal/utils/enrollModal/UsageLogger';
import * as SalesModalTabs from 'sales-modal/constants/SalesModalTabs';
import * as SalesModalSearchContentTypes from 'sales-modal/constants/SalesModalSearchContentTypes';
import * as SalesModalSearchLimits from 'sales-modal/constants/SalesModalSearchLimits';
import * as LocalStorageKeys from 'sales-modal/constants/LocalStorageKeys';
import getAllContentFilterList from 'sales-modal/lib/getAllContentFilterList';
var searchFetch = SearchApi.search;

function storeViewFilterInLocalStorage(looseItemContentType, selectedViewFilter) {
  var id = selectedViewFilter.id;
  var updatedViewFilter = Object.assign({}, localSettings.get(LocalStorageKeys.SELECT_TABLE_VIEW_FILTER), _defineProperty({}, looseItemContentType, {
    id: id
  }));
  localSettings.set(LocalStorageKeys.SELECT_TABLE_VIEW_FILTER, updatedViewFilter);
}

function storeSortInLocalStorage(looseItemContentType, selectedSort) {
  var field = selectedSort.field,
      order = selectedSort.order;
  var updatedSort = Object.assign({}, localSettings.get(LocalStorageKeys.SELECT_TABLE_SORT), _defineProperty({}, looseItemContentType, {
    field: field,
    order: order
  }));
  localSettings.set(LocalStorageKeys.SELECT_TABLE_SORT, updatedSort);
}

var SelectTable = createReactClass({
  displayName: "SelectTable",
  propTypes: {
    currentTab: PropTypes.oneOf(Object.values(SalesModalTabs || {})).isRequired,
    teams: PropTypes.instanceOf(List).isRequired,
    userId: PropTypes.string.isRequired,
    doInsertItem: PropTypes.func,
    showBanner: PropTypes.bool.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      SelectTableContainer: this.buildConnectedIndexTableContainer(this.props.currentTab, this.props.showBanner)
    };
  },
  trackSalesModalIndexInteraction: function trackSalesModalIndexInteraction(action, contentType) {
    _trackSalesModalIndexInteraction(contentType, action);
  },
  getContentTypes: function getContentTypes(currentTab) {
    return {
      folderContentType: SalesModalSearchContentTypes[currentTab + "_FOLDER"],
      looseItemContentType: SalesModalSearchContentTypes[currentTab]
    };
  },
  getSort: function getSort(looseItemContentType) {
    var currentSort = localSettings.get(LocalStorageKeys.SELECT_TABLE_SORT);

    if (currentSort && currentSort[looseItemContentType]) {
      var _currentSort$looseIte = currentSort[looseItemContentType],
          field = _currentSort$looseIte.field,
          order = _currentSort$looseIte.order;
      return sort(field, order);
    }

    return DefaultSort;
  },
  getViewFilterName: function getViewFilterName(looseItemContentType) {
    var currentViewFilterName = localSettings.get(LocalStorageKeys.SELECT_TABLE_VIEW_FILTER);

    if (currentViewFilterName && currentViewFilterName[looseItemContentType]) {
      var id = currentViewFilterName[looseItemContentType].id;
      return id;
    }

    return DefaultFilterNames.CREATED_BY_ME;
  },
  getNumberOfRows: function getNumberOfRows(currentTab, showBanner) {
    var rows = currentTab === SalesModalTabs.DOCUMENTS ? SalesModalSearchLimits.DOCUMENTS : SalesModalSearchLimits.DEFAULT;
    return showBanner ? rows : rows + 1;
  },
  setSort: function setSort(looseItemContentType, selectedSort) {
    var field = selectedSort.field;
    storeSortInLocalStorage(looseItemContentType, selectedSort);
    this.trackSalesModalIndexInteraction("sort-content-" + field, looseItemContentType);
  },
  setViewFilter: function setViewFilter(looseItemContentType, selectedViewFilter) {
    var id = selectedViewFilter.id;
    storeViewFilterInLocalStorage(looseItemContentType, selectedViewFilter);
    storeSortInLocalStorage(looseItemContentType, selectedViewFilter.getSort());
    this.trackSalesModalIndexInteraction("filter-content-" + id, looseItemContentType);
  },
  setFolder: function setFolder(looseItemContentType) {
    this.trackSalesModalIndexInteraction("set-folder", looseItemContentType);
  },
  setSearch: function setSearch(looseItemContentType) {
    this.trackSalesModalIndexInteraction("set-search", looseItemContentType);
  },
  buildConnectedIndexTableContainer: function buildConnectedIndexTableContainer(currentTab, showBanner) {
    var _this$props = this.props,
        teams = _this$props.teams,
        doInsertItem = _this$props.doInsertItem,
        userId = _this$props.userId;

    var _this$getContentTypes = this.getContentTypes(currentTab),
        folderContentType = _this$getContentTypes.folderContentType,
        looseItemContentType = _this$getContentTypes.looseItemContentType;

    var getEmptyState = function getEmptyState() {
      return /*#__PURE__*/_jsx(ZeroState, Object.assign({}, ZeroStates[currentTab]));
    };

    return createConnectedIndexTableContainer({
      searchFetch: searchFetch,
      folderContentType: folderContentType,
      looseItemContentType: looseItemContentType,
      getUserId: function getUserId() {
        return userId;
      },
      getTeamIds: function getTeamIds() {
        return teams.size ? pluck('id', teams).toJS() : null;
      },
      tableColumns: SelectTableColumns,
      EmptyState: function EmptyState() {
        return getEmptyState();
      },
      TableRow: SelectTableRow({
        doInsertItem: doInsertItem
      }),
      FolderRow: SelectFolderRow,
      additionalViewFilters: getAdditionalViewFilters({
        looseItemContentType: looseItemContentType
      }),
      allContentFilterList: getAllContentFilterList(looseItemContentType),
      isModal: true,
      searchOptions: {
        currentSort: this.getSort(looseItemContentType),
        currentViewFilterName: this.getViewFilterName(looseItemContentType),
        onSetSort: this.setSort,
        onSetViewFilter: this.setViewFilter,
        onSetFolder: this.setFolder,
        onSearch: this.setSearch,
        searchLimit: this.getNumberOfRows(currentTab, showBanner)
      }
    });
  },
  render: function render() {
    var SelectTableContainer = this.state.SelectTableContainer;
    return /*#__PURE__*/_jsx(SelectTableContainer, {});
  }
});
export default compose(Checker({
  selectorName: 'sales-modal-table',
  successSelectors: '.sales-content-table .table-row, .sales-content-table .sales-content-index-folder-row, .sales-content-index-zero-state',
  errorSelectors: '.sales-content-table-error-state',
  rateLimit: true
}), connect(function (state) {
  return {
    userId: state.salesModalInterface.user && "" + state.salesModalInterface.user.get('user_id')
  };
}))(SelectTable);