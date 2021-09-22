"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactDndHtml5Backend = _interopRequireDefault(require("react-dnd-html5-backend"));

var _reactDndTouchBackend = _interopRequireDefault(require("react-dnd-touch-backend"));

var _dndMultiBackend = require("dnd-multi-backend");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  backends: [{
    backend: _reactDndHtml5Backend.default,
    transition: _dndMultiBackend.MouseTransition
  }, {
    backend: (0, _reactDndTouchBackend.default)({
      enableMouseEvents: true
    }),
    preview: true,
    transition: _dndMultiBackend.TouchTransition
  }]
};
exports.default = _default;