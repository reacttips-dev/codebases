'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { BATTLESHIP, CALYPSO, EERIE, GYPSUM, HEFFALUMP, OLAF } from 'HubStyleTokens/colors';
import { INPUT_FONT_SIZE } from 'HubStyleTokens/sizes';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import memoizeOne from 'react-utils/memoizeOne';
import styled, { css } from 'styled-components';
import { callIfPossible, wrapRefObject } from '../core/Functions';
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import UIIcon from '../icon/UIIcon';
import FocusProvider from '../providers/FocusProvider';
import HoverProvider from '../providers/HoverProvider';
import { fontsLoaded, fontsLoadedPromise } from '../utils/Fonts';
import { getTextWidth } from '../utils/MeasureText';
import { hidden } from '../utils/propTypes/decorators';
import refObject from '../utils/propTypes/refObject';
import { getPlaceholderStyles, setUiTransition, uiFocus } from '../utils/Styles';
var INPUT_MAX_LENGTH_WARNING_THRESHOLD = 15;

var getStyle = function getStyle(inputWidth) {
  return {
    width: inputWidth
  };
};

var placeholderStyles = getPlaceholderStyles(css(["color:", ";"], function (_ref) {
  var use = _ref.use;
  return use === 'on-dark' ? BATTLESHIP : EERIE;
}));

var computeBackgroundColor = function computeBackgroundColor(_ref2) {
  var focused = _ref2.focused,
      hovered = _ref2.hovered,
      use = _ref2.use;
  if (!focused && !hovered) return 'transparent';
  return use === 'on-dark' ? HEFFALUMP : GYPSUM;
};

var Wrapper = styled.div.withConfig({
  displayName: "UIAutosizedTextInput__Wrapper",
  componentId: "sc-1dxar2k-0"
})(["display:inline-block;position:relative;max-width:100%;color:", ";"], function (_ref3) {
  var use = _ref3.use;
  return use === 'on-dark' && OLAF;
});
var Input = styled.input.withConfig({
  displayName: "UIAutosizedTextInput__Input",
  componentId: "sc-1dxar2k-1"
})(["background-color:transparent;border:0;box-sizing:content-box;color:inherit;cursor:text;max-width:100%;outline:", ";&:not(:empty){display:inline-block;}", ";"], function (_ref4) {
  var affordance = _ref4.affordance;
  return affordance && 0;
}, placeholderStyles);
var Affordance = styled.div.withConfig({
  displayName: "UIAutosizedTextInput__Affordance",
  componentId: "sc-1dxar2k-2"
})(["", ""], function (_ref5) {
  var show = _ref5.show;
  return show && css(["display:inline-block;margin:-4px 0 -4px -4px;max-width:calc(100% + 4px);padding:4px 38px 4px 4px;background-color:", ";", ";"], computeBackgroundColor, function (_ref6) {
    var focused = _ref6.focused;
    return focused && uiFocus;
  });
});
var Icon = styled(function (props) {
  var __focused = props.focused,
      rest = _objectWithoutProperties(props, ["focused"]);

  return /*#__PURE__*/_jsx(UIIcon, Object.assign({
    name: "edit",
    size: "small"
  }, rest));
}).withConfig({
  displayName: "UIAutosizedTextInput__Icon",
  componentId: "sc-1dxar2k-3"
})(["position:absolute;top:50%;right:10px;transform:translateY(-50%);font-size:", ";color:", ";pointer-events:none;opacity:", ";", ";"], INPUT_FONT_SIZE, function (_ref7) {
  var use = _ref7.use;
  return use === 'on-dark' ? OLAF : CALYPSO;
}, function (_ref8) {
  var focused = _ref8.focused;
  return focused ? 0 : 1;
}, setUiTransition());

var getCharacterCounterOpacity = function getCharacterCounterOpacity(_ref9) {
  var focused = _ref9.focused,
      maxLength = _ref9.maxLength,
      _ref9$value = _ref9.value,
      value = _ref9$value === void 0 ? '' : _ref9$value;
  return focused && maxLength - value.length <= INPUT_MAX_LENGTH_WARNING_THRESHOLD ? 1 : 0;
};

var CharacterCounter = styled(function (props) {
  var ariaLiveRegionId = props.ariaLiveRegionId,
      maxLength = props.maxLength,
      _props$value = props.value,
      value = _props$value === void 0 ? '' : _props$value,
      focused = props.focused,
      rest = _objectWithoutProperties(props, ["ariaLiveRegionId", "maxLength", "value", "focused"]);

  if (!maxLength) return null;
  var charactersRemaining = maxLength - value.length; // Render hidden text when approaching the threshold

  if (charactersRemaining > INPUT_MAX_LENGTH_WARNING_THRESHOLD + 1) {
    return null;
  }

  var displayedCharactersRemaining = charactersRemaining > INPUT_MAX_LENGTH_WARNING_THRESHOLD ? INPUT_MAX_LENGTH_WARNING_THRESHOLD : charactersRemaining;
  return /*#__PURE__*/_jsxs("div", Object.assign({}, rest, {
    children: [/*#__PURE__*/_jsx("span", {
      "aria-hidden": true,
      children: displayedCharactersRemaining
    }), getCharacterCounterOpacity({
      focused: focused,
      maxLength: maxLength,
      value: value
    }) === 1 && /*#__PURE__*/_jsx("span", {
      id: ariaLiveRegionId,
      className: "sr-only",
      "aria-live": "polite",
      "aria-atomic": true,
      children: I18n.text('ui.autosizedTextInput.charactersRemaining', {
        value: charactersRemaining
      })
    })]
  }));
}).withConfig({
  displayName: "UIAutosizedTextInput__CharacterCounter",
  componentId: "sc-1dxar2k-4"
})(["position:absolute;top:50%;right:12px;transform:translateY(-50%);font-size:", ";color:", ";pointer-events:none;opacity:", ";", ";"], INPUT_FONT_SIZE, function (_ref10) {
  var use = _ref10.use;
  return use === 'on-dark' ? BATTLESHIP : EERIE;
}, getCharacterCounterOpacity, setUiTransition());
var uuid = 0;

var UIAutosizedTextInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIAutosizedTextInput, _PureComponent);

  function UIAutosizedTextInput(props) {
    var _this;

    _classCallCheck(this, UIAutosizedTextInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIAutosizedTextInput).call(this, props));

    _this.handleClick = function (evt) {
      var _this$props = _this.props,
          inputRef = _this$props.inputRef,
          onClick = _this$props.onClick;
      callIfPossible(onClick, evt);

      if (!evt.preventPrevented) {
        if (inputRef && inputRef.current) inputRef.current.focus();
      }
    };

    _this.state = {
      inputWidth: props.minWidth
    };
    _this._getStyle = memoizeOne(getStyle);
    _this._ariaLiveRegionId = "uiautosizedtextinput-maxlength-warning-" + uuid++;
    return _this;
  }

  _createClass(UIAutosizedTextInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.measureWidth(); // Initial width calculation may break when fonts become ready

      if (!fontsLoaded()) {
        fontsLoadedPromise.then(function () {
          _this2.measureWidth();
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // ⚠️ This condition prevents infinite loops! ⚠️
      if (prevState.inputWidth === this.state.inputWidth) {
        this.measureWidth();
      }
    }
  }, {
    key: "measureWidth",
    value: function measureWidth() {
      var _this$props2 = this.props,
          inputRef = _this$props2.inputRef,
          minWidth = _this$props2.minWidth;
      if (!inputRef.current) return;
      var newInputWidth = Math.ceil(Math.max(minWidth || 0, getTextWidth(inputRef.current)));

      if (this.state.inputWidth !== newInputWidth) {
        this.setState({
          inputWidth: newInputWidth
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props3 = this.props,
          ariaDescribedBy = _this$props3['aria-describedby'],
          affordance = _this$props3.affordance,
          affordanceClassName = _this$props3.affordanceClassName,
          className = _this$props3.className,
          error = _this$props3.error,
          inputClassName = _this$props3.inputClassName,
          inputRef = _this$props3.inputRef,
          __minWidth = _this$props3.minWidth,
          __onBlur = _this$props3.onBlur,
          __onClick = _this$props3.onClick,
          __onFocus = _this$props3.onFocus,
          __onMouseEnter = _this$props3.onMouseEnter,
          __onMouseLeave = _this$props3.onMouseLeave,
          __onMouseMove = _this$props3.onMouseMove,
          readOnly = _this$props3.readOnly,
          use = _this$props3.use,
          maxLength = _this$props3.maxLength,
          value = _this$props3.value,
          rest = _objectWithoutProperties(_this$props3, ["aria-describedby", "affordance", "affordanceClassName", "className", "error", "inputClassName", "inputRef", "minWidth", "onBlur", "onClick", "onFocus", "onMouseEnter", "onMouseLeave", "onMouseMove", "readOnly", "use", "maxLength", "value"]);

      return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, this.props, {
        children: function children(hoverProviderProps) {
          return /*#__PURE__*/_jsx(FocusProvider, Object.assign({}, _this3.props, {
            children: function children(focusProviderProps) {
              var hovered = hoverProviderProps.hovered,
                  hoverProviderRestProps = _objectWithoutProperties(hoverProviderProps, ["hovered"]);

              var focused = focusProviderProps.focused,
                  focusProviderRestProps = _objectWithoutProperties(focusProviderProps, ["focused"]);

              var inputWidth = _this3.state.inputWidth;
              var hasIcon = affordance && !readOnly;
              return /*#__PURE__*/_jsxs(Wrapper, Object.assign({}, hoverProviderRestProps, {}, focusProviderRestProps, {
                className: classNames('private-expanding-text-input', className),
                focused: focused,
                hovered: hovered,
                onClick: _this3.handleClick,
                use: use,
                children: [/*#__PURE__*/_jsx(Affordance, {
                  className: affordance ? classNames(affordanceClassName, error && 'private-form__control--error') : '',
                  focused: focused,
                  hovered: hovered,
                  show: affordance,
                  use: use,
                  children: /*#__PURE__*/_jsx(Input, Object.assign({}, rest, {
                    "aria-describedby": classNames(ariaDescribedBy, _this3._ariaLiveRegionId),
                    value: value,
                    maxLength: maxLength,
                    affordance: affordance,
                    className: inputClassName,
                    focused: focused,
                    hovered: hovered,
                    readOnly: readOnly,
                    ref: function ref(_ref11) {
                      wrapRefObject(inputRef)(findDOMNode(_ref11));
                    },
                    style: _this3._getStyle(inputWidth),
                    use: use
                  }))
                }), hasIcon && /*#__PURE__*/_jsx(CharacterCounter, {
                  value: value,
                  maxLength: maxLength,
                  use: use,
                  focused: focused,
                  ariaLiveRegionId: _this3._ariaLiveRegionId
                }), hasIcon && /*#__PURE__*/_jsx(Icon, {
                  focused: focused,
                  use: use
                })]
              }));
            }
          }));
        }
      }));
    }
  }]);

  return UIAutosizedTextInput;
}(PureComponent);

UIAutosizedTextInput.propTypes = {
  value: PropTypes.string,
  maxLength: PropTypes.number,
  error: PropTypes.bool,
  focused: hidden(PropTypes.bool),
  hovered: hidden(PropTypes.bool),
  minWidth: PropTypes.number,
  affordance: PropTypes.bool,
  affordanceClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  inputRef: refObject,
  readOnly: PropTypes.bool,
  use: PropTypes.oneOf(['default', 'on-dark']).isRequired,
  'aria-describedby': hidden(PropTypes.string)
};
UIAutosizedTextInput.defaultProps = {
  affordance: false,
  inputClassName: '',
  use: 'default'
};
UIAutosizedTextInput.displayName = 'UIAutosizedTextInput';
export default ShareInput(Controllable(UIAutosizedTextInput));