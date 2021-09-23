'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import partial from 'transmute/partial';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import UIFolderNavItem from 'UIComponents/nav/UIFolderNavItem';

var getEmptyFolder = function getEmptyFolder() {
  return SearchResultRecord({
    name: I18n.text('salesContentIndexUI.tableRowHoverButtons.noFolder'),
    contentId: 0
  });
};

var FolderNavNoFolderItem = function FolderNavNoFolderItem(_ref) {
  var isInitialFetchLoading = _ref.isInitialFetchLoading,
      setSelectedFolder = _ref.setSelectedFolder;

  if (isInitialFetchLoading) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIFolderNavItem, {
    open: false,
    value: 0,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "salesContentIndexUI.tableRowHoverButtons.noFolder"
    }),
    onClick: partial(setSelectedFolder, getEmptyFolder())
  }, "no-folder-item");
};

FolderNavNoFolderItem.propTypes = {
  isInitialFetchLoading: PropTypes.bool.isRequired,
  setSelectedFolder: PropTypes.func.isRequired
};
export default FolderNavNoFolderItem;