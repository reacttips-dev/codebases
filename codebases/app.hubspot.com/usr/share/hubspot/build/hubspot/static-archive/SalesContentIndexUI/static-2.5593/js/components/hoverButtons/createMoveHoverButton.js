'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import createFolderNavPrompt from 'SalesContentIndexUI/components/folderNav/createFolderNavPrompt';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
export default (function (searchFetch, folderContentType) {
  var FolderNavPrompt = createFolderNavPrompt(searchFetch, folderContentType);
  return createReactClass({
    propTypes: {
      searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
      alert: PropTypes.element,
      onRemoveFromFolder: PropTypes.func,
      onMoveToFolder: PropTypes.func,
      onClick: PropTypes.func
    },
    handleConfirm: function handleConfirm(selectedFolderId) {
      var _this$props = this.props,
          onRemoveFromFolder = _this$props.onRemoveFromFolder,
          onMoveToFolder = _this$props.onMoveToFolder;

      if (selectedFolderId === 0) {
        onRemoveFromFolder();
      } else {
        onMoveToFolder(selectedFolderId);
      }
    },
    handleMoveClick: function handleMoveClick() {
      var _this$props2 = this.props,
          onClick = _this$props2.onClick,
          searchResult = _this$props2.searchResult,
          alert = _this$props2.alert;

      if (onClick) {
        onClick();
      }

      FolderNavPrompt({
        searchResult: searchResult,
        alert: alert
      }).then(this.handleConfirm).catch(rethrowError);
    },
    render: function render() {
      return /*#__PURE__*/_jsx(UIButton, {
        onClick: this.handleMoveClick,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesContentIndexUI.tableRowHoverButtons.move"
        })
      }, "move");
    }
  });
});