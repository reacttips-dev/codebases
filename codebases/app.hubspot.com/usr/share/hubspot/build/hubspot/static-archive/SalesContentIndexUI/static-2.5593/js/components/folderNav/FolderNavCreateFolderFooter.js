'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';

var FolderNavCreateFolderFooter = function FolderNavCreateFolderFooter(_ref) {
  var onSaveFolder = _ref.onSaveFolder,
      onFolderOpenChange = _ref.onFolderOpenChange;
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(UIButton, {
      use: "tertiary",
      size: "extra-small",
      onClick: onSaveFolder,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.folderModal.create.save"
      })
    }), /*#__PURE__*/_jsx(UIButton, {
      use: "tertiary-light",
      size: "extra-small",
      onClick: function onClick() {
        return onFolderOpenChange(false);
      },
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.folderModal.create.cancel"
      })
    })]
  });
};

FolderNavCreateFolderFooter.propTypes = {
  onSaveFolder: PropTypes.func.isRequired,
  onFolderOpenChange: PropTypes.func.isRequired
};
export default FolderNavCreateFolderFooter;