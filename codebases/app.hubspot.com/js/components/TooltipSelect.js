'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import UISelect from 'UIComponents/input/UISelect';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var SelectItemWithTooltip = function SelectItemWithTooltip(_ref) {
  var children = _ref.children,
      option = _ref.option,
      rest = _objectWithoutProperties(_ref, ["children", "option"]);

  return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
    children: /*#__PURE__*/_jsx(UITooltip, {
      placement: option.placement || 'left',
      title: option.tooltip,
      disabled: !option.disabled,
      children: children
    })
  }));
};

var TooltipSelect = function TooltipSelect(props) {
  return /*#__PURE__*/_jsx(UISelect, Object.assign({
    itemComponent: SelectItemWithTooltip
  }, props));
};

export default TooltipSelect;