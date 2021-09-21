'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Highlighter = require('./Highlighter.react');

var _Highlighter2 = _interopRequireDefault(_Highlighter);

var _Menu = require('./Menu.react');

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuItem = require('./MenuItem.react');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _utils = require('./utils/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TypeaheadMenu = function (_React$Component) {
  _inherits(TypeaheadMenu, _React$Component);

  function TypeaheadMenu() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TypeaheadMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TypeaheadMenu.__proto__ || Object.getPrototypeOf(TypeaheadMenu)).call.apply(_ref, [this].concat(args))), _this), _this._renderMenuItem = function (option, idx) {
      var _this$props = _this.props,
          labelKey = _this$props.labelKey,
          newSelectionPrefix = _this$props.newSelectionPrefix,
          renderMenuItemChildren = _this$props.renderMenuItemChildren,
          text = _this$props.text;


      var menuItemProps = {
        disabled: option.disabled,
        key: idx,
        label: (0, _utils.getOptionLabel)(option, labelKey),
        option: option,
        position: idx
      };

      if (option.customOption) {
        return _react2.default.createElement(
          _MenuItem2.default,
          _extends({}, menuItemProps, {
            className: 'rbt-menu-custom-option',
            label: newSelectionPrefix + option[labelKey] }),
          newSelectionPrefix,
          _react2.default.createElement(
            _Highlighter2.default,
            { search: text },
            option[labelKey]
          )
        );
      }

      return _react2.default.createElement(
        _MenuItem2.default,
        menuItemProps,
        renderMenuItemChildren(option, _this.props, idx)
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TypeaheadMenu, [{
    key: 'render',
    value: function render() {
      var menuProps = (0, _pick2.default)(this.props, ['align', 'className', 'dropup', 'emptyLabel', 'id', 'maxHeight', 'onPaginate', 'paginate', 'paginationText', 'style']);

      return _react2.default.createElement(
        _Menu2.default,
        menuProps,
        this.props.options.map(this._renderMenuItem)
      );
    }
  }]);

  return TypeaheadMenu;
}(_react2.default.Component);

/**
 * In addition to the propTypes below, the following props are automatically
 * passed down by `Typeahead`:
 *
 *  - labelKey
 *  - onPaginate
 *  - options
 *  - paginate
 *  - text
 */


TypeaheadMenu.propTypes = {
  /**
   * Provides the ability to specify a prefix before the user-entered text to
   * indicate that the selection will be new. No-op unless `allowNew={true}`.
   */
  newSelectionPrefix: _propTypes2.default.string,
  /**
   * Provides a hook for customized rendering of menu item contents.
   */
  renderMenuItemChildren: _propTypes2.default.func
};

TypeaheadMenu.defaultProps = {
  newSelectionPrefix: 'New selection: ',
  renderMenuItemChildren: function renderMenuItemChildren(option, props, idx) {
    return _react2.default.createElement(
      _Highlighter2.default,
      { search: props.text },
      (0, _utils.getOptionLabel)(option, props.labelKey)
    );
  }
};

exports.default = TypeaheadMenu;