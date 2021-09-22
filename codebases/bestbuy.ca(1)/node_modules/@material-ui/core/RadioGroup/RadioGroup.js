"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _warning = _interopRequireDefault(require("warning"));

var _FormGroup = _interopRequireDefault(require("../FormGroup"));

var _helpers = require("../utils/helpers");

// @inheritedComponent FormGroup
var RadioGroup =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(RadioGroup, _React$Component);

  function RadioGroup() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, RadioGroup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(RadioGroup)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.radios = [];

    _this.focus = function () {
      if (!_this.radios || !_this.radios.length) {
        return;
      }

      var focusRadios = _this.radios.filter(function (n) {
        return !n.disabled;
      });

      if (!focusRadios.length) {
        return;
      }

      var selectedRadio = (0, _helpers.find)(focusRadios, function (n) {
        return n.checked;
      });

      if (selectedRadio) {
        selectedRadio.focus();
        return;
      }

      focusRadios[0].focus();
    };

    _this.handleRadioChange = function (event, checked) {
      if (checked && _this.props.onChange) {
        _this.props.onChange(event, event.target.value);
      }
    };

    return _this;
  }

  (0, _createClass2.default)(RadioGroup, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          children = _this$props.children,
          name = _this$props.name,
          value = _this$props.value,
          onChange = _this$props.onChange,
          other = (0, _objectWithoutProperties2.default)(_this$props, ["children", "name", "value", "onChange"]);
      this.radios = [];
      return _react.default.createElement(_FormGroup.default, (0, _extends2.default)({
        role: "radiogroup"
      }, other), _react.default.Children.map(children, function (child) {
        if (!_react.default.isValidElement(child)) {
          return null;
        }

        process.env.NODE_ENV !== "production" ? (0, _warning.default)(child.type !== _react.default.Fragment, ["Material-UI: the RadioGroup component doesn't accept a Fragment as a child.", 'Consider providing an array instead.'].join('\n')) : void 0;
        return _react.default.cloneElement(child, {
          name: name,
          inputRef: function inputRef(node) {
            if (node) {
              _this2.radios.push(node);
            }
          },
          checked: value === child.props.value,
          onChange: (0, _helpers.createChainedFunction)(child.props.onChange, _this2.handleRadioChange)
        });
      }));
    }
  }]);
  return RadioGroup;
}(_react.default.Component);

RadioGroup.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * The content of the component.
   */
  children: _propTypes.default.node,

  /**
   * The name used to reference the value of the control.
   */
  name: _propTypes.default.string,

  /**
   * @ignore
   */
  onBlur: _propTypes.default.func,

  /**
   * Callback fired when a radio button is selected.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value`.
   * @param {string} value The `value` of the selected radio button
   */
  onChange: _propTypes.default.func,

  /**
   * @ignore
   */
  onKeyDown: _propTypes.default.func,

  /**
   * Value of the selected radio button.
   */
  value: _propTypes.default.string
} : {};
var _default = RadioGroup;
exports.default = _default;