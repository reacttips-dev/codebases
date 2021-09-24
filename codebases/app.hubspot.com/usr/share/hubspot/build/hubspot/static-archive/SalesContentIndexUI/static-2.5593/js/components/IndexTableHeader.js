'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { OrderedSet } from 'immutable';
import partial from 'transmute/partial';
import SearchSortRecord from 'SalesContentIndexUI/data/records/SearchSortRecord';
import UITableActionsRow from 'UIComponents/table/UITableActionsRow';
import IndexTableHeaderCell from './IndexTableHeaderCell';
export default createReactClass({
  displayName: "IndexTableHeader",
  propTypes: {
    currentSort: PropTypes.instanceOf(SearchSortRecord),
    tableColumns: PropTypes.instanceOf(OrderedSet).isRequired,
    renderFolderTableActionButtons: PropTypes.func,
    renderSearchResultTableActionButtons: PropTypes.func,
    selectionData: PropTypes.object.isRequired,
    setSort: PropTypes.func.isRequired,
    isModal: PropTypes.bool.isRequired
  },
  shouldOpenActionsRow: function shouldOpenActionsRow() {
    var _this$props$selection = this.props.selectionData,
        selectedFolders = _this$props$selection.selectedFolders,
        selectedRows = _this$props$selection.selectedRows;
    return !selectedFolders.isEmpty() || !selectedRows.isEmpty();
  },
  renderActionButtons: function renderActionButtons() {
    var _this$props = this.props,
        renderFolderTableActionButtons = _this$props.renderFolderTableActionButtons,
        renderSearchResultTableActionButtons = _this$props.renderSearchResultTableActionButtons,
        selectionData = _this$props.selectionData;
    var selectedFolders = selectionData.selectedFolders,
        selectedRows = selectionData.selectedRows;
    var foldersSelected = !selectedFolders.isEmpty();
    var rowsSelected = !selectedRows.isEmpty();

    if (!foldersSelected && !rowsSelected) {
      return /*#__PURE__*/_jsx("div", {});
    }

    var selectedSize = Math.max(selectedFolders.size, selectedRows.size);
    var renderActionButtons = foldersSelected ? partial(renderFolderTableActionButtons, selectedFolders) : partial(renderSearchResultTableActionButtons, selectedRows);
    return /*#__PURE__*/_jsxs("span", {
      children: [/*#__PURE__*/_jsxs("small", {
        children: [selectedSize, " selected"]
      }), renderActionButtons()]
    });
  },
  renderCheckboxCell: function renderCheckboxCell() {
    var isModal = this.props.isModal;
    return isModal ? null : /*#__PURE__*/_jsx("th", {
      className: "table-check-box-cell"
    });
  },
  renderHeaderCells: function renderHeaderCells() {
    var _this$props2 = this.props,
        tableColumns = _this$props2.tableColumns,
        currentSort = _this$props2.currentSort,
        setSort = _this$props2.setSort;
    return tableColumns.map(function (columnData) {
      return /*#__PURE__*/_jsx(IndexTableHeaderCell, {
        columnData: columnData,
        currentSort: currentSort,
        setSort: setSort
      }, "index.list.table." + columnData.id);
    }).toList();
  },
  render: function render() {
    return /*#__PURE__*/_jsx("thead", {
      className: "sales-content-index-table-header",
      children: /*#__PURE__*/_jsxs(UITableActionsRow, {
        open: this.shouldOpenActionsRow(),
        openAtColumnIndex: 0,
        actions: this.renderActionButtons(),
        children: [this.renderCheckboxCell(), this.renderHeaderCells()]
      })
    });
  }
});