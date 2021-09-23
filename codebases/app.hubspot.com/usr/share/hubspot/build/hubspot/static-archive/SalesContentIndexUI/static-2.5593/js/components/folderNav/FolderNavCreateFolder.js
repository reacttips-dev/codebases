'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import FolderNavCreateFolderBody from './FolderNavCreateFolderBody';
import FolderNavCreateFolderFooter from './FolderNavCreateFolderFooter';

var FolderNavCreateFolder = function FolderNavCreateFolder(_ref) {
  var createFolderOpen = _ref.createFolderOpen,
      folderName = _ref.folderName,
      onFolderNameChange = _ref.onFolderNameChange,
      onFolderOpenChange = _ref.onFolderOpenChange,
      onSaveFolder = _ref.onSaveFolder;
  return /*#__PURE__*/_jsx(UIPopover, {
    open: createFolderOpen,
    width: 300,
    placement: "bottom right",
    closeOnOutsideClick: true,
    onOpenChange: function onOpenChange(e) {
      return onFolderOpenChange(e.target.value);
    },
    content: {
      body: /*#__PURE__*/_jsx(FolderNavCreateFolderBody, {
        folderName: folderName,
        onFolderNameChange: onFolderNameChange
      }),
      footer: /*#__PURE__*/_jsx(FolderNavCreateFolderFooter, {
        onFolderOpenChange: onFolderOpenChange,
        onSaveFolder: onSaveFolder
      })
    },
    children: /*#__PURE__*/_jsx(UIButton, {
      "aria-pressed": createFolderOpen,
      className: "m-bottom-4 m-top-2 p-all-0",
      use: "transparent",
      onClick: function onClick() {
        return onFolderOpenChange(!createFolderOpen);
      },
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.folderModal.create.createNewFolderButton"
      })
    })
  });
};

FolderNavCreateFolder.propTypes = {
  folderName: PropTypes.string.isRequired,
  createFolderOpen: PropTypes.bool.isRequired,
  onSaveFolder: PropTypes.func.isRequired,
  onFolderOpenChange: PropTypes.func.isRequired,
  onFolderNameChange: PropTypes.func.isRequired
};
export default FolderNavCreateFolder;