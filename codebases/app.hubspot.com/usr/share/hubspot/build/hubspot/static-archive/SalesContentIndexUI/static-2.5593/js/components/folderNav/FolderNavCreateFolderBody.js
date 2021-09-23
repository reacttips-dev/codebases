'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';

var FolderNavCreateFolderBody = function FolderNavCreateFolderBody(_ref) {
  var folderName = _ref.folderName,
      onFolderNameChange = _ref.onFolderNameChange;
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx("strong", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.folderModal.create.createNewFolder"
      })
    }), /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.folderModal.create.folderName"
      }),
      children: /*#__PURE__*/_jsx(UITextInput, {
        name: "folder-name",
        value: folderName,
        onChange: function onChange(e) {
          return onFolderNameChange(e.target.value);
        }
      })
    })]
  });
};

FolderNavCreateFolderBody.propTypes = {
  folderName: PropTypes.string.isRequired,
  onFolderNameChange: PropTypes.func.isRequired
};
export default FolderNavCreateFolderBody;