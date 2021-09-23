'use es6';

import { css } from 'styled-components';
import { rgba } from '../core/Color';
import { remCalc } from '../core/Style';
import { toShorthandSize } from './propTypes/tshirtSize';
import { INPUT_VERTICAL_ALIGNMENT, FALLBACK_FONT_STACK, WEB_FONT_BOLD, WEB_FONT_BOLD_WEIGHT, WEB_FONT_DEMI_BOLD, WEB_FONT_DEMI_BOLD_WEIGHT, WEB_FONT_MEDIUM, WEB_FONT_MEDIUM_WEIGHT, WEB_FONT_ITALIC, WEB_FONT_ITALIC_WEIGHT, WEB_FONT_REGULAR, WEB_FONT_REGULAR_WEIGHT } from 'HubStyleTokens/misc';
import { BASE_SHADOW_ALPHA, BASE_SHADOW_BLUR_RADIUS, BASE_SHADOW_OFFSET_Y, BUTTON_RADIUS, BUTTON_DEFAULT_PADDING_Y, BUTTON_DEFAULT_PADDING_X, GRID_BREAKPOINT_SMALL, DISTANCE_MEASUREMENT_EXTRA_SMALL, DISTANCE_MEASUREMENT_SMALL, DISTANCE_MEASUREMENT_MEDIUM, DISTANCE_MEASUREMENT_LARGE, DISTANCE_MEASUREMENT_EXTRA_LARGE, LAYOUT_MAX_WIDTH, LAYOUT_PADDING_X, FOCUS_RING_SHADOW_ALPHA, FOCUS_RING_SHADOW_SIZES, FOCUS_RING_SHADOW_LAST_SIZES, INPUT_DEFAULT_HEIGHT, INPUT_BORDER_WIDTH, INPUT_FONT_SIZE } from 'HubStyleTokens/sizes';
import { FOCUS_RING_BASE } from 'HubStyleTokens/colors';
import { BASE_SHADOW_COLOR, FORM_CONTROL_FOREGROUND_COLOR, FORM_CONTROL_BACKGROUND_COLOR, FORM_CONTROL_BORDER_COLOR } from 'HubStyleTokens/theme';
import { MICRO_TRANSITION_TIMING } from 'HubStyleTokens/times';
export var setFontSize = function setFontSize(size) {
  return css(["font-size:", ";"], remCalc(size));
};
export var setFontSmoothing = function setFontSmoothing(smoothing) {
  var computedSmoothing = smoothing || 'antialiased'; // No `css` wrapper for this mixin, due to a bug in styled-components v3

  return "\n    -webkit-font-smoothing: " + computedSmoothing + ";\n    -moz-osx-font-smoothing: " + (computedSmoothing === 'antialiased' ? 'grayscale' : computedSmoothing) + ";\n  ";
}; // note: just a template literal, not using css function

export var setFontStack = function setFontStack(family) {
  return "\n  font-family: '" + family + "', " + FALLBACK_FONT_STACK + ";\n";
};
export var FONT_FAMILIES = {
  bold: function bold() {
    return "\n        " + setFontStack(WEB_FONT_BOLD) + ";\n        font-weight: " + WEB_FONT_BOLD_WEIGHT + ";\n      ";
  },
  demibold: function demibold() {
    return "\n        " + setFontStack(WEB_FONT_DEMI_BOLD) + ";\n        font-weight: " + WEB_FONT_DEMI_BOLD_WEIGHT + ";\n      ";
  },
  medium: function medium() {
    return "\n        " + setFontStack(WEB_FONT_MEDIUM) + ";\n        font-weight: " + WEB_FONT_MEDIUM_WEIGHT + ";\n      ";
  },
  italic: function italic() {
    return "\n        " + setFontStack(WEB_FONT_ITALIC) + ";\n        font-style: italic;\n        font-weight: " + WEB_FONT_ITALIC_WEIGHT + ";\n      ";
  },
  default: function _default() {
    return "\n        " + setFontStack(WEB_FONT_REGULAR) + ";\n        font-weight: " + WEB_FONT_REGULAR_WEIGHT + ";\n      ";
  }
};
export var setUiTransition = function setUiTransition(property, timing) {
  var computedTiming = timing || MICRO_TRANSITION_TIMING;
  var computedProperty = property || 'all';
  return css(["transition:", " ", " ease-out;"], computedProperty, computedTiming);
};
/**
 * A mixin that simulates focus styling. Needed when the semantic element with the focus is hidden,
 * such as the `<input>` in `UICheckbox`.
 */

export var uiFocus = css(["box-shadow:", " ", ",", " ", " !important;"], FOCUS_RING_SHADOW_SIZES, rgba(FOCUS_RING_BASE, FOCUS_RING_SHADOW_ALPHA), FOCUS_RING_SHADOW_LAST_SIZES, FOCUS_RING_BASE);
export var uiLayerShadow = function uiLayerShadow() {
  return css(["box-shadow:0 ", " ", " 0 ", ";"], BASE_SHADOW_OFFSET_Y, BASE_SHADOW_BLUR_RADIUS, rgba(BASE_SHADOW_COLOR, parseFloat(BASE_SHADOW_ALPHA)));
};
export var toPx = function toPx(value) {
  return typeof value === 'number' ? value + "px" : value;
};
export var toPercent = function toPercent(value) {
  return value == null ? undefined : value + "%";
};
export var percentToVW = function percentToVW(width) {
  if (typeof width !== 'string') return width;
  return width.replace(/(\d+)%/g, '$1vw');
};
export var setBorderRadius = function setBorderRadius() {
  var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BUTTON_RADIUS;
  return css(["border-radius:", ";"], toPx(radius));
};
export var setGrabCursor = function setGrabCursor() {
  var cursor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'grab';
  return css(["cursor:move;cursor:", ";"], cursor);
};
export var setInputAppearance = function setInputAppearance() {
  return css(["display:block;height:", ";width:100%;font-size:", ";line-height:22px;text-align:left;vertical-align:", ";color:", ";background-color:", ";border:", " solid ", ";border-radius:", ";"], INPUT_DEFAULT_HEIGHT, INPUT_FONT_SIZE, INPUT_VERTICAL_ALIGNMENT, FORM_CONTROL_FOREGROUND_COLOR, FORM_CONTROL_BACKGROUND_COLOR, INPUT_BORDER_WIDTH, FORM_CONTROL_BORDER_COLOR, BUTTON_RADIUS);
};
export var setInputMetrics = function setInputMetrics() {
  var padVertical = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BUTTON_DEFAULT_PADDING_Y;
  var padHorizontal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : BUTTON_DEFAULT_PADDING_X;
  var padRight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : padHorizontal;
  var padBottom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : padVertical;
  var responsive = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  return css(["padding-bottom:", ";padding-left:", ";padding-right:", ";padding-top:", ";", ";"], toPx(padBottom), toPx(padHorizontal), toPx(padRight), toPx(padVertical), responsive ? css(["@media only screen and (max-width:", "){width:100%;}"], GRID_BREAKPOINT_SMALL) : null);
};
var DISTANCE_SIZES = {
  flush: 0,
  xs: DISTANCE_MEASUREMENT_EXTRA_SMALL,
  sm: DISTANCE_MEASUREMENT_SMALL,
  md: DISTANCE_MEASUREMENT_MEDIUM,
  lg: DISTANCE_MEASUREMENT_LARGE,
  xl: DISTANCE_MEASUREMENT_EXTRA_LARGE
};
export var setDistance = function setDistance() {
  var distance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'md';
  var size = DISTANCE_SIZES[toShorthandSize(distance)];
  return css(["margin-top:", ";margin-bottom:", ";"], size, size);
};
/**
 * Given styles, wraps them in selectors to apply to placeholder text in an input or textarea.
 */

export var getPlaceholderStyles = function getPlaceholderStyles(styles) {
  return css(["&::-moz-placeholder{opacity:1;", ";}&:-ms-input-placeholder{", ";}&::-webkit-input-placeholder{", ";}"], styles, styles, styles);
};
/**
 * @returns a mixin that sets the appropriate width and margins to match a page template with
 * `pageLayout="max-width"`.
 */

export var setTemplateMaxWidth = function setTemplateMaxWidth() {
  return css(["margin-left:auto;margin-right:auto;max-width:", ";"], toPx(parseInt(LAYOUT_MAX_WIDTH, 10) + parseInt(LAYOUT_PADDING_X, 10) * 2));
};