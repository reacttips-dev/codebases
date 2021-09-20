"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _deepmerge = _interopRequireDefault(require("deepmerge"));

var _isPlainObject = _interopRequireDefault(require("is-plain-object"));

var _warning = _interopRequireDefault(require("warning"));

var _createBreakpoints = _interopRequireDefault(require("./createBreakpoints"));

var _createMixins = _interopRequireDefault(require("./createMixins"));

var _createPalette = _interopRequireDefault(require("./createPalette"));

var _createTypography = _interopRequireDefault(require("./createTypography"));

var _shadows = _interopRequireDefault(require("./shadows"));

var _shape = _interopRequireDefault(require("./shape"));

var _spacing = _interopRequireDefault(require("./spacing"));

var _transitions = _interopRequireDefault(require("./transitions"));

var _zIndex = _interopRequireDefault(require("./zIndex"));

// < 1kb payload overhead when lodash/merge is > 3kb.
function createMuiTheme() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$breakpoints = options.breakpoints,
      breakpointsInput = _options$breakpoints === void 0 ? {} : _options$breakpoints,
      _options$mixins = options.mixins,
      mixinsInput = _options$mixins === void 0 ? {} : _options$mixins,
      _options$palette = options.palette,
      paletteInput = _options$palette === void 0 ? {} : _options$palette,
      shadowsInput = options.shadows,
      _options$typography = options.typography,
      typographyInput = _options$typography === void 0 ? {} : _options$typography,
      other = (0, _objectWithoutProperties2.default)(options, ["breakpoints", "mixins", "palette", "shadows", "typography"]);
  var palette = (0, _createPalette.default)(paletteInput);
  var breakpoints = (0, _createBreakpoints.default)(breakpointsInput);
  var muiTheme = (0, _extends2.default)({
    breakpoints: breakpoints,
    direction: 'ltr',
    mixins: (0, _createMixins.default)(breakpoints, _spacing.default, mixinsInput),
    overrides: {},
    // Inject custom styles
    palette: palette,
    props: {},
    // Inject custom properties
    shadows: shadowsInput || _shadows.default,
    typography: (0, _createTypography.default)(palette, typographyInput)
  }, (0, _deepmerge.default)({
    shape: _shape.default,
    spacing: _spacing.default,
    transitions: _transitions.default,
    zIndex: _zIndex.default
  }, other, {
    isMergeableObject: _isPlainObject.default
  }));
  process.env.NODE_ENV !== "production" ? (0, _warning.default)(muiTheme.shadows.length === 25, 'Material-UI: the shadows array provided to createMuiTheme should support 25 elevations.') : void 0;
  return muiTheme;
}

var _default = createMuiTheme;
exports.default = _default;