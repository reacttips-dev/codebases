'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Children, cloneElement, Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import * as colors from 'HubStyleTokens/colors';
import { memoizedSequence } from '../core/Functions';
import UIIcon from '../icon/UIIcon';
import UIFloatingFormLabel from '../form/UIFloatingFormLabel';
import { Small } from '../elements';
import UIDropdownCaret from '../dropdown/UIDropdownCaret';
import { hidden } from '../utils/propTypes/decorators';
import FocusProvider from '../providers/FocusProvider';
import HoverProvider from '../providers/HoverProvider';
import { uniqueId } from '../utils/underscore';
import { warnIfFragment } from '../utils/devWarnings';

var hiddenCaretRenderer = function hiddenCaretRenderer(props) {
  return /*#__PURE__*/_jsx(UIDropdownCaret, Object.assign({}, props, {
    hidden: true
  }));
};

var getChildProps = function getChildProps(props) {
  return Children.only(props.children).props;
};

var getInputHasPlaceholder = function getInputHasPlaceholder(children) {
  var childProps = Children.only(children).props; // The `format` prop check is special-casing for UIDateInput and UITimeInput

  return !!(childProps.placeholder || childProps.format);
};

var UIFloatingFormControl = /*#__PURE__*/function (_Component) {
  _inherits(UIFloatingFormControl, _Component);

  function UIFloatingFormControl(props) {
    var _this;

    _classCallCheck(this, UIFloatingFormControl);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIFloatingFormControl).call(this, props));

    _this.updateHasClosedDropdown = function () {
      if (!_this._isMounted) {
        return;
      }

      var newHasClosedDropdown = !!_this._el.querySelector('[data-dropdown-open="false"]');

      if (_this.state.hasClosedDropdown !== newHasClosedDropdown) {
        _this.setState({
          hasClosedDropdown: newHasClosedDropdown
        });
      }
    };

    _this.handleInputChange = function (evt) {
      _this.setState({
        inputValue: evt.target.value
      });
    };

    _this.handleLabelOnMouseDown = function (evt) {
      var focused = _this.props.focused;
      if (focused) evt.preventDefault();
    };

    _this.handleOverlayBlur = function () {
      _this.setState({
        overlayHasFocus: false
      });
    };

    _this.handleOverlayFocus = function () {
      _this.setState({
        overlayHasFocus: true
      });
    };

    _this.handleEditIconClick = function (evt) {
      if (_this._inputRef && typeof _this._inputRef.focus === 'function') {
        evt.stopPropagation();

        _this._inputRef.focus();
      }
    };

    _this.state = {
      hasClosedDropdown: false,
      inputId: '',
      inputValue: getChildProps(props).defaultValue,
      overlayHasFocus: false
    };
    return _this;
  }

  _createClass(UIFloatingFormControl, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMounted = true;
      this._el = findDOMNode(this);
      if (!this._el) return;
      this.updateHasClosedDropdown();
      this.startMutationObserver();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
      this.stopMutationObserver();
    }
  }, {
    key: "startMutationObserver",
    value: function startMutationObserver() {
      if (!this._el) return;
      this._observer = new MutationObserver(this.updateHasClosedDropdown);

      this._observer.observe(this._el, {
        attributes: true,
        subtree: true
      });
    }
  }, {
    key: "stopMutationObserver",
    value: function stopMutationObserver() {
      if (this._observer) {
        this._observer.disconnect();

        this._observer = null;
      }
    }
  }, {
    key: "renderClonedInput",
    value: function renderClonedInput(children, error, focused, hasClosedDropdown, hasPlaceholder, hovered, inputHasValue, inputId, readOnly, required) {
      var _this2 = this;

      var child = Children.only(children);
      var childProps = child.props; // if the child input doesn't declare `readOnly`, pass it down

      var computedReadOnly = childProps.readOnly == null ? readOnly : childProps.readOnly; // if the child input doesn't declare `required`, pass it down

      var computedRequired = childProps.required == null ? required : childProps.required;
      var cloneProps = {
        className: classNames(childProps.className, 'private-form__control--inline', hasPlaceholder && !inputHasValue && 'private-form__control--inline--show-placeholder'),
        id: inputId,
        error: error,
        readOnly: computedReadOnly,
        required: computedRequired,
        'aria-required': computedRequired,
        onChange: memoizedSequence(this.handleInputChange, childProps.onChange),
        ref: function ref(inputRef) {
          _this2._inputRef = inputRef;
        }
      }; // if the child has a closed dropdown, tell it not to render a caret

      if (hasClosedDropdown && !focused && !hovered) cloneProps.caretRenderer = hiddenCaretRenderer;
      warnIfFragment(child, UIFloatingFormControl.displayName);
      return /*#__PURE__*/cloneElement(child, cloneProps);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          _children = _this$props.children,
          className = _this$props.className,
          error = _this$props.error,
          __focused = _this$props.focused,
          hideEditIcon = _this$props.hideEditIcon,
          htmlFor = _this$props.htmlFor,
          isStatic = _this$props.isStatic,
          label = _this$props.label,
          labelProps = _this$props.labelProps,
          overlayContent = _this$props.overlayContent,
          readOnly = _this$props.readOnly,
          required = _this$props.required,
          validationMessage = _this$props.validationMessage,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "error", "focused", "hideEditIcon", "htmlFor", "isStatic", "label", "labelProps", "overlayContent", "readOnly", "required", "validationMessage"]);

      var _this$state = this.state,
          hasClosedDropdown = _this$state.hasClosedDropdown,
          inputId = _this$state.inputId,
          inputValue = _this$state.inputValue,
          overlayHasFocus = _this$state.overlayHasFocus;
      return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, this.props, {
        children: function children(hoverProviderProps) {
          return /*#__PURE__*/_jsx(FocusProvider, Object.assign({}, _this3.props, {
            children: function children(focusProviderProps) {
              var focused = focusProviderProps.focused,
                  focusProviderRestProps = _objectWithoutProperties(focusProviderProps, ["focused"]);

              var hovered = hoverProviderProps.hovered,
                  hoverProviderRestProps = _objectWithoutProperties(hoverProviderProps, ["hovered"]);

              var generatedHtmlFor = htmlFor || inputId;
              var computedClassName = classNames("private-form__set private-form__set--floating", className, error && 'private-form__set--error', focused && 'private-form__set--floating--focused');
              var hasPlaceholder = getInputHasPlaceholder(_children);
              var inputHasValue = Boolean(Array.isArray(inputValue) ? inputValue.length : inputValue);

              var renderedLabel = label && /*#__PURE__*/_jsx(UIFloatingFormLabel, Object.assign({}, labelProps, {
                floatActive: hovered || focused || inputHasValue || hasPlaceholder || isStatic,
                error: error,
                htmlFor: generatedHtmlFor,
                onMouseDown: _this3.handleLabelOnMouseDown,
                readOnly: readOnly,
                required: required,
                children: label
              }));

              var renderedInput = isStatic ? /*#__PURE__*/_jsx("div", {
                className: "private-form__control-floating__static-input-wrapper",
                children: _children
              }) : _this3.renderClonedInput(_children, error, focused, hasClosedDropdown, hasPlaceholder, hovered, inputHasValue, inputId, readOnly, required);
              return /*#__PURE__*/_jsxs("div", Object.assign({
                className: computedClassName
              }, rest, {}, focusProviderRestProps, {}, hoverProviderRestProps, {
                children: [renderedLabel, renderedInput, (overlayContent || !hideEditIcon) && /*#__PURE__*/_jsxs("div", {
                  className: classNames('private-form__control__overlay', overlayHasFocus ? 'private-form__control__overlay--visible' : focused && 'private-form__control__overlay--hidden'),
                  onFocus: _this3.handleOverlayFocus,
                  onBlur: _this3.handleOverlayBlur,
                  children: [hideEditIcon || readOnly ? null : /*#__PURE__*/_jsx(UIIcon, {
                    className: "private-form__control-floating__edit-icon",
                    color: colors.CALYPSO,
                    name: "edit",
                    onClick: _this3.handleEditIconClick,
                    size: 12
                  }), overlayContent]
                }), validationMessage && /*#__PURE__*/_jsx("div", {
                  className: "private-form__validation-wrapper",
                  children: /*#__PURE__*/_jsx(Small, {
                    className: "private-form__validation",
                    use: error ? 'error' : 'success',
                    children: validationMessage
                  })
                })]
              }));
            }
          }));
        }
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var childProps = getChildProps(props);
      var inputId = childProps.id;
      var inputValue = childProps.value;
      return Object.assign({}, state, {
        inputId: inputId || state.inputId || uniqueId('floating-input-'),
        inputValue: inputValue !== undefined ? inputValue : state.inputValue
      });
    }
  }]);

  return UIFloatingFormControl;
}(Component);

export { UIFloatingFormControl as default };
UIFloatingFormControl.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.bool,
  focused: hidden(PropTypes.bool),
  hideEditIcon: PropTypes.bool.isRequired,
  htmlFor: PropTypes.string,
  isStatic: PropTypes.bool.isRequired,
  overlayContent: PropTypes.node,
  label: PropTypes.node,
  labelProps: PropTypes.object,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  validationMessage: PropTypes.node
};
UIFloatingFormControl.defaultProps = {
  error: false,
  hideEditIcon: false,
  isStatic: false
};
UIFloatingFormControl.displayName = 'UIFloatingFormControl';
UIFloatingFormControl.hiddenCaretRenderer = hiddenCaretRenderer;