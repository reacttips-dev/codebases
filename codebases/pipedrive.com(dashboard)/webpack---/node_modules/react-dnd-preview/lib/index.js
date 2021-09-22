"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDnd = require("react-dnd");

var _dec, _class, _class2, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Preview = (_dec = (0, _reactDnd.DragLayer)(function (monitor) {
  return {
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    itemType: monitor.getItemType(),
    item: monitor.getItem()
  };
}), _dec(_class = (_temp = _class2 =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Preview, _PureComponent);

  function Preview() {
    _classCallCheck(this, Preview);

    return _possibleConstructorReturn(this, _getPrototypeOf(Preview).apply(this, arguments));
  }

  _createClass(Preview, [{
    key: "getStyle",
    value: function getStyle() {
      var transform = "translate(".concat(this.props.currentOffset.x, "px, ").concat(this.props.currentOffset.y, "px)");
      return {
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        transform: transform,
        WebkitTransform: transform
      };
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.isDragging || this.props.currentOffset === null) {
        return null;
      }

      return this.props.generator(this.props.itemType, this.props.item, this.getStyle());
    }
  }]);

  return Preview;
}(_react.PureComponent), _class2.defaultProps = {
  currentOffset: {
    x: 0,
    y: 0
  },
  isDragging: false,
  itemType: '',
  item: {}
}, _class2.propTypes = {
  currentOffset: _propTypes.default.shape({
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  isDragging: _propTypes.default.bool,
  itemType: _propTypes.default.string,
  item: _propTypes.default.any,
  generator: _propTypes.default.func.isRequired
}, _temp)) || _class);
exports.default = Preview;