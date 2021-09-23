'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import UIAutosizedTextInput from 'UIComponents/input/UIAutosizedTextInput';
import ScopedFeatureTooltip from 'FileManagerCore/components/permissions/ScopedFeatureTooltip';

var FilenameInput = /*#__PURE__*/function (_Component) {
  _inherits(FilenameInput, _Component);

  function FilenameInput() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FilenameInput);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FilenameInput)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.inputRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(FilenameInput, [{
    key: "blur",
    value: function blur() {
      if (this.inputRef.current) {
        this.inputRef.current.blur();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          error = _this$props.error,
          value = _this$props.value,
          onBlur = _this$props.onBlur,
          onKeyDown = _this$props.onKeyDown,
          isReadOnly = _this$props.isReadOnly;
      return /*#__PURE__*/_jsx(ScopedFeatureTooltip, {
        children: /*#__PURE__*/_jsx("span", {
          className: "filename-input is--heading-7 m-left-2 m-bottom-4 m-right-8" + (isReadOnly ? " is-read-only" : ""),
          children: /*#__PURE__*/_jsx(UIAutosizedTextInput, {
            inputRef: this.inputRef,
            affordance: true,
            onChange: onChange,
            onBlur: onBlur,
            onKeyDown: onKeyDown,
            value: value,
            error: error,
            disabled: isReadOnly
          })
        })
      });
    }
  }]);

  return FilenameInput;
}(Component);

export { FilenameInput as default };
FilenameInput.propTypes = {
  error: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};