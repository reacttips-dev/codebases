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
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import { USE_CLASSES } from './InputConstants';
import refObject from '../utils/propTypes/refObject';
import { FieldsetContext } from '../context/FieldsetContext';
import styled, { css } from 'styled-components';
import { remCalc } from '../core/Style';
import { rgba } from '../core/Color';
import { setInputMetrics, setInputAppearance, setUiTransition, uiFocus, setFontSize, getPlaceholderStyles } from '../utils/Styles';
import { INPUT_DEFAULT_HEIGHT, INPUT_DEFAULT_PADDING_Y, INPUT_DEFAULT_PADDING_X, INPUT_SM_FONT_SIZE, INPUT_SM_HEIGHT, FOCUS_RING_BORDER_ALPHA, TEXT_AREA_CODE_HEIGHT } from 'HubStyleTokens/sizes';
import { WEB_FONT_REGULAR, WEB_FONT_REGULAR_WEIGHT, FALLBACK_FONT_STACK, CODE_FONT_FAMILY, CODE_FALLBACK_FONT_STACK, CODE_FONT_WEIGHT } from 'HubStyleTokens/misc';
import { FORM_CONTROL_BORDER_COLOR, FORM_CONTROL_READONLY_BACKGROUND_COLOR, FORM_CONTROL_READONLY_BORDER_COLOR, FORM_PLACEHOLDER_COLOR, FORM_DISABLED_BACKGROUND_COLOR, FORM_DISABLED_COLOR, CODE_FOREGROUND_COLOR } from 'HubStyleTokens/theme';
import { CANDY_APPLE, OLAF, FOCUS_RING_BASE, BATTLESHIP, EERIE } from 'HubStyleTokens/colors';
var placeholderStyles = getPlaceholderStyles(css(["color:", ";"], function (_ref) {
  var $unstyled = _ref.$unstyled,
      use = _ref.use;

  if ($unstyled && use === 'on-dark') {
    return FORM_PLACEHOLDER_COLOR;
  } else if (use === 'on-dark') {
    return BATTLESHIP;
  }

  return EERIE;
}));
var StyledTextArea = styled.textarea.withConfig({
  displayName: "UITextArea__StyledTextArea",
  componentId: "sc-1473di9-0"
})(["color:", ";", ";", ";", ";", ";height:auto;", " ", " ", " font-family:", ";font-weight:", ";min-height:", ";resize:", ";", " ", " ", " &:focus{border-color:", ";outline:0;", ";", "}&:disabled{background-color:", ";border-color:", ";box-shadow:none !important;color:", ";cursor:not-allowed;}&[readonly]{&:not([aria-expanded='true']){&:not(.private-form__control--inline){background-color:", ";border-color:", ";box-shadow:none;}}}"], function (_ref2) {
  var $isCode = _ref2.$isCode;
  return $isCode ? CODE_FOREGROUND_COLOR : FORM_PLACEHOLDER_COLOR;
}, placeholderStyles, setInputAppearance(), setInputMetrics(parseInt(INPUT_DEFAULT_PADDING_Y, 10) - 1, INPUT_DEFAULT_PADDING_X), setUiTransition(), function (_ref3) {
  var $unstyled = _ref3.$unstyled,
      use = _ref3.use;

  if ($unstyled) {
    return css(["background-color:transparent !important;"]);
  } else if (use === 'on-dark') {
    return css(["background-color:", ";"], OLAF);
  }

  return null;
}, function (_ref4) {
  var error = _ref4.error,
      $isCode = _ref4.$isCode,
      $unstyled = _ref4.$unstyled;

  if (error) {
    return css(["border-color:", " !important;"], CANDY_APPLE);
  } else if ($isCode) {
    return css(["border-color:", " !important;"], FORM_CONTROL_BORDER_COLOR);
  } else if ($unstyled) {
    return css(["border-color:transparent !important;"]);
  }

  return null;
}, function (_ref5) {
  var error = _ref5.error,
      $unstyled = _ref5.$unstyled;

  if (error) {
    return css(["box-shadow:0 0 0 1px ", " !important;"], CANDY_APPLE);
  } else if ($unstyled) {
    return css(["box-shadow:none !important;"]);
  }

  return null;
}, function (_ref6) {
  var $isCode = _ref6.$isCode;
  return $isCode ? CODE_FONT_FAMILY + ", " + CODE_FALLBACK_FONT_STACK + " !important" : WEB_FONT_REGULAR + ", " + FALLBACK_FONT_STACK + " !important";
}, function (_ref7) {
  var $isCode = _ref7.$isCode;
  return $isCode ? CODE_FONT_WEIGHT + " !important" : WEB_FONT_REGULAR_WEIGHT + " !important";
}, function (_ref8) {
  var $isCode = _ref8.$isCode,
      rows = _ref8.rows;

  if ($isCode) {
    return remCalc(TEXT_AREA_CODE_HEIGHT);
  } else if (rows) {
    return '0';
  }

  return remCalc(INPUT_DEFAULT_HEIGHT);
}, function (_ref9) {
  var resize = _ref9.resize;
  return !resize && 'none' || resize === 'horizontal' && 'horizontal' || resize === 'vertical' && 'vertical';
}, function (_ref10) {
  var resize = _ref10.resize;
  return !resize && css(["display:inline-block;"]);
}, function (_ref11) {
  var cols = _ref11.cols;
  return cols > 0 && css(["width:auto;"]);
}, function (_ref12) {
  var $fieldsize = _ref12.$fieldsize;
  return $fieldsize === 'small' && css(["", ";height:", ";padding-bottom:", ";padding-top:", ";"], setFontSize(INPUT_SM_FONT_SIZE), remCalc(INPUT_SM_HEIGHT), remCalc(4), remCalc(4));
}, rgba(FOCUS_RING_BASE, FOCUS_RING_BORDER_ALPHA), function (_ref13) {
  var readOnly = _ref13.readOnly,
      $unstyled = _ref13.$unstyled;
  return !readOnly && !$unstyled && uiFocus;
}, function (_ref14) {
  var error = _ref14.error,
      $unstyled = _ref14.$unstyled;
  return error && !$unstyled && css(["box-shadow:0 0 1px 2px ", " !important;"], CANDY_APPLE);
}, FORM_DISABLED_BACKGROUND_COLOR, FORM_DISABLED_BACKGROUND_COLOR, FORM_DISABLED_COLOR, FORM_CONTROL_READONLY_BACKGROUND_COLOR, FORM_CONTROL_READONLY_BORDER_COLOR);

var UITextArea = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITextArea, _PureComponent);

  function UITextArea() {
    _classCallCheck(this, UITextArea);

    return _possibleConstructorReturn(this, _getPrototypeOf(UITextArea).apply(this, arguments));
  }

  _createClass(UITextArea, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          inputRef = _this$props.inputRef,
          styledProp = _this$props.styled,
          rest = _objectWithoutProperties(_this$props, ["className", "inputRef", "styled"]);

      var fieldSize = this.context.size;
      var computedClassName = classNames('form-control', className);

      var renderedTextArea = /*#__PURE__*/_jsx(StyledTextArea, Object.assign({}, rest, {
        className: computedClassName,
        ref: inputRef,
        $unstyled: !styledProp,
        $fieldsize: fieldSize
      }));

      return renderedTextArea;
    }
  }]);

  return UITextArea;
}(PureComponent);

UITextArea.contextType = FieldsetContext;
UITextArea.displayName = 'UITextArea';
UITextArea.propTypes = {
  cols: PropTypes.number,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  inputRef: refObject,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  resize: PropTypes.oneOf(['vertical', 'horizontal', true, false]),
  rows: PropTypes.number,
  styled: PropTypes.bool.isRequired,
  use: PropTypes.oneOf(Object.keys(USE_CLASSES)),
  value: PropTypes.string
};
UITextArea.defaultProps = {
  error: false,
  resize: 'vertical',
  styled: true,
  value: ''
};
export default ShareInput(Controllable(UITextArea));