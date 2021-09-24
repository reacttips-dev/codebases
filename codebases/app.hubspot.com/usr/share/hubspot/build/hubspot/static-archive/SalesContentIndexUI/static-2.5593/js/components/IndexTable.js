'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { OrderedSet, OrderedMap } from 'immutable';
import SearchStatusPropType from 'SalesContentIndexUI/propTypes/SearchStatusPropType';
import SearchContentTypePropType from 'SalesContentIndexUI/propTypes/SearchContentTypePropType';
import SearchStatus from 'SalesContentIndexUI/data/constants/SearchStatus';
import SearchSortRecord from 'SalesContentIndexUI/data/records/SearchSortRecord';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UITable from 'UIComponents/table/UITable';
import IndexTableColumns from './IndexTableColumns';
import IndexTableHeader from './IndexTableHeader';
export default createReactClass({
  displayName: "IndexTable",
  propTypes: {
    SuccessMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    currentSort: PropTypes.instanceOf(SearchSortRecord),
    tableColumns: PropTypes.instanceOf(OrderedSet).isRequired,
    searchResults: PropTypes.instanceOf(OrderedMap).isRequired,
    selectionData: PropTypes.object.isRequired,
    tableRow: PropTypes.any.isRequired,
    folderRow: PropTypes.any,
    searchStatus: SearchStatusPropType.isRequired,
    folderContentType: SearchContentTypePropType,
    renderFolderTableActionButtons: PropTypes.func,
    renderSearchResultTableActionButtons: PropTypes.func,
    setSort: PropTypes.func.isRequired,
    setSelectedFolder: PropTypes.func.isRequired,
    toggleFolderSelection: PropTypes.func.isRequired,
    toggleRowSelection: PropTypes.func.isRequired,
    isModal: PropTypes.bool.isRequired
  },
  renderSuccessMarker: function renderSuccessMarker() {
    var _this$props = this.props,
        SuccessMarker = _this$props.SuccessMarker,
        searchResults = _this$props.searchResults,
        searchStatus = _this$props.searchStatus;

    if (searchStatus === SearchStatus.LOADING || searchResults.isEmpty()) {
      return null;
    }

    return /*#__PURE__*/_jsx(SuccessMarker, {});
  },
  renderBody: function renderBody() {
    var _this$props2 = this.props,
        tableColumns = _this$props2.tableColumns,
        searchStatus = _this$props2.searchStatus,
        searchResults = _this$props2.searchResults,
        tableRow = _this$props2.tableRow,
        folderRow = _this$props2.folderRow,
        selectionData = _this$props2.selectionData,
        setSelectedFolder = _this$props2.setSelectedFolder,
        folderContentType = _this$props2.folderContentType,
        toggleFolderSelection = _this$props2.toggleFolderSelection,
        toggleRowSelection = _this$props2.toggleRowSelection,
        isModal = _this$props2.isModal;
    var TableRow = tableRow;
    var FolderRow = folderRow;

    if (searchStatus === SearchStatus.LOADING) {
      var colSpan = isModal ? tableColumns.size : tableColumns.size + 1;
      return /*#__PURE__*/_jsx("tr", {
        children: /*#__PURE__*/_jsx("td", {
          colSpan: colSpan,
          children: /*#__PURE__*/_jsx(UIFlex, {
            align: "center",
            children: /*#__PURE__*/_jsx(UILoadingSpinner, {
              grow: true,
              minHeight: 200
            })
          })
        })
      });
    }

    var firstSearchResult = searchResults.first();
    return searchResults.map(function (searchResult) {
      var contentType = searchResult.contentType,
          id = searchResult.id;
      var sharedProps = {
        searchResult: searchResult,
        selectionData: selectionData,
        tableColumns: tableColumns,
        isFirst: searchResult.equals(firstSearchResult)
      };
      var key = "index.row." + id;

      if (folderContentType === contentType && FolderRow) {
        return /*#__PURE__*/_createElement(FolderRow, Object.assign({}, sharedProps, {
          key: key,
          setSelectedFolder: setSelectedFolder,
          toggleFolderSelection: toggleFolderSelection
        }));
      }

      return /*#__PURE__*/_createElement(TableRow, Object.assign({}, sharedProps, {
        key: key,
        toggleRowSelection: toggleRowSelection
      }));
    }).toList();
  },
  render: function render() {
    var _this$props3 = this.props,
        currentSort = _this$props3.currentSort,
        setSort = _this$props3.setSort,
        tableColumns = _this$props3.tableColumns,
        selectionData = _this$props3.selectionData,
        renderFolderTableActionButtons = _this$props3.renderFolderTableActionButtons,
        renderSearchResultTableActionButtons = _this$props3.renderSearchResultTableActionButtons,
        isModal = _this$props3.isModal;
    var className = 'sales-content-table' + (isModal ? " sales-content-table-modal" : "");
    return /*#__PURE__*/_jsxs(UITable, {
      className: className,
      children: [this.renderSuccessMarker(), /*#__PURE__*/_jsx(IndexTableColumns, {
        tableColumns: tableColumns,
        isModal: isModal
      }), /*#__PURE__*/_jsx(IndexTableHeader, {
        currentSort: currentSort,
        setSort: setSort,
        tableColumns: tableColumns,
        selectionData: selectionData,
        renderFolderTableActionButtons: renderFolderTableActionButtons,
        renderSearchResultTableActionButtons: renderSearchResultTableActionButtons,
        isModal: isModal
      }), /*#__PURE__*/_jsx("tbody", {
        children: this.renderBody()
      })]
    });
  }
});