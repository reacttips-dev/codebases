'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _shallowEqual = require('../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _Elements = require('./Elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var noop = function noop() {};

var _extractOptions = function _extractOptions(props) {
  var id = props.id,
      className = props.className,
      onBlur = props.onBlur,
      onClick = props.onClick,
      onFocus = props.onFocus,
      onReady = props.onReady,
      paymentRequest = props.paymentRequest,
      options = _objectWithoutProperties(props, ['id', 'className', 'onBlur', 'onClick', 'onFocus', 'onReady', 'paymentRequest']);

  return options;
};

var PaymentRequestButtonElement = function (_React$Component) {
  _inherits(PaymentRequestButtonElement, _React$Component);

  function PaymentRequestButtonElement(props, context) {
    _classCallCheck(this, PaymentRequestButtonElement);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.handleRef = function (ref) {
      _this._ref = ref;
    };

    var options = _extractOptions(props);
    // We keep track of the extracted options on this._options to avoid re-rendering.
    // (We would unnecessarily re-render if we were tracking them with state.)
    _this._options = options;
    return _this;
  }

  PaymentRequestButtonElement.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this.context.addElementsLoadListener(function (elements) {
      _this2._element = elements.create('paymentRequestButton', _extends({
        paymentRequest: _this2.props.paymentRequest
      }, _this2._options));
      _this2._element.on('ready', function () {
        _this2.props.onReady(_this2._element);
      });
      _this2._element.on('focus', function () {
        var _props;

        return (_props = _this2.props).onFocus.apply(_props, arguments);
      });
      _this2._element.on('click', function () {
        var _props2;

        return (_props2 = _this2.props).onClick.apply(_props2, arguments);
      });
      _this2._element.on('blur', function () {
        var _props3;

        return (_props3 = _this2.props).onBlur.apply(_props3, arguments);
      });
      _this2._element.mount(_this2._ref);
    });
  };

  PaymentRequestButtonElement.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.props.paymentRequest !== nextProps.paymentRequest) {
      console.warn('Unsupported prop change: paymentRequest is not a customizable property.');
    }
    var options = _extractOptions(nextProps);
    if (Object.keys(options).length !== 0 && !(0, _shallowEqual2.default)(options, this._options)) {
      this._options = options;
      this._element.update(options);
    }
  };

  PaymentRequestButtonElement.prototype.componentWillUnmount = function componentWillUnmount() {
    this._element.destroy();
  };

  PaymentRequestButtonElement.prototype.render = function render() {
    return _react2.default.createElement('div', {
      id: this.props.id,
      className: this.props.className,
      ref: this.handleRef
    });
  };

  return PaymentRequestButtonElement;
}(_react2.default.Component);

PaymentRequestButtonElement.propTypes = {
  id: _propTypes2.default.string,
  className: _propTypes2.default.string,
  onBlur: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  onReady: _propTypes2.default.func,
  paymentRequest: _propTypes2.default.shape({
    canMakePayment: _propTypes2.default.func.isRequired,
    on: _propTypes2.default.func.isRequired,
    show: _propTypes2.default.func.isRequired
  }).isRequired
};
PaymentRequestButtonElement.defaultProps = {
  id: undefined,
  className: undefined,
  onBlur: noop,
  onClick: noop,
  onFocus: noop,
  onReady: noop
};
PaymentRequestButtonElement.contextTypes = _Elements.elementContextTypes;
exports.default = PaymentRequestButtonElement;