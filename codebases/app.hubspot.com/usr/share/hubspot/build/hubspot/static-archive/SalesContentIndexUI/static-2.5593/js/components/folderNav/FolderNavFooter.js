'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIButton from 'UIComponents/button/UIButton';

var FolderNavFooter = function FolderNavFooter(_ref) {
  var selectedFolder = _ref.selectedFolder,
      onConfirm = _ref.onConfirm,
      onClose = _ref.onClose;
  return /*#__PURE__*/_jsxs(UIFlex, {
    children: [/*#__PURE__*/_jsx(UIButton, {
      use: "primary",
      onClick: onConfirm,
      disabled: selectedFolder === null,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.tableRowHoverButtons.move"
      })
    }), /*#__PURE__*/_jsx(UIButton, {
      use: "secondary",
      onClick: onClose,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.tableRowHoverButtons.cancel"
      })
    })]
  });
};

FolderNavFooter.propTypes = {
  selectedFolder: PropTypes.instanceOf(SearchResultRecord),
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
export default FolderNavFooter;