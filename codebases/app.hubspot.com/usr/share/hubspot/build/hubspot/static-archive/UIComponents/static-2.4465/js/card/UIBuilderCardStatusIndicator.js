'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { BUILDER_CARD_STATUS_INDICATOR_COLOR_DEFAULT, BUILDER_CARD_STATUS_INDICATOR_COLOR_ERROR, BUILDER_CARD_STATUS_INDICATOR_COLOR_INFO, BUILDER_CARD_STATUS_INDICATOR_COLOR_WARNING } from './BuilderCardConstants';
import UIIcon from '../icon/UIIcon';
var STATUS_COLORS = {
  default: BUILDER_CARD_STATUS_INDICATOR_COLOR_DEFAULT,
  error: BUILDER_CARD_STATUS_INDICATOR_COLOR_ERROR,
  info: BUILDER_CARD_STATUS_INDICATOR_COLOR_INFO,
  warning: BUILDER_CARD_STATUS_INDICATOR_COLOR_WARNING
};

var getIconName = function getIconName(use) {
  return use === 'info' ? 'info' : 'warning';
};

export default function UIBuilderCardStatusIndicator(_ref) {
  var use = _ref.use,
      rest = _objectWithoutProperties(_ref, ["use"]);

  if (use === 'default') return null;
  return /*#__PURE__*/_jsx(UIIcon, Object.assign({
    name: getIconName(use),
    color: STATUS_COLORS[use],
    size: "xxs"
  }, rest));
}
UIBuilderCardStatusIndicator.propTypes = {
  use: PropTypes.oneOf(Object.keys(STATUS_COLORS))
};
UIBuilderCardStatusIndicator.displayName = 'UIBuilderCardStatusIndicator';