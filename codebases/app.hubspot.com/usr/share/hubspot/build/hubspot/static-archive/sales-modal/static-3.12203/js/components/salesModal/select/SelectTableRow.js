'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import formatName from 'I18n/utils/formatName';
import FormattedRelative from 'I18n/components/FormattedRelative';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import IndexTableRow from 'SalesContentIndexUI/components/IndexTableRow';
import IndexTableRowHoverCellSlot from 'SalesContentIndexUI/slots/IndexTableRowHoverCellSlot';
import IndexTableRowCellSlot from 'SalesContentIndexUI/slots/IndexTableRowCellSlot';
import SelectTableNameCell from './SelectTableNameCell';
export default (function (_ref) {
  var doInsertItem = _ref.doInsertItem;
  return createReactClass({
    propTypes: {
      searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired
    },
    insertItem: function insertItem() {
      doInsertItem(this.props.searchResult);
    },
    renderLastUsedAt: function renderLastUsedAt() {
      var searchResult = this.props.searchResult;
      return searchResult.lastUsedAt ? /*#__PURE__*/_jsx(FormattedRelative, {
        value: searchResult.lastUsedAt
      }) : null;
    },
    renderCreatedBy: function renderCreatedBy() {
      var searchResult = this.props.searchResult;
      return searchResult.userView ? formatName({
        firstName: searchResult.userView.get('firstName'),
        lastName: searchResult.userView.get('lastName')
      }) : null;
    },
    render: function render() {
      var searchResult = this.props.searchResult;
      return /*#__PURE__*/_jsxs(IndexTableRow, {
        searchResult: searchResult,
        onClick: this.insertItem,
        isModal: true,
        children: [/*#__PURE__*/_jsx(IndexTableRowHoverCellSlot, {
          children: /*#__PURE__*/_jsx(SelectTableNameCell, {
            searchResult: searchResult,
            handleSelect: this.insertItem
          })
        }), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
          children: this.renderCreatedBy()
        }), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
          children: this.renderLastUsedAt()
        }), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
          children: /*#__PURE__*/_jsx(FormattedRelative, {
            value: searchResult.updatedAt
          })
        })]
      });
    }
  });
});