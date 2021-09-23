'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import IndexTableFolderRow from 'SalesContentIndexUI/components/IndexTableFolderRow';
import IndexTableRowCellSlot from 'SalesContentIndexUI/slots/IndexTableRowCellSlot';
import OwnerCell from './OwnerCell';

var SequenceFolderRow = function SequenceFolderRow(props) {
  return /*#__PURE__*/_jsxs(IndexTableFolderRow, Object.assign({}, props, {
    children: [/*#__PURE__*/_jsx(IndexTableRowCellSlot, {}), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {}), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {}), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
      children: /*#__PURE__*/_jsx(OwnerCell, {
        searchResult: props.searchResult
      })
    }), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
      children: I18n.moment.userTz(props.searchResult.updatedAt).fromNow()
    })]
  }));
};

SequenceFolderRow.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired
};
export default SequenceFolderRow;