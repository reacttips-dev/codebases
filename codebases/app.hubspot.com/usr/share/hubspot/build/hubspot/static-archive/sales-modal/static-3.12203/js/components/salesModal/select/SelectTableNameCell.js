'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import IndexTableRowHoverCell from 'SalesContentIndexUI/components/IndexTableRowHoverCell';
import IndexTableRowHoverButtonsSlot from 'SalesContentIndexUI/slots/IndexTableRowHoverButtonsSlot';
import UILink from 'UIComponents/link/UILink';
import SelectHoverButton from './SelectHoverButton';

var SelectTableNameCell = function SelectTableNameCell(props) {
  return /*#__PURE__*/_jsx(IndexTableRowHoverCell, {
    content: /*#__PURE__*/_jsx(UILink, {
      "data-test-id": "tableNameCell",
      children: props.searchResult.name
    }),
    buttons: /*#__PURE__*/_jsx(IndexTableRowHoverButtonsSlot, {
      children: /*#__PURE__*/_jsx(SelectHoverButton, {
        onSelect: props.handleSelect
      })
    })
  });
};

SelectTableNameCell.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
  handleSelect: PropTypes.func.isRequired
};
export default SelectTableNameCell;