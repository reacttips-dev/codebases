"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _pure = _interopRequireDefault(require("recompose/pure"));

var _SvgIcon = _interopRequireDefault(require("@material-ui/core/SvgIcon"));

function createSvgIcon(path, displayName) {
  var Icon = function Icon(props) {
    return _react.default.createElement(_SvgIcon.default, props, path);
  };

  Icon.displayName = displayName;
  Icon = (0, _pure.default)(Icon);
  Icon.muiName = 'SvgIcon';
  return Icon;
}

;
var _default = createSvgIcon;
exports.default = _default;