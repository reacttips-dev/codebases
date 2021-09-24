'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';

var createUnstyledPluginButton = function createUnstyledPluginButton(_ref) {
  var text = _ref.text;

  var UnstyledTextButton = function UnstyledTextButton(_ref2) {
    var onClick = _ref2.onClick;
    return /*#__PURE__*/_jsx(UIButton, {
      onClick: onClick,
      children: text
    });
  };

  UnstyledTextButton.propTypes = {
    onClick: PropTypes.func
  };
  return UnstyledTextButton;
};

export default createUnstyledPluginButton;