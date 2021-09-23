'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import SearchStatusPropType from 'SalesContentIndexUI/propTypes/SearchStatusPropType';
import SearchQueryRecord from 'SalesContentIndexUI/data/records/SearchQueryRecord';
import SearchStatus from 'SalesContentIndexUI/data/constants/SearchStatus';
import UIPaginator from 'UIComponents/paginator/UIPaginator';
export default createReactClass({
  displayName: "IndexTablePaginator",
  propTypes: {
    searchQuery: PropTypes.instanceOf(SearchQueryRecord).isRequired,
    totalPages: PropTypes.number.isRequired,
    searchStatus: SearchStatusPropType.isRequired,
    getPage: PropTypes.func.isRequired
  },
  handlePageChange: function handlePageChange(_ref) {
    var target = _ref.target;
    var page = target.value - 1;
    this.props.getPage(page);
  },
  render: function render() {
    var _this$props = this.props,
        searchQuery = _this$props.searchQuery,
        totalPages = _this$props.totalPages,
        searchStatus = _this$props.searchStatus;

    if (totalPages <= 1 || searchStatus === SearchStatus.LOADING) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIPaginator, {
      onPageChange: this.handlePageChange,
      page: searchQuery.getCurrentPage(),
      pageCount: totalPages,
      showFirstLastButtons: totalPages > 5
    });
  }
});