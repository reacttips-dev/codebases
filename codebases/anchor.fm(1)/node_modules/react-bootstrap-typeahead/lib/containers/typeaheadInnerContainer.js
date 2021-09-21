'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keyCode = require('../constants/keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Thin layer between top-level container and rendering layer. Needed for
 * updates due to actions that are neither prop nor state changes.
 */
function typeaheadInnerContainer(Typeahead) {
  var WrappedTypeahead = function (_React$Component) {
    _inherits(WrappedTypeahead, _React$Component);

    function WrappedTypeahead() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, WrappedTypeahead);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WrappedTypeahead.__proto__ || Object.getPrototypeOf(WrappedTypeahead)).call.apply(_ref, [this].concat(args))), _this), _this._handleKeyDown = function (e) {
        var _this$props = _this.props,
            activeItem = _this$props.activeItem,
            isMenuShown = _this$props.isMenuShown,
            onActiveIndexChange = _this$props.onActiveIndexChange,
            onActiveItemChange = _this$props.onActiveItemChange,
            onHide = _this$props.onHide,
            onKeyDown = _this$props.onKeyDown,
            onSelectionAdd = _this$props.onSelectionAdd,
            onShow = _this$props.onShow,
            results = _this$props.results,
            submitFormOnEnter = _this$props.submitFormOnEnter;


        switch (e.keyCode) {
          case _keyCode.UP:
          case _keyCode.DOWN:
            if (!isMenuShown) {
              onShow();
              break;
            }

            var activeIndex = _this.props.activeIndex;

            // Prevents input cursor from going to the beginning when pressing up.

            e.preventDefault();

            // Increment or decrement index based on user keystroke.
            activeIndex += e.keyCode === _keyCode.UP ? -1 : 1;

            // Skip over any disabled options.
            while (results[activeIndex] && results[activeIndex].disabled) {
              activeIndex += e.keyCode === _keyCode.UP ? -1 : 1;
            }

            // If we've reached the end, go back to the beginning or vice-versa.
            if (activeIndex === results.length) {
              activeIndex = -1;
            } else if (activeIndex === -2) {
              activeIndex = results.length - 1;
            }

            onActiveIndexChange(activeIndex);

            if (activeIndex === -1) {
              // Reset the active item if there is no active index.
              onActiveItemChange(null);
            }
            break;
          case _keyCode.ESC:
          case _keyCode.TAB:
            // Prevent closing dialogs.
            e.keyCode === _keyCode.ESC && e.preventDefault();

            onHide();
            break;
          case _keyCode.RETURN:
            if (!isMenuShown) {
              break;
            }

            // Don't submit form if menu is shown and an item is active.
            if (!submitFormOnEnter || activeItem) {
              // Prevent submitting forms.
              e.preventDefault();
            }

            if (activeItem) {
              onSelectionAdd(activeItem);
              break;
            }
            break;
        }

        onKeyDown(e);
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(WrappedTypeahead, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var allowNew = nextProps.allowNew,
            onInitialItemChange = nextProps.onInitialItemChange,
            results = nextProps.results;

        // Clear the initial item when there are no results.

        if (!(allowNew || results.length)) {
          onInitialItemChange(null);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Typeahead, _extends({}, this.props, {
          onKeyDown: this._handleKeyDown
        }));
      }
    }]);

    return WrappedTypeahead;
  }(_react2.default.Component);

  return WrappedTypeahead;
}

exports.default = typeaheadInnerContainer;