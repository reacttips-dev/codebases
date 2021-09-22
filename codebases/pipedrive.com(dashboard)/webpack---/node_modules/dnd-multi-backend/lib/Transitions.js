"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MouseTransition = exports.HTML5DragTransition = exports.TouchTransition = void 0;

var _createTransition = _interopRequireDefault(require("./createTransition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TouchTransition = (0, _createTransition.default)('touchstart', function (event) {
  return event.touches != null; // eslint-disable-line no-eq-null, eqeqeq
});
exports.TouchTransition = TouchTransition;
var HTML5DragTransition = (0, _createTransition.default)('dragstart', function (event) {
  if (event.type) {
    return event.type.indexOf('drag') !== -1 || event.type.indexOf('drop') !== -1;
  }

  return false;
});
exports.HTML5DragTransition = HTML5DragTransition;
var MouseTransition = (0, _createTransition.default)('mousedown', function (event) {
  if (event.type) {
    return event.type.indexOf('touch') === -1 && event.type.indexOf('mouse') !== -1;
  }

  return false;
});
exports.MouseTransition = MouseTransition;