'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SIZER_STYLE = {
  height: 0,
  left: 0,
  overflow: 'scroll',
  position: 'absolute',
  top: 0,
  visibility: 'hidden',
  whiteSpace: 'pre'
};

var INPUT_PROPS_BLACKLIST = ['inputClassName', 'inputRef', 'inputStyle'];

var MIN_WIDTH = 1;

var cleanInputProps = function cleanInputProps(inputProps) {
  INPUT_PROPS_BLACKLIST.forEach(function (field) {
    return delete inputProps[field];
  });
  return inputProps;
};

var copyStyles = function copyStyles(styles, node) {
  node.style.fontSize = styles.fontSize;
  node.style.fontFamily = styles.fontFamily;
  node.style.fontWeight = styles.fontWeight;
  node.style.fontStyle = styles.fontStyle;
  node.style.letterSpacing = styles.letterSpacing;
  node.style.textTransform = styles.textTransform;
};

var AutosizeInput = function (_React$Component) {
  _inherits(AutosizeInput, _React$Component);

  function AutosizeInput() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AutosizeInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AutosizeInput.__proto__ || Object.getPrototypeOf(AutosizeInput)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      inputWidth: MIN_WIDTH
    }, _this._getInputRef = function (el) {
      _this._input = el;
      if (typeof _this.props.inputRef === 'function') {
        _this.props.inputRef(el);
      }
    }, _this._copyInputStyles = function () {
      var inputStyles = _this._input && window.getComputedStyle && window.getComputedStyle(_this._input);

      if (!inputStyles) {
        return;
      }

      copyStyles(inputStyles, _this._sizer);

      if (_this._placeHolderSizer) {
        copyStyles(inputStyles, _this._placeHolderSizer);
      }
    }, _this._updateInputWidth = function () {
      if (!_this._sizer || _this._sizer.scrollWidth === undefined) {
        return;
      }

      _this._copyInputStyles();

      var placeholderWidth = _this._placeHolderSizer && _this._placeHolderSizer.scrollWidth || MIN_WIDTH;

      var inputWidth = Math.max(_this._sizer.scrollWidth, placeholderWidth);

      if (inputWidth !== _this.state.inputWidth) {
        _this.setState({ inputWidth: inputWidth });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AutosizeInput, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._updateInputWidth();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      this._updateInputWidth();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          className = _props.className,
          defaultValue = _props.defaultValue,
          placeholder = _props.placeholder,
          value = _props.value;


      var wrapperStyle = _extends({}, this.props.style);
      if (!wrapperStyle.display) {
        wrapperStyle.display = 'inline-block';
      }

      var inputProps = cleanInputProps(_extends({}, this.props, {
        className: this.props.inputClassName,
        style: _extends({}, this.props.inputStyle, {
          boxSizing: 'content-box',
          width: this.state.inputWidth + 'px'
        })
      }));

      return _react2.default.createElement(
        'div',
        { className: className, style: wrapperStyle },
        _react2.default.createElement('input', _extends({}, inputProps, { ref: this._getInputRef })),
        _react2.default.createElement(
          'div',
          {
            ref: function ref(el) {
              return _this2._sizer = el;
            },
            style: SIZER_STYLE },
          defaultValue || value || ''
        ),
        placeholder ? _react2.default.createElement(
          'div',
          {
            ref: function ref(el) {
              return _this2._placeHolderSizer = el;
            },
            style: SIZER_STYLE },
          placeholder
        ) : null
      );
    }
  }, {
    key: 'getInput',
    value: function getInput() {
      return this._input;
    }
  }]);

  return AutosizeInput;
}(_react2.default.Component);

AutosizeInput.propTypes = {
  /**
   * ClassName for the input element.
   */
  inputClassName: _propTypes2.default.string,
  /**
   * Ref callback for the input element.
   */
  inputRef: _propTypes2.default.func,
  /**
   * CSS styles for the input element.
   */
  inputStyle: _propTypes2.default.object
};

exports.default = AutosizeInput;