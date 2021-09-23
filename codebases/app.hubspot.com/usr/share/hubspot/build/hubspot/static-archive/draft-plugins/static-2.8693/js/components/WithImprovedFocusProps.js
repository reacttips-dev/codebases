'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as React from 'react';
import { EditorState } from 'draft-js';
import { callIfPossible } from 'UIComponents/core/Functions';
export default (function (Component) {
  var WithImprovedFocusProps = /*#__PURE__*/function (_React$Component) {
    _inherits(WithImprovedFocusProps, _React$Component);

    function WithImprovedFocusProps() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WithImprovedFocusProps);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WithImprovedFocusProps)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _this.focus = function () {
        if (_this._child && _this._child.focus) {
          _this._child.focus();
        }
      };

      _this.blur = function () {
        if (_this._child && _this._child.blur) {
          _this._child.blur();
        }
      };

      return _this;
    }

    _createClass(WithImprovedFocusProps, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var _this$props = this.props,
            editorState = _this$props.editorState,
            onBlur = _this$props.onBlur,
            onFocus = _this$props.onFocus;
        var hadFocus = prevProps.editorState.getSelection().getHasFocus();
        var hasFocus = editorState.getSelection().getHasFocus();

        if (hadFocus && !hasFocus) {
          callIfPossible(onBlur);
        }

        if (!hadFocus && hasFocus) {
          callIfPossible(onFocus);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        // pull out onBlur and onFocus so they don't get called twice
        // i.e. if Draft actually would call onBlur natively but we
        // already called it in componentDidUpdate here
        var _this$props2 = this.props,
            __onBlur = _this$props2.onBlur,
            __onFocus = _this$props2.onFocus,
            rest = _objectWithoutProperties(_this$props2, ["onBlur", "onFocus"]);

        return /*#__PURE__*/_jsx(Component, Object.assign({
          ref: function ref(c) {
            return _this2._child = c;
          }
        }, rest));
      }
    }]);

    return WithImprovedFocusProps;
  }(React.Component);

  WithImprovedFocusProps.propTypes = {
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  };
  return WithImprovedFocusProps;
});