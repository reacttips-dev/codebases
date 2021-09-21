'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AutosizeInput = require('./AutosizeInput.react');

var _AutosizeInput2 = _interopRequireDefault(_AutosizeInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  backgroundColor: 'transparent',
  border: 0,
  boxShadow: 'none',
  cursor: 'inherit',
  outline: 'none',
  padding: 0
};

// Shim around a standard input to normalize how props are applied.

var StandardInput = function (_React$Component) {
  _inherits(StandardInput, _React$Component);

  function StandardInput() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, StandardInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = StandardInput.__proto__ || Object.getPrototypeOf(StandardInput)).call.apply(_ref, [this].concat(args))), _this), _this.getInput = function () {
      return _this._input;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(StandardInput, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          inputClassName = _props.inputClassName,
          inputStyle = _props.inputStyle,
          otherProps = _objectWithoutProperties(_props, ['inputClassName', 'inputStyle']);

      return _react2.default.createElement('input', _extends({}, otherProps, {
        className: inputClassName,
        ref: function ref(input) {
          return _this2._input = input;
        },
        style: _extends({}, STYLES, inputStyle, {
          width: '100%'
        })
      }));
    }

    // Mirror the AutosizeInput API for consistency.

  }]);

  return StandardInput;
}(_react2.default.Component);

var HintedInput = function (_React$Component2) {
  _inherits(HintedInput, _React$Component2);

  function HintedInput() {
    var _ref2;

    var _temp2, _this3, _ret2;

    _classCallCheck(this, HintedInput);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this3 = _possibleConstructorReturn(this, (_ref2 = HintedInput.__proto__ || Object.getPrototypeOf(HintedInput)).call.apply(_ref2, [this].concat(args))), _this3), _this3._renderInput = function () {
      var _this3$props = _this3.props,
          className = _this3$props.className,
          hintText = _this3$props.hintText,
          inputRef = _this3$props.inputRef,
          multiple = _this3$props.multiple,
          props = _objectWithoutProperties(_this3$props, ['className', 'hintText', 'inputRef', 'multiple']);

      // Render a standard input in the single-select case to address #278.


      var InputComponent = multiple ? _AutosizeInput2.default : StandardInput;

      return _react2.default.createElement(InputComponent, _extends({}, props, {
        inputClassName: (0, _classnames2.default)('rbt-input-main', className),
        inputStyle: STYLES,
        ref: inputRef,
        style: {
          position: 'relative',
          zIndex: 1
        }
      }));
    }, _this3._renderHint = function () {
      var _this3$props2 = _this3.props,
          hintText = _this3$props2.hintText,
          multiple = _this3$props2.multiple;

      // TODO: Support hinting for multi-selection.

      return multiple ? null : _react2.default.createElement(_AutosizeInput2.default, {
        'aria-hidden': true,
        inputClassName: 'rbt-input-hint',
        inputStyle: _extends({}, STYLES, {
          color: 'rgba(0, 0, 0, 0.35)'
        }),
        style: {
          bottom: 0,
          display: 'block',
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          zIndex: 0
        },
        tabIndex: -1,
        value: hintText
      });
    }, _temp2), _possibleConstructorReturn(_this3, _ret2);
  }

  _createClass(HintedInput, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          style: {
            display: this.props.multiple ? 'inline-block' : 'block',
            position: 'relative'
          } },
        this._renderInput(),
        this._renderHint()
      );
    }
  }]);

  return HintedInput;
}(_react2.default.Component);

HintedInput.propTypes = {
  type: _propTypes2.default.string
};

HintedInput.defaultProps = {
  type: 'text'
};

exports.default = HintedInput;