'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { BATTLESHIP, FLINT } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import UIClickable from '../../button/UIClickable';
import HoverProvider from '../../providers/HoverProvider';
import { setUiTransition } from '../../utils/Styles';

var getBorderColor = function getBorderColor(_ref) {
  var ariaPressed = _ref['aria-pressed'],
      hovered = _ref.hovered,
      active = _ref.active,
      disabled = _ref.disabled;

  if (!disabled) {
    if (ariaPressed || active) return FLINT;
    if (hovered) return BATTLESHIP;
  }

  return 'transparent';
};

var Clickable = styled(function (props) {
  var __hovered = props.hovered,
      __use = props.use,
      __useNativeButton = props._useNativeButton,
      __active = props.active,
      rest = _objectWithoutProperties(props, ["hovered", "use", "_useNativeButton", "active"]);

  return /*#__PURE__*/_jsx(UIClickable, Object.assign({}, rest));
}).withConfig({
  displayName: "SimpleStyledClickable__Clickable",
  componentId: "sc-1gm3xgq-0"
})(["background:", ";border:1px solid ", ";border-radius:3px;display:inline-block;height:27px;padding:0 4px 0 4px;vertical-align:middle;", ";&&{cursor:", ";}"], function (_ref2) {
  var ariaPressed = _ref2['aria-pressed'],
      active = _ref2.active;
  return ariaPressed || active ? BATTLESHIP : '';
}, getBorderColor, setUiTransition(), function (_ref3) {
  var disabled = _ref3.disabled;
  return disabled ? 'not-allowed' : 'initial';
});

var SimpleStyledClickable = function SimpleStyledClickable(props) {
  return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, props, {
    children: function children(hoverProviderProps) {
      return /*#__PURE__*/_jsx(Clickable, Object.assign({}, props, {}, hoverProviderProps));
    }
  }));
};

SimpleStyledClickable.displayName = 'SimpleStyledClickable';
export default SimpleStyledClickable;