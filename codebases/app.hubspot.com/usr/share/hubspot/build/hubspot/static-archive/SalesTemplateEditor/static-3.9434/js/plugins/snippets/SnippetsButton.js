'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIDropdownCaret from 'UIComponents/dropdown/UIDropdownCaret';

var SnippetsButton = function SnippetsButton(_ref) {
  var onClick = _ref.onClick;
  return /*#__PURE__*/_jsxs(UIButton, {
    use: "transparent",
    onClick: onClick,
    children: [/*#__PURE__*/_jsx(UIIcon, {
      name: "textSnippet"
    }), /*#__PURE__*/_jsx(FormattedMessage, {
      message: "draftPlugins.snippetsPlugin.button"
    }), /*#__PURE__*/_jsx(UIDropdownCaret, {})]
  });
};

SnippetsButton.propTypes = {
  onClick: PropTypes.func.isRequired
};
export default SnippetsButton;