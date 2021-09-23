'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _ImmutableMap;

import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import SortValues from 'SalesContentIndexUI/data/constants/SortValues';
import SearchSortRecord from 'SalesContentIndexUI/data/records/SearchSortRecord';
import sort from 'SalesContentIndexUI/data/utils/sort';
import TableColumnRecord from 'SalesContentIndexUI/data/records/TableColumnRecord';
import UISortTH from 'UIComponents/table/UISortTH';
var sortOrderNameMap = ImmutableMap((_ImmutableMap = {
  ascending: SortValues.ASC,
  descending: SortValues.DESC
}, _defineProperty(_ImmutableMap, SortValues.ASC, 'ascending'), _defineProperty(_ImmutableMap, SortValues.DESC, 'descending'), _ImmutableMap));

var IndexTableHeaderCell = function IndexTableHeaderCell(_ref) {
  var columnData = _ref.columnData,
      currentSort = _ref.currentSort,
      setSort = _ref.setSort;
  var searchField = columnData.searchField,
      name = columnData.name;

  if (!searchField) {
    return /*#__PURE__*/_jsx("th", {
      children: name
    });
  }

  var selectedSort = currentSort && currentSort.field === searchField ? sortOrderNameMap.get(currentSort.order) : 'none';
  return /*#__PURE__*/_jsx(UISortTH, {
    sort: selectedSort,
    onSortChange: function onSortChange(_ref2) {
      var value = _ref2.target.value;
      return setSort({
        selectedSort: sort(searchField, sortOrderNameMap.get(value))
      });
    },
    children: name
  });
};

IndexTableHeaderCell.propTypes = {
  currentSort: PropTypes.instanceOf(SearchSortRecord),
  columnData: PropTypes.instanceOf(TableColumnRecord).isRequired,
  setSort: PropTypes.func.isRequired
};
export default IndexTableHeaderCell;