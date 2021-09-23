'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { SalesContentAppContext } from 'SalesContentIndexUI/containers/SalesContentAppContainer';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIButton from 'UIComponents/button/UIButton';
var RenameFolderTableActionButton = createReactClass({
  displayName: "RenameFolderTableActionButton",
  propTypes: {
    selectedFolder: PropTypes.instanceOf(SearchResultRecord).isRequired,
    onRenameSuccess: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },
  openRenameModal: function openRenameModal() {
    var _this = this;

    var _this$context = this.context,
        openRenameFolderModal = _this$context.openRenameFolderModal,
        closeRenameFolderModal = _this$context.closeRenameFolderModal;
    openRenameFolderModal({
      folder: this.props.selectedFolder,
      onConfirm: function onConfirm(updatedFolder) {
        closeRenameFolderModal();

        _this.props.onRenameSuccess(updatedFolder);
      },
      onReject: closeRenameFolderModal
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(UIButton, {
      use: "link",
      onClick: this.openRenameModal,
      disabled: this.props.disabled,
      "data-selenium-test": "rename-folder-button",
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "edit",
        className: "m-right-2"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.tableControls.rename"
      })]
    });
  }
});
RenameFolderTableActionButton.contextType = SalesContentAppContext;
export default RenameFolderTableActionButton;