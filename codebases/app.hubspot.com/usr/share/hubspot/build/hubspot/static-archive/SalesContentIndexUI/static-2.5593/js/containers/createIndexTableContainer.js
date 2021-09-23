'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import { OrderedMap } from 'immutable';
import connect from 'SalesContentIndexUI/data/redux/connect';
import identity from 'transmute/identity';
import SearchStatusPropType from 'SalesContentIndexUI/propTypes/SearchStatusPropType';
import SearchQueryRecord from 'SalesContentIndexUI/data/records/SearchQueryRecord';
import SearchSortRecord from 'SalesContentIndexUI/data/records/SearchSortRecord';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import SearchViewFilterRecord from 'SalesContentIndexUI/data/records/SearchViewFilterRecord';
import { INITIALIZING, LOADING, EMPTY, ERROR } from 'SalesContentIndexUI/data/constants/TableContentState';
import TableContentStatePropType from 'SalesContentIndexUI/data/constants/TableContentStatePropType';
import * as SelectionActions from 'SalesContentIndexUI/data/actions/SelectionActions';
import { calculateTotalPages, selectSearchResultsForCurrentPage } from 'SalesContentIndexUI/data/redux/selectors/searchSelectors';
import { selectTableContentState } from 'SalesContentIndexUI/data/redux/selectors/tableStateSelectors';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import IndexTableNavigator from 'SalesContentIndexUI/components/IndexTableNavigator';
import IndexTable from 'SalesContentIndexUI/components/IndexTable';
import IndexTablePaginator from 'SalesContentIndexUI/components/IndexTablePaginator';
import IndexErrorState from 'SalesContentIndexUI/components/IndexErrorState';
import IndexTableZeroState from 'SalesContentIndexUI/components/zeroStates/IndexTableZeroState';
var externalPropTypes = {
  SuccessMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  FailureMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  count: PropTypes.number,
  renderFolderTableActionButtons: PropTypes.func,
  renderSearchResultTableActionButtons: PropTypes.func,
  onViewFilterSelected: PropTypes.func,
  onTableContentStateChanged: PropTypes.func,
  location: PropTypes.object,
  saveFolder: PropTypes.func,
  showNewFolderButton: PropTypes.bool
};
export default (function (_ref) {
  var folderContentType = _ref.folderContentType,
      tableColumns = _ref.tableColumns,
      TableRow = _ref.TableRow,
      FolderRow = _ref.FolderRow,
      EmptyState = _ref.EmptyState,
      isModal = _ref.isModal,
      looseItemContentType = _ref.looseItemContentType,
      useOwnerViewFilters = _ref.useOwnerViewFilters;
  var IndexTableContainer = createReactClass({
    displayName: "IndexTableContainer",
    propTypes: Object.assign({}, externalPropTypes, {
      searchQuery: PropTypes.instanceOf(SearchQueryRecord).isRequired,
      currentSort: PropTypes.instanceOf(SearchSortRecord),
      selectedViewFilter: PropTypes.instanceOf(SearchViewFilterRecord).isRequired,
      searchResults: PropTypes.instanceOf(OrderedMap).isRequired,
      searchStatus: SearchStatusPropType.isRequired,
      selectionData: PropTypes.object.isRequired,
      selectedFolder: PropTypes.instanceOf(SearchResultRecord),
      totalPages: PropTypes.number.isRequired,
      searchFromModal: PropTypes.func.isRequired,
      searchFromQueryParams: PropTypes.func.isRequired,
      setSearchQuery: PropTypes.func.isRequired,
      setSort: PropTypes.func.isRequired,
      setSelectedFolder: PropTypes.func.isRequired,
      setViewFilter: PropTypes.func.isRequired,
      getPage: PropTypes.func.isRequired,
      toggleFolderSelection: PropTypes.func.isRequired,
      toggleRowSelection: PropTypes.func.isRequired,
      tableContentState: TableContentStatePropType.isRequired
    }),
    contextTypes: {
      location: PropTypes.object
    },
    getDefaultProps: function getDefaultProps() {
      return {
        onTableContentStateChanged: identity,
        SuccessMarker: function SuccessMarker() {
          return null;
        },
        FailureMarker: function FailureMarker() {
          return null;
        }
      };
    },
    UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
      if (isModal) {
        this.props.searchFromModal({
          isInitial: true
        });
      } else {
        this.props.searchFromQueryParams({
          queryParams: this.context.location.query,
          isInitial: true
        });
      }
    },
    componentDidMount: function componentDidMount() {
      if (this.props.tableContentState !== LOADING) {
        this.props.onTableContentStateChanged(this.props.tableContentState);
      }
    },
    componentDidUpdate: function componentDidUpdate(prevProps) {
      if (prevProps.tableContentState !== this.props.tableContentState) {
        this.props.onTableContentStateChanged(this.props.tableContentState);
      }
    },
    render: function render() {
      var _this$props = this.props,
          SuccessMarker = _this$props.SuccessMarker,
          FailureMarker = _this$props.FailureMarker,
          searchQuery = _this$props.searchQuery,
          currentSort = _this$props.currentSort,
          selectedViewFilter = _this$props.selectedViewFilter,
          searchStatus = _this$props.searchStatus,
          searchResults = _this$props.searchResults,
          totalPages = _this$props.totalPages,
          selectionData = _this$props.selectionData,
          selectedFolder = _this$props.selectedFolder,
          setSelectedFolder = _this$props.setSelectedFolder,
          renderFolderTableActionButtons = _this$props.renderFolderTableActionButtons,
          renderSearchResultTableActionButtons = _this$props.renderSearchResultTableActionButtons,
          onViewFilterSelected = _this$props.onViewFilterSelected,
          setSearchQuery = _this$props.setSearchQuery,
          setSort = _this$props.setSort,
          _setViewFilter = _this$props.setViewFilter,
          getPage = _this$props.getPage,
          tableContentState = _this$props.tableContentState,
          toggleFolderSelection = _this$props.toggleFolderSelection,
          toggleRowSelection = _this$props.toggleRowSelection,
          location = _this$props.location,
          saveFolder = _this$props.saveFolder,
          showNewFolderButton = _this$props.showNewFolderButton;

      if (tableContentState === INITIALIZING) {
        return /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true,
          style: {
            minHeight: 300
          }
        });
      }

      if (tableContentState === ERROR) {
        return /*#__PURE__*/_jsx(IndexErrorState, {
          FailureMarker: FailureMarker
        });
      }

      if (tableContentState === EMPTY) {
        return /*#__PURE__*/_jsxs(Fragment, {
          children: [/*#__PURE__*/_jsx(SuccessMarker, {}), /*#__PURE__*/_jsx(EmptyState, {})]
        });
      }

      return /*#__PURE__*/_jsxs("div", {
        className: "sales-content-index-table-container",
        children: [/*#__PURE__*/_jsx(IndexTableNavigator, {
          selectedViewFilterId: selectedViewFilter.id,
          selectedFolder: selectedFolder,
          searchQuery: searchQuery,
          setSearchQuery: setSearchQuery,
          setSelectedFolder: setSelectedFolder,
          setViewFilter: function setViewFilter(viewFilter, id) {
            _setViewFilter(viewFilter, id);

            if (onViewFilterSelected) {
              onViewFilterSelected(viewFilter);
            }
          },
          isModal: isModal,
          looseItemContentType: looseItemContentType,
          useOwnerViewFilters: useOwnerViewFilters,
          location: location,
          saveFolder: saveFolder,
          showNewFolderButton: showNewFolderButton
        }), /*#__PURE__*/_jsx(IndexTable, {
          SuccessMarker: SuccessMarker,
          tableColumns: tableColumns,
          searchStatus: searchStatus,
          currentSort: currentSort,
          searchResults: searchResults,
          tableRow: TableRow,
          folderRow: FolderRow,
          selectionData: selectionData,
          renderFolderTableActionButtons: renderFolderTableActionButtons,
          renderSearchResultTableActionButtons: renderSearchResultTableActionButtons,
          folderContentType: folderContentType,
          setSearchQuery: setSearchQuery,
          setSort: setSort,
          setSelectedFolder: setSelectedFolder,
          toggleFolderSelection: toggleFolderSelection,
          toggleRowSelection: toggleRowSelection,
          isModal: isModal
        }), /*#__PURE__*/_jsx(IndexTableZeroState, {
          SuccessMarker: SuccessMarker,
          selectedViewFilter: selectedViewFilter,
          totalPages: totalPages,
          searchQuery: searchQuery,
          searchResults: searchResults,
          searchStatus: searchStatus,
          looseItemContentType: looseItemContentType
        }), /*#__PURE__*/_jsx(IndexTablePaginator, {
          searchQuery: searchQuery,
          totalPages: totalPages,
          searchStatus: searchStatus,
          getPage: getPage
        })]
      });
    }
  });
  return connect(function (_ref2, _ref3) {
    var search = _ref2.search,
        selectionData = _ref2.selectionData;
    var count = _ref3.count;
    return {
      searchQuery: search.searchQuery,
      currentSort: search.currentSort,
      selectedViewFilter: search.selectedViewFilter,
      searchResults: selectSearchResultsForCurrentPage(search),
      searchStatus: search.searchStatus,
      totalPages: calculateTotalPages(search),
      selectedFolder: search.selectedFolder,
      selectionData: selectionData,
      tableContentState: selectTableContentState(count)(search)
    };
  }, SelectionActions)(IndexTableContainer);
});