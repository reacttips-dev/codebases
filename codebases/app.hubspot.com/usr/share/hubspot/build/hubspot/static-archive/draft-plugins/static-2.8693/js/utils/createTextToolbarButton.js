'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import SmallToggleButton from '../components/SmallToggleButton';

var createTextToolbarButton = function createTextToolbarButton(_ref) {
  var icon = _ref.icon,
      tooltip = _ref.tooltip,
      _ref$tooltipPlacement = _ref.tooltipPlacement,
      tooltipPlacement = _ref$tooltipPlacement === void 0 ? 'bottom' : _ref$tooltipPlacement;

  var TextToolbarButton = function TextToolbarButton(_ref2) {
    var _ref2$active = _ref2.active,
        active = _ref2$active === void 0 ? false : _ref2$active,
        onClick = _ref2.onClick;
    return /*#__PURE__*/_jsx(SmallToggleButton, {
      active: active,
      icon: icon,
      tooltip: tooltip,
      tooltipPlacement: tooltipPlacement,
      onClick: onClick
    });
  };

  TextToolbarButton.propTypes = {
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };
  return TextToolbarButton;
};

export default createTextToolbarButton;