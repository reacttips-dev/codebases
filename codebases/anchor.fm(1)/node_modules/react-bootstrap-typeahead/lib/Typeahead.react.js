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

var _Overlay = require('./Overlay.react');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _TypeaheadInput = require('./TypeaheadInput.react');

var _TypeaheadInput2 = _interopRequireDefault(_TypeaheadInput);

var _TypeaheadMenu = require('./TypeaheadMenu.react');

var _TypeaheadMenu2 = _interopRequireDefault(_TypeaheadMenu);

var _typeaheadContainer = require('./containers/typeaheadContainer');

var _typeaheadContainer2 = _interopRequireDefault(_typeaheadContainer);

var _utils = require('./utils/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Typeahead = function (_React$Component) {
  _inherits(Typeahead, _React$Component);

  function Typeahead() {
    _classCallCheck(this, Typeahead);

    return _possibleConstructorReturn(this, (Typeahead.__proto__ || Object.getPrototypeOf(Typeahead)).apply(this, arguments));
  }

  _createClass(Typeahead, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          align = _props.align,
          bodyContainer = _props.bodyContainer,
          className = _props.className,
          dropup = _props.dropup,
          emptyLabel = _props.emptyLabel,
          inputRef = _props.inputRef,
          isMenuShown = _props.isMenuShown,
          labelKey = _props.labelKey,
          maxHeight = _props.maxHeight,
          menuId = _props.menuId,
          newSelectionPrefix = _props.newSelectionPrefix,
          onInputChange = _props.onInputChange,
          onMenuHide = _props.onMenuHide,
          onMenuShow = _props.onMenuShow,
          onPaginate = _props.onPaginate,
          onSelectionAdd = _props.onSelectionAdd,
          onSelectionRemove = _props.onSelectionRemove,
          paginate = _props.paginate,
          paginationText = _props.paginationText,
          renderMenu = _props.renderMenu,
          renderMenuItemChildren = _props.renderMenuItemChildren,
          results = _props.results,
          text = _props.text;


      var menuProps = {
        align: align,
        dropup: dropup,
        emptyLabel: emptyLabel,
        id: menuId,
        labelKey: labelKey,
        maxHeight: maxHeight,
        newSelectionPrefix: newSelectionPrefix,
        onPaginate: onPaginate,
        paginate: paginate,
        paginationText: paginationText,
        renderMenuItemChildren: renderMenuItemChildren,
        text: text
      };

      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('rbt', 'open', 'clearfix', { 'dropup': dropup }, className),
          style: { position: 'relative' },
          tabIndex: -1 },
        _react2.default.createElement(_TypeaheadInput2.default, _extends({}, this.props, {
          onAdd: onSelectionAdd,
          onChange: onInputChange,
          onRemove: onSelectionRemove,
          options: results,
          ref: inputRef
        })),
        _react2.default.createElement(
          _Overlay2.default,
          {
            align: align,
            className: className,
            container: bodyContainer ? document.body : this,
            dropup: dropup,
            onMenuHide: onMenuHide,
            onMenuShow: onMenuShow,
            show: isMenuShown,
            target: this },
          renderMenu(results, menuProps)
        ),
        _react2.default.createElement(
          'div',
          {
            'aria-atomic': true,
            'aria-live': 'polite',
            className: 'sr-only rbt-sr-status',
            role: 'status' },
          (0, _utils.getAccessibilityStatus)(this.props)
        )
      );
    }
  }]);

  return Typeahead;
}(_react2.default.Component);

Typeahead.propTypes = {
  renderMenu: _propTypes2.default.func
};

Typeahead.defaultProps = {
  renderMenu: function renderMenu(results, menuProps) {
    return _react2.default.createElement(_TypeaheadMenu2.default, _extends({}, menuProps, { options: results }));
  }
};

exports.default = (0, _typeaheadContainer2.default)(Typeahead);