'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Controllable from '../../decorators/Controllable';
import { callIfPossible } from '../../core/Functions';
import SyntheticEvent from '../../core/SyntheticEvent';
import { isPageInKeyboardMode } from '../../listeners/focusStylesListener';
import { getAriaAndDataProps } from '../../utils/Props';
import refObject from '../../utils/propTypes/refObject';

var UISelectWithInputAnchor = /*#__PURE__*/function (_Component) {
  _inherits(UISelectWithInputAnchor, _Component);

  function UISelectWithInputAnchor() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UISelectWithInputAnchor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UISelectWithInputAnchor)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.focus = function () {
      if (_this._inputRef) {
        _this._inputRef.focus();
      }
    };

    _this.selectRefCallback = function (ref) {
      var selectRef = _this.props.selectRef;
      _this._selectRef = ref;

      if (selectRef) {
        selectRef(ref);
      }
    };

    _this.handleInputKeyDown = function (evt) {
      var readOnly = _this.props.readOnly;

      var internalSelect = _this.getInternalSelect();

      if (internalSelect && !readOnly) {
        internalSelect.handleKeyDown(evt);
      }
    };

    _this.handleInputChange = function (evt) {
      var onInputValueChange = _this.props.onInputValueChange;
      onInputValueChange(evt);

      var internalSelect = _this.getInternalSelect();

      if (internalSelect) {
        internalSelect.handleInputChange(evt);
      }
    };

    _this.handleInputFocus = function () {
      var _this$props = _this.props,
          onOpenChange = _this$props.onOpenChange,
          readOnly = _this$props.readOnly;

      var internalSelect = _this.getInternalSelect();

      if (readOnly) return;

      if (internalSelect) {
        internalSelect.setState({
          isOpen: true
        });
      }

      callIfPossible(onOpenChange, SyntheticEvent(true));
    };

    _this.handleInputBlur = function () {
      var onOpenChange = _this.props.onOpenChange;
      if (!isPageInKeyboardMode()) return;
      callIfPossible(onOpenChange, SyntheticEvent(false));
    };

    return _this;
  }

  _createClass(UISelectWithInputAnchor, [{
    key: "getInternalSelect",
    value: function getInternalSelect() {
      // Return our react-select component instance, or null
      if (!this._selectRef) {
        return null;
      }

      if (!this._selectRef.select) {
        return this._selectRef;
      } // _selectRef must be an <Async> or <Creatable> wrapper


      return this._selectRef.select;
    }
  }, {
    key: "getInternalAsyncSelect",
    value: function getInternalAsyncSelect() {
      // Return our react-select Async instance, or null
      if (!this._selectRef || !this._selectRef.select) {
        return null;
      }

      return this._selectRef;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          autoFocus = _this$props2.autoFocus,
          disabled = _this$props2.disabled,
          error = _this$props2.error,
          inputComponent = _this$props2.inputComponent,
          inputRef = _this$props2.inputRef,
          inputValue = _this$props2.inputValue,
          __onInputValueChange = _this$props2.onInputValueChange,
          __onOpenChange = _this$props2.onOpenChange,
          onPaste = _this$props2.onPaste,
          placeholder = _this$props2.placeholder,
          readOnly = _this$props2.readOnly,
          selectComponent = _this$props2.selectComponent,
          __selectRef = _this$props2.selectRef,
          tabIndex = _this$props2.tabIndex,
          value = _this$props2.value,
          rest = _objectWithoutProperties(_this$props2, ["autoFocus", "disabled", "error", "inputComponent", "inputRef", "inputValue", "onInputValueChange", "onOpenChange", "onPaste", "placeholder", "readOnly", "selectComponent", "selectRef", "tabIndex", "value"]);

      var InputComponent = inputComponent;
      var SelectComponent = selectComponent;
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(InputComponent, Object.assign({}, getAriaAndDataProps(rest), {
          autoFocus: autoFocus,
          disabled: disabled,
          "aria-invalid": error,
          inputRef: inputRef,
          onBlur: this.handleInputBlur,
          onChange: this.handleInputChange,
          onFocus: this.handleInputFocus,
          onKeyDown: this.handleInputKeyDown,
          onPaste: onPaste,
          placeholder: placeholder,
          readOnly: readOnly,
          ref: function ref(_ref) {
            _this2._inputRef = findDOMNode(_ref);
          },
          tabIndex: tabIndex,
          value: inputValue
        })), /*#__PURE__*/_jsx(SelectComponent, Object.assign({}, rest, {
          autosize: false,
          className: "hidden",
          disabled: disabled,
          ref: this.selectRefCallback,
          scrollMenuIntoView: false,
          value: value
        }))]
      });
    }
  }]);

  return UISelectWithInputAnchor;
}(Component);

UISelectWithInputAnchor.propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  menuWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  inputComponent: PropTypes.func.isRequired,
  inputRef: refObject,
  isOpen: PropTypes.bool.isRequired,
  onInputValueChange: PropTypes.func,
  onOpenChange: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  searchClassName: PropTypes.string,
  selectComponent: PropTypes.func.isRequired,
  selectRef: PropTypes.func,
  inputValue: PropTypes.string,
  value: PropTypes.any
};
UISelectWithInputAnchor.displayName = 'UISelectWithInputAnchor';
export default Controllable(UISelectWithInputAnchor, ['inputValue']);