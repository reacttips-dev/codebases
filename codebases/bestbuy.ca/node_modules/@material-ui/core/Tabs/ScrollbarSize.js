"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactEventListener = _interopRequireDefault(require("react-event-listener"));

var _debounce = _interopRequireDefault(require("debounce"));

// < 1kb payload overhead when lodash/debounce is > 3kb.
var styles = {
  width: 100,
  height: 100,
  position: 'absolute',
  top: -10000,
  overflow: 'scroll',
  msOverflowStyle: 'scrollbar'
};
/**
 * @ignore - internal component.
 * The component is originates from https://github.com/STORIS/react-scrollbar-size.
 * It has been moved into the core in order to minimize the bundle size.
 */

var ScrollbarSize =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ScrollbarSize, _React$Component);

  function ScrollbarSize() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, ScrollbarSize);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(ScrollbarSize)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.handleResize = (0, _debounce.default)(function () {
      var onChange = _this.props.onChange;
      var prevHeight = _this.scrollbarHeight;
      var prevWidth = _this.scrollbarWidth;

      _this.setMeasurements();

      if (prevHeight !== _this.scrollbarHeight || prevWidth !== _this.scrollbarWidth) {
        onChange({
          scrollbarHeight: _this.scrollbarHeight,
          scrollbarWidth: _this.scrollbarWidth
        });
      }
    }, 166);

    _this.setMeasurements = function () {
      var nodeRef = _this.nodeRef;

      if (!nodeRef) {
        return;
      }

      _this.scrollbarHeight = nodeRef.offsetHeight - nodeRef.clientHeight;
      _this.scrollbarWidth = nodeRef.offsetWidth - nodeRef.clientWidth;
    };

    return _this;
  }

  (0, _createClass2.default)(ScrollbarSize, [{
    key: "componentDidMount",
    // Corresponds to 10 frames at 60 Hz.
    value: function componentDidMount() {
      this.setMeasurements();
      this.props.onLoad({
        scrollbarHeight: this.scrollbarHeight,
        scrollbarWidth: this.scrollbarWidth
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.handleResize.clear();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var onChange = this.props.onChange;
      return _react.default.createElement("div", null, onChange ? _react.default.createElement(_reactEventListener.default, {
        target: "window",
        onResize: this.handleResize
      }) : null, _react.default.createElement("div", {
        style: styles,
        ref: function ref(_ref) {
          _this2.nodeRef = _ref;
        }
      }));
    }
  }]);
  return ScrollbarSize;
}(_react.default.Component);

ScrollbarSize.propTypes = process.env.NODE_ENV !== "production" ? {
  onChange: _propTypes.default.func.isRequired,
  onLoad: _propTypes.default.func.isRequired
} : {};
var _default = ScrollbarSize;
exports.default = _default;