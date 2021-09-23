'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { OrderedMap } from 'immutable';
import SearchStatusPropType from 'SalesContentIndexUI/propTypes/SearchStatusPropType';
import SearchQueryRecord from 'SalesContentIndexUI/data/records/SearchQueryRecord';
import SearchViewFilterRecord from 'SalesContentIndexUI/data/records/SearchViewFilterRecord';
import SearchStatus from 'SalesContentIndexUI/data/constants/SearchStatus';
import EmptyStateMessage from './EmptyStateMessage';
import EmptyFolder from './EmptyFolder';
import NoSearchResults from './NoSearchResults';

var IndexTableZeroState = function IndexTableZeroState(_ref) {
  var SuccessMarker = _ref.SuccessMarker,
      totalPages = _ref.totalPages,
      searchQuery = _ref.searchQuery,
      searchStatus = _ref.searchStatus,
      searchResults = _ref.searchResults,
      looseItemContentType = _ref.looseItemContentType,
      selectedViewFilter = _ref.selectedViewFilter;
  var folderFilter = searchQuery.getFolderFilter();

  if (searchStatus === SearchStatus.LOADING || !searchResults.isEmpty()) {
    return /*#__PURE__*/_jsx("div", {});
  }

  if (searchQuery.query !== '') {
    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(SuccessMarker, {}), /*#__PURE__*/_jsx(EmptyStateMessage, {
        contentType: looseItemContentType
      })]
    });
  }

  if (folderFilter && folderFilter.values.size > 0) {
    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(SuccessMarker, {}), /*#__PURE__*/_jsx(EmptyFolder, {})]
    });
  }

  if (totalPages <= 1) {
    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(SuccessMarker, {}), /*#__PURE__*/_jsx(NoSearchResults, {
        contentType: looseItemContentType,
        selectedViewFilter: selectedViewFilter
      })]
    });
  }

  return /*#__PURE__*/_jsx("div", {});
};

IndexTableZeroState.propTypes = {
  SuccessMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  totalPages: PropTypes.number.isRequired,
  searchQuery: PropTypes.instanceOf(SearchQueryRecord).isRequired,
  searchStatus: SearchStatusPropType.isRequired,
  searchResults: PropTypes.instanceOf(OrderedMap).isRequired,
  looseItemContentType: PropTypes.string.isRequired,
  selectedViewFilter: PropTypes.instanceOf(SearchViewFilterRecord).isRequired
};
export default IndexTableZeroState;