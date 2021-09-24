'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';

var FolderNavSelectedCopy = function FolderNavSelectedCopy(_ref) {
  var searchResult = _ref.searchResult,
      searchResults = _ref.searchResults,
      selectedFolder = _ref.selectedFolder;

  if (!selectedFolder) {
    return /*#__PURE__*/_jsx("div", {});
  }

  if (searchResults) {
    searchResult = searchResults.first();
  }

  return /*#__PURE__*/_jsx("div", {
    className: "m-bottom-3",
    children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "salesContentIndexUI.tableRowHoverButtons.movingItemFromInitialFolderToSelected",
      options: {
        selectedFolderName: selectedFolder.name,
        itemName: searchResult.name,
        count: searchResults ? searchResults.size : 1
      }
    })
  });
};

FolderNavSelectedCopy.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord),
  searchResults: PropTypes.instanceOf(ImmutableMap),
  selectedFolder: PropTypes.instanceOf(SearchResultRecord)
};
export default FolderNavSelectedCopy;