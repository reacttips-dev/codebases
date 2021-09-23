'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'transmute/debounce';
import UISearchInput from 'UIComponents/input/UISearchInput';
import { GYPSUM } from 'HubStyleTokens/colors';
var SearchWrapper = styled.div.withConfig({
  displayName: "CalleeSearchInput__SearchWrapper",
  componentId: "sc-11y3ct5-0"
})(["background-color:", ";"], GYPSUM);

function CalleeSearchInput(_ref) {
  var onClear = _ref.onClear,
      onSearch = _ref.onSearch,
      setSearchText = _ref.setSearchText,
      searchText = _ref.searchText;
  var debouncedSearchRef = useRef(null);
  var debouncedSearch = useMemo(function () {
    return debounce(500, function (value) {
      var trimmedValue = value.trim();

      if (!trimmedValue) {
        onClear();
      } else if (trimmedValue.length >= 3) {
        onSearch({
          query: trimmedValue,
          timestamp: Date.now()
        });
      } else {
        setSearchText(trimmedValue);
      }
    });
  }, [onClear, onSearch, setSearchText]);
  debouncedSearchRef.current = debouncedSearch;
  var handleSearchChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    return debouncedSearchRef.current(value);
  }, []);
  return /*#__PURE__*/_jsx(SearchWrapper, {
    className: "p-all-3",
    children: /*#__PURE__*/_jsx(UISearchInput, {
      onChange: handleSearchChange,
      defaultValue: searchText,
      use: "on-dark",
      "data-selenium-test": "callees-search-input"
    })
  });
}

CalleeSearchInput.propTypes = {
  onClear: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  setSearchText: PropTypes.func.isRequired,
  searchText: PropTypes.string
};
export default /*#__PURE__*/memo(CalleeSearchInput);