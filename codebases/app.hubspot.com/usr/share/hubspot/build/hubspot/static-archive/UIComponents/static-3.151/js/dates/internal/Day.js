'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { BATTLESHIP, CALYPSO, CALYPSO_LIGHT, CALYPSO_MEDIUM, OLAF, SORBET_DARK } from 'HubStyleTokens/colors';
import { BUTTON_RADIUS } from 'HubStyleTokens/sizes';
import styled, { css } from 'styled-components';
import UITooltip from '../../tooltip/UITooltip';
import { FONT_FAMILIES } from '../../utils/Styles';
var todayDotMixin = css(["::before{content:' ';display:inline-block;position:absolute;border:2.5px solid currentColor;border-radius:50%;top:22px;left:16px;}"]);
var disabledMixin = css(["::after{content:' ';display:inline-block;position:absolute;top:12px;bottom:0;left:2px;right:13px;border-top:1px solid currentColor;transform:rotate(45deg);}"]);
var Cell = styled.td.withConfig({
  displayName: "Day__Cell",
  componentId: "sc-1ernw8t-0"
})(["position:relative;height:30px;padding:0;cursor:", ";color:", ";background-color:", ";border-radius:", ";", ";", " ", " &:hover{background-color:", ";}"], function (_ref) {
  var isDisabled = _ref.isDisabled;
  return isDisabled ? 'not-allowed' : 'pointer';
}, function (_ref2) {
  var isDisabled = _ref2.isDisabled,
      isSelected = _ref2.isSelected,
      isToday = _ref2.isToday,
      isCurrentMonth = _ref2.isCurrentMonth;
  if (isDisabled) return BATTLESHIP;
  if (isSelected) return OLAF;
  if (!isCurrentMonth) return BATTLESHIP;
  if (isToday) return SORBET_DARK;
  return null;
}, function (_ref3) {
  var isDisabled = _ref3.isDisabled,
      isInRange = _ref3.isInRange,
      isSelected = _ref3.isSelected;
  if (isDisabled) return null;
  if (isSelected) return CALYPSO;
  if (isInRange) return CALYPSO_LIGHT;
  return null;
}, function (_ref4) {
  var isInRange = _ref4.isInRange,
      isRangeStart = _ref4.isRangeStart,
      isRangeEnd = _ref4.isRangeEnd;
  if (isInRange) return null;
  if (isRangeStart && isRangeEnd) return BUTTON_RADIUS;
  if (isRangeStart) return BUTTON_RADIUS + " 0 0 " + BUTTON_RADIUS;
  if (isRangeEnd) return "0 " + BUTTON_RADIUS + " " + BUTTON_RADIUS + " 0";
  return BUTTON_RADIUS;
}, function (_ref5) {
  var isSelected = _ref5.isSelected,
      isToday = _ref5.isToday;
  return isSelected || isToday ? FONT_FAMILIES.demibold : FONT_FAMILIES.medium;
}, function (_ref6) {
  var isToday = _ref6.isToday;
  return isToday && todayDotMixin;
}, function (_ref7) {
  var isDisabled = _ref7.isDisabled;
  return isDisabled && disabledMixin;
}, function (_ref8) {
  var isDisabled = _ref8.isDisabled,
      isInRange = _ref8.isInRange,
      isSelected = _ref8.isSelected;
  return !isDisabled && !isSelected && (isInRange ? CALYPSO_MEDIUM : CALYPSO_LIGHT);
});
export default function Day(props) {
  var tooltip = props.tooltip,
      tooltipOpen = props.tooltipOpen,
      rest = _objectWithoutProperties(props, ["tooltip", "tooltipOpen"]);

  return /*#__PURE__*/_jsx(UITooltip, {
    "aria-live": "polite",
    open: tooltipOpen,
    title: tooltip,
    children: /*#__PURE__*/_jsx(Cell, Object.assign({}, rest))
  });
}
Day.displayName = 'Day';