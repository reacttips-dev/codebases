'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedRelative from 'I18n/components/FormattedRelative';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import IndexTableFolderRow from 'SalesContentIndexUI/components/IndexTableFolderRow';
import IndexTableRowCellSlot from 'SalesContentIndexUI/slots/IndexTableRowCellSlot';

var SelectFolderRow = function SelectFolderRow(props) {
  return /*#__PURE__*/_jsxs(IndexTableFolderRow, Object.assign({}, props, {
    isModal: true,
    children: [/*#__PURE__*/_jsx(IndexTableRowCellSlot, {}), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {}), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
      children: /*#__PURE__*/_jsx(FormattedRelative, {
        value: props.searchResult.createdAt
      })
    })]
  }));
};

SelectFolderRow.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired
};
export default SelectFolderRow;