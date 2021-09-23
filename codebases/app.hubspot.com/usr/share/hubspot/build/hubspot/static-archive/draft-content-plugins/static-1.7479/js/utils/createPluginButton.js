'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { memo } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var createPluginButton = function createPluginButton(_ref) {
  var icon = _ref.icon,
      toolTip = _ref.toolTip,
      testKey = _ref.testKey;

  var PluginButton = function PluginButton(_ref2) {
    var onClick = _ref2.onClick;
    return /*#__PURE__*/_jsx(UITooltip, {
      title: toolTip,
      placement: "bottom",
      children: /*#__PURE__*/_jsx(UIButton, {
        onClick: onClick,
        use: "unstyled",
        "data-test-id": testKey,
        children: /*#__PURE__*/_jsx(UIIcon, {
          name: icon
        })
      })
    });
  };

  PluginButton.propTypes = {
    onClick: PropTypes.func.isRequired
  };
  return /*#__PURE__*/memo(PluginButton);
};

export default createPluginButton;