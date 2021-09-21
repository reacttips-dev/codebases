'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _head = require('lodash/head');

var _head2 = _interopRequireDefault(_head);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keyCode = require('../constants/keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function highlightOnlyResultContainer(Typeahead) {
  var WrappedTypeahead = function (_React$Component) {
    _inherits(WrappedTypeahead, _React$Component);

    function WrappedTypeahead() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, WrappedTypeahead);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WrappedTypeahead.__proto__ || Object.getPrototypeOf(WrappedTypeahead)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        isOnlyResult: false
      }, _this._handleKeyDown = function (e) {
        var _this$props = _this.props,
            initialItem = _this$props.initialItem,
            onKeyDown = _this$props.onKeyDown,
            onSelectionAdd = _this$props.onSelectionAdd;


        switch (e.keyCode) {
          case _keyCode.RETURN:
            if (_this.state.isOnlyResult) {
              onSelectionAdd(initialItem);
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
            highlightOnlyResult = nextProps.highlightOnlyResult,
            results = nextProps.results;


        if (!highlightOnlyResult || allowNew) {
          return;
        }

        if (results.length !== this.props.results.length) {
          this.setState({
            isOnlyResult: results.length === 1 && !(0, _head2.default)(results).disabled
          });
        }
      }
    }, {
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          isOnlyResult: this.state.isOnlyResult
        };
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

  WrappedTypeahead.childContextTypes = {
    isOnlyResult: _propTypes2.default.bool.isRequired
  };

  return WrappedTypeahead;
}

exports.default = highlightOnlyResultContainer;