'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import classNames from 'classnames';
import { INPUT_SIZE_OPTIONS, USE_CLASSES } from './InputConstants';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import ShareInput from '../decorators/ShareInput';
import refObject from '../utils/propTypes/refObject';
import { FieldsetContext } from '../context/FieldsetContext';
var TYPES = ['text', 'email', 'number', 'password', 'search', 'url', 'tel'];

var UITextInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITextInput, _PureComponent);

  function UITextInput() {
    _classCallCheck(this, UITextInput);

    return _possibleConstructorReturn(this, _getPrototypeOf(UITextInput).apply(this, arguments));
  }

  _createClass(UITextInput, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          error = _this$props.error,
          inputRef = _this$props.inputRef,
          placeholder = _this$props.placeholder,
          styled = _this$props.styled,
          use = _this$props.use,
          rest = _objectWithoutProperties(_this$props, ["className", "error", "inputRef", "placeholder", "styled", "use"]);

      var fieldSize = this.context.size;
      return /*#__PURE__*/_jsx("input", Object.assign({}, rest, {
        className: classNames('form-control private-form__control', INPUT_SIZE_OPTIONS[fieldSize], className, USE_CLASSES[use], !styled && 'private-form__control--unstyled uiTextInputUnstyled', error && 'private-form__control--error'),
        placeholder: lazyEval(placeholder),
        ref: inputRef
      }));
    }
  }]);

  return UITextInput;
}(PureComponent);

UITextInput.contextType = FieldsetContext;
UITextInput.propTypes = {
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  inputRef: refObject,
  onChange: PropTypes.func,
  placeholder: createLazyPropType(PropTypes.string),
  readOnly: PropTypes.bool,
  styled: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(TYPES),
  use: PropTypes.oneOf(Object.keys(USE_CLASSES)),
  value: PropTypes.string
};
UITextInput.defaultProps = {
  error: false,
  styled: true,
  type: 'text'
};
UITextInput.displayName = 'UITextInput';
export default ShareInput(UITextInput);