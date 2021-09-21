'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _utils = require('../utils/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var menuItemContainer = function menuItemContainer(Component) {
  var WrappedMenuItem = function (_React$Component) {
    _inherits(WrappedMenuItem, _React$Component);

    function WrappedMenuItem() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, WrappedMenuItem);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WrappedMenuItem.__proto__ || Object.getPrototypeOf(WrappedMenuItem)).call.apply(_ref, [this].concat(args))), _this), _this._handleClick = function (e) {
        var _this$props = _this.props,
            option = _this$props.option,
            onClick = _this$props.onClick;


        _this.context.onMenuItemClick(option);
        onClick && onClick(e);
      }, _this._updateInitialItem = function (props) {
        var option = props.option,
            position = props.position;

        if (position === 0) {
          _this.context.onInitialItemChange(option);
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(WrappedMenuItem, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this._updateInitialItem(this.props);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps, nextContext) {
        var currentlyActive = this.context.activeIndex === this.props.position;
        var option = nextProps.option,
            position = nextProps.position;
        var activeIndex = nextContext.activeIndex,
            onActiveItemChange = nextContext.onActiveItemChange;


        if (position == null) {
          return;
        }

        // The item will become active.
        if (activeIndex === position) {
          // Ensures that if the menu items exceed the bounds of the menu, the
          // menu will scroll up or down as the user hits the arrow keys.
          (0, _utils.scrollIntoViewIfNeeded)((0, _reactDom.findDOMNode)(this));

          // Fire the change handler when the menu item becomes active.
          !currentlyActive && onActiveItemChange(option);
        }

        this._updateInitialItem(nextProps);
      }
    }, {
      key: 'render',
      value: function render() {
        var _context = this.context,
            activeIndex = _context.activeIndex,
            isOnlyResult = _context.isOnlyResult;

        var _props = this.props,
            label = _props.label,
            option = _props.option,
            position = _props.position,
            props = _objectWithoutProperties(_props, ['label', 'option', 'position']);

        var active = isOnlyResult || activeIndex === position;

        return _react2.default.createElement(Component, _extends({}, props, {
          active: active,
          'aria-label': label,
          'aria-selected': active,
          id: (0, _utils.getMenuItemId)(position),
          onClick: this._handleClick,
          onMouseDown: _utils.preventInputBlur,
          role: 'option'
        }));
      }
    }]);

    return WrappedMenuItem;
  }(_react2.default.Component);

  WrappedMenuItem.displayName = 'menuItemContainer(' + (0, _utils.getDisplayName)(Component) + ')';

  WrappedMenuItem.propTypes = {
    option: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]).isRequired,
    position: _propTypes2.default.number
  };

  WrappedMenuItem.contextTypes = {
    activeIndex: _propTypes2.default.number.isRequired,
    isOnlyResult: _propTypes2.default.bool.isRequired,
    onActiveItemChange: _propTypes2.default.func.isRequired,
    onInitialItemChange: _propTypes2.default.func.isRequired,
    onMenuItemClick: _propTypes2.default.func.isRequired
  };

  return WrappedMenuItem;
};

exports.default = menuItemContainer;