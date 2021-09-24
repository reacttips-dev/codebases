'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import IndexTableRow from 'SalesContentIndexUI/components/IndexTableRow';
import IndexTableRowCellSlot from 'SalesContentIndexUI/slots/IndexTableRowCellSlot';
import IndexTableRowHoverCellSlot from 'SalesContentIndexUI/slots/IndexTableRowHoverCellSlot';
import SequenceRowNameCell from './SequenceRowNameCell';
import OwnerCell from './OwnerCell';
import FormattedPercentage from 'I18n/components/FormattedPercentage';

var getPercentage = function getPercentage(value) {
  return value ? 100 * value : 0;
};

var SequenceTableRow = createReactClass({
  displayName: "SequenceTableRow",
  propTypes: {
    searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired
  },
  renderDate: function renderDate(date) {
    return /*#__PURE__*/_jsx("span", {
      children: I18n.moment.userTz(date).fromNow()
    });
  },
  render: function render() {
    var searchResult = this.props.searchResult; // `metadata` could be missing if SalesContentSearch or Sequences BE have
    // issues, so we'll handle that below and leave the columns empty.

    var metadata = searchResult.metadata;
    return /*#__PURE__*/_jsxs(IndexTableRow, Object.assign({}, this.props, {
      children: [/*#__PURE__*/_jsx(IndexTableRowHoverCellSlot, {
        children: /*#__PURE__*/_jsx(SequenceRowNameCell, {
          searchResult: searchResult
        })
      }), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
        fixed: true,
        className: "text-right",
        children: metadata ? "" + (metadata.getIn(['analyticsData', 'total']) || 0) : ''
      }), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
        fixed: true,
        className: "text-right",
        children: metadata ? /*#__PURE__*/_jsx(FormattedPercentage, {
          value: getPercentage(metadata.getIn(['analyticsData', 'repliesPerEnroll']))
        }) : ''
      }), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
        fixed: true,
        className: "text-right",
        children: metadata ? /*#__PURE__*/_jsx(FormattedPercentage, {
          value: getPercentage(metadata.getIn(['analyticsData', 'meetingsPerEnroll']))
        }) : ''
      }), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
        fixed: true,
        children: /*#__PURE__*/_jsx(OwnerCell, {
          searchResult: searchResult
        })
      }), /*#__PURE__*/_jsx(IndexTableRowCellSlot, {
        fixed: true,
        children: this.renderDate(searchResult.updatedAt)
      })]
    }));
  }
});
export default SequenceTableRow;