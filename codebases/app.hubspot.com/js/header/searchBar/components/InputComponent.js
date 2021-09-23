'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import UISearchInput from 'UIComponents/input/UISearchInput';
import UITooltip from 'UIComponents/tooltip/UITooltip';
export var InputComponent = function InputComponent(_ref) {
  var placeholder = _ref.placeholder,
      props = _objectWithoutProperties(_ref, ["placeholder"]);

  return /*#__PURE__*/_jsx(UITooltip, {
    placement: "right",
    title: placeholder,
    children: /*#__PURE__*/_jsx(UISearchInput, Object.assign({
      placeholder: placeholder
    }, props))
  });
};