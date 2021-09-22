'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = ['KeyDown', 'KeyPress', 'KeyUp', 'Click', 'ContextMenu', 'DoubleClick', 'Drag', 'DragEnd', 'DragEnter', 'DragExit', 'DragLeave', 'DragOver', 'DragStart', 'Drop', 'Focus', 'MouseDown', 'MouseEnter', 'MouseLeave', 'MouseMove', 'MouseOut', 'MouseOver', 'MouseUp', 'PointerOver', 'PointerEnter', 'PointerDown', 'PointerMove', 'PointerUp', 'PointerCancel', 'PointerOut', 'PointerLeave', 'Scroll', 'TouchStart', 'TouchMove', 'TouchEnd', 'TouchCancel'];

var aliases = {
  DoubleClick: 'dblclick'
};

var toEventName = function toEventName(event) {
  return (aliases[event] || event).toLowerCase();
};

var NativeListener = function (_Component) {
  _inherits(NativeListener, _Component);

  function NativeListener() {
    _classCallCheck(this, NativeListener);

    return _possibleConstructorReturn(this, (NativeListener.__proto__ || Object.getPrototypeOf(NativeListener)).apply(this, arguments));
  }

  _createClass(NativeListener, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var props = this.props;
      var element = _reactDom2.default.findDOMNode(this);
      if (element) {
        events.forEach(function (event) {
          var capture = props['on' + event + 'Capture'];
          var bubble = props['on' + event];
          var stop = props['stop' + event];
          if (capture && typeof capture === 'function') {
            element.addEventListener(toEventName(event), capture, true);
          }
          if (bubble && typeof bubble === 'function') {
            element.addEventListener(toEventName(event), bubble, false);
          }
          if (stop === true) {
            element.addEventListener(toEventName(event), function (nativeEvent) {
              return nativeEvent.stopPropagation();
            }, false);
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return NativeListener;
}(_react.Component);

NativeListener.displayName = 'NativeListener';
NativeListener.propTypes = _extends({
  children: function children(props, propName) {
    if (props[propName].length) {
      return new Error('NativeListener can only wrap one element');
    }
  }
}, events.reduce(function (accumulator, event) {
  var _extends2;

  return _extends({}, accumulator, (_extends2 = {}, _defineProperty(_extends2, 'on' + event, _propTypes2.default.func), _defineProperty(_extends2, 'on' + event + 'Capture', _propTypes2.default.func), _defineProperty(_extends2, 'stop' + event, _propTypes2.default.bool), _extends2));
}, {}));
exports.default = NativeListener;