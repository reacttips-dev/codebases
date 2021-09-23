'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import useContentSearch from '../../hooks/useContentSearch';
import ContentTypeahead from './ContentTypeahead';

function ContentTypeaheadContainer(_ref) {
  var ErrorState = _ref.ErrorState,
      EmptyState = _ref.EmptyState,
      onChange = _ref.onChange,
      portalId = _ref.portalId,
      searchPlaceHolder = _ref.searchPlaceHolder,
      search = _ref.search,
      transformData = _ref.transformData;

  var _useContentSearch = useContentSearch(search, transformData),
      _useContentSearch2 = _slicedToArray(_useContentSearch, 5),
      __data = _useContentSearch2[0],
      searchQuery = _useContentSearch2[1],
      setSearchQuery = _useContentSearch2[2],
      options = _useContentSearch2[3],
      isLoading = _useContentSearch2[4];

  var handleSearch = useCallback(function (e) {
    return setSearchQuery(e.target.value);
  }, [setSearchQuery]);
  return /*#__PURE__*/_jsx(ContentTypeahead, {
    portalId: portalId,
    ErrorState: ErrorState,
    EmptyState: EmptyState,
    search: searchQuery,
    handleSearch: handleSearch,
    isLoading: isLoading,
    options: options,
    searchPlaceHolder: searchPlaceHolder,
    onChange: onChange
  });
}

ContentTypeaheadContainer.propTypes = {
  ErrorState: PropTypes.func.isRequired,
  EmptyState: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  portalId: PropTypes.number.isRequired,
  searchPlaceHolder: PropTypes.string.isRequired,
  search: PropTypes.func,
  transformData: PropTypes.func.isRequired
};
export default ContentTypeaheadContainer;