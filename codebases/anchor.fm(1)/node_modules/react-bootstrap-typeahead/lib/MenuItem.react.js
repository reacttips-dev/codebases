'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseMenuItem = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _menuItemContainer = require('./containers/menuItemContainer');

var _menuItemContainer2 = _interopRequireDefault(_menuItemContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseMenuItem = function (_React$Component) {
  _inherits(BaseMenuItem, _React$Component);

  function BaseMenuItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BaseMenuItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BaseMenuItem.__proto__ || Object.getPrototypeOf(BaseMenuItem)).call.apply(_ref, [this].concat(args))), _this), _this._handleClick = function (e) {
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          onClick = _this$props.onClick;


      e.preventDefault();
      !disabled && onClick(e);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BaseMenuItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          active = _props.active,
          children = _props.children,
          className = _props.className,
          disabled = _props.disabled,
          onClick = _props.onClick,
          onMouseDown = _props.onMouseDown,
          props = _objectWithoutProperties(_props, ['active', 'children', 'className', 'disabled', 'onClick', 'onMouseDown']);

      var conditionalClassNames = {
        'active': active,
        'disabled': disabled
      };

      return (
        /* eslint-disable jsx-a11y/anchor-is-valid */
        _react2.default.createElement(
          'li',
          _extends({}, props, {
            className: (0, _classnames2.default)(conditionalClassNames, className) }),
          _react2.default.createElement(
            'a',
            {
              className: (0, _classnames2.default)('dropdown-item', conditionalClassNames),
              href: '#',
              onClick: this._handleClick,
              onMouseDown: onMouseDown },
            children
          )
        )
        /* eslint-enable jsx-a11y/anchor-is-valid */

      );
    }
  }]);

  return BaseMenuItem;
}(_react2.default.Component);

BaseMenuItem.defaultProps = {
  onClick: _noop2.default
};

exports.BaseMenuItem = BaseMenuItem;
exports.default = (0, _menuItemContainer2.default)(BaseMenuItem);