'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { isFirefox } from '../../utils/BrowserTest';
import { isModifierPressed } from '../../utils/DomEvents';
import { toShorthandSize } from '../../utils/propTypes/tshirtSize';
import { SIZE_OPTIONS } from '../CheckboxConstants';
import { INPUT_FONT_SIZE, INPUT_SM_FONT_SIZE } from 'HubStyleTokens/sizes';
import { FLINT, KOALA } from 'HubStyleTokens/colors';
var CHECKBOX_MIN_HEIGHT = '32px';

var getAlignItems = function getAlignItems(props) {
  if (props.stackContents) {
    return 'flex-start;';
  }

  return 'center';
};

var getToggleInputWrapperFontSize = function getToggleInputWrapperFontSize(props) {
  if (props.shorthandSize === 'sm') {
    return '92%';
  }

  return '1rem';
};

var ToggleInputWrapperDiv = styled.div.withConfig({
  displayName: "ToggleInputWrapper__ToggleInputWrapperDiv",
  componentId: "sc-1ew3g1h-0"
})(["align-items:", ";font-size:", ";display:flex;min-height:", ";position:relative;@media screen and (-ms-high-contrast:active),(-ms-high-contrast:none){&::after{content:' ';display:inline-block;min-height:", ";}}", ";", " ", ";", ";", ";"], function (props) {
  return getAlignItems(props);
}, function (props) {
  return getToggleInputWrapperFontSize(props);
}, CHECKBOX_MIN_HEIGHT, CHECKBOX_MIN_HEIGHT, function (props) {
  return props.stackContents && css(["flex-direction:column;&:first-child{margin-top:0;}&::after{display:none;}+ ", "{margin-top:16px;}"], ToggleInputWrapperDiv);
}, function (props) {
  return props.shorthandSize === 'sm' && "margin-top: 0;";
}, function (props) {
  return props.readOnly && css([".private-checkbox__indicator{background-color:", " !important;border-color:", " !important;cursor:auto;color:", " !important;}"], KOALA, KOALA, FLINT);
}, function (props) {
  return props.disabled && css([".private-checkbox__indicator:not(.private-radio__indicator){background-color:", ";color:", " !important;}"], KOALA, FLINT);
}, function (props) {
  return props.inline && css(["display:inline-flex;min-height:", ";+ ", "{margin-left:1.25em;}"], CHECKBOX_MIN_HEIGHT, ToggleInputWrapperDiv);
});
var CheckboxLabel = styled.label.withConfig({
  displayName: "ToggleInputWrapper__CheckboxLabel",
  componentId: "sc-1ew3g1h-1"
})(["cursor:pointer;display:block;max-width:100%;", ";", ";&:hover .private-checkbox__indicator:not(.private-radio__indicator){background-color:", ";}&:hover .private-radio__circle{fill:", ";}"], function (props) {
  return props.disabled && 'cursor: not-allowed;';
}, function (props) {
  return props.readOnly && 'cursor: default;';
}, KOALA, KOALA);

var handleAlignmentType = function handleAlignmentType(alignment) {
  switch (alignment) {
    case 'baseline':
      return 'baseline';

    case 'center':
      return 'center';

    case 'end':
      return 'flex-end';

    default:
      return 'flex-start';
  }
};

var CheckboxInnerSpan = styled.span.withConfig({
  displayName: "ToggleInputWrapper__CheckboxInnerSpan",
  componentId: "sc-1ew3g1h-2"
})(["display:flex;align-items:", ";"], function (props) {
  return handleAlignmentType(props.alignment);
});
var CheckboxInnerTextSpan = styled.span.withConfig({
  displayName: "ToggleInputWrapper__CheckboxInnerTextSpan",
  componentId: "sc-1ew3g1h-3"
})(["position:relative;line-height:normal;max-width:100%;font-size:", ";padding-left:12px;top:0.0625em;", ";", ";.private-microcopy.is--text--help{margin-top:2px;}"], INPUT_FONT_SIZE, function (props) {
  return props.shorthandSize === 'sm' && css(["font-size:", ";padding-left:9px;top:auto;"], INPUT_SM_FONT_SIZE);
}, function (props) {
  return props.disabled && "color: " + FLINT;
});

var getCheckboxDescPadLeft = function getCheckboxDescPadLeft(props) {
  if (props.stackContents && props.shorthandSize === 'sm') {
    return 'padding-left: 25px;';
  }

  if (props.stackContents) {
    return 'padding-left: 32px;';
  }

  return '';
};

var CheckboxDescriptionSpan = styled.span.withConfig({
  displayName: "ToggleInputWrapper__CheckboxDescriptionSpan",
  componentId: "sc-1ew3g1h-4"
})(["margin-left:1ch;max-width:100%;position:relative;top:0.0625em;", ";", ";"], function (props) {
  return props.stackContents && "margin-left: 0;";
}, function (props) {
  return getCheckboxDescPadLeft(props);
});
var ToggleInputWrapper = /*#__PURE__*/forwardRef(function (props, ref) {
  var alignment = props.alignment,
      checked = props.checked,
      children = props.children,
      childWrapperId = props.childWrapperId,
      className = props.className,
      description = props.description,
      descriptionId = props.descriptionId,
      descriptionLayout = props.descriptionLayout,
      disabled = props.disabled,
      indicator = props.indicator,
      inline = props.inline,
      input = props.input,
      labelClassName = props.labelClassName,
      onChange = props.onChange,
      readOnly = props.readOnly,
      size = props.size,
      rest = _objectWithoutProperties(props, ["alignment", "checked", "children", "childWrapperId", "className", "description", "descriptionId", "descriptionLayout", "disabled", "indicator", "inline", "input", "labelClassName", "onChange", "readOnly", "size"]);

  var shorthandSize = toShorthandSize(size);
  return /*#__PURE__*/_jsxs(ToggleInputWrapperDiv, Object.assign({}, rest, {
    className: classNames(className, SIZE_OPTIONS[shorthandSize]),
    disabled: disabled,
    inline: inline,
    readOnly: readOnly,
    shorthandSize: shorthandSize,
    stackContents: description && descriptionLayout === 'vertical',
    ref: ref,
    children: [/*#__PURE__*/_jsx(CheckboxLabel, {
      className: labelClassName,
      disabled: disabled,
      readOnly: readOnly,
      onClick: function onClick(evt) {
        if (isFirefox() && isModifierPressed(evt)) {
          onChange(Object.assign({}, evt, {
            type: 'change',
            target: {
              checked: !checked
            }
          }));
        }
      },
      children: /*#__PURE__*/_jsxs(CheckboxInnerSpan, {
        alignment: alignment,
        children: [input, indicator, children && /*#__PURE__*/_jsx(CheckboxInnerTextSpan, {
          className: 'private-checkbox__text' + (shorthandSize === 'sm' ? " private-checkbox__text--small" : ""),
          shorthandSize: shorthandSize,
          disabled: disabled,
          id: childWrapperId,
          children: children
        })]
      })
    }), description && /*#__PURE__*/_jsx(CheckboxDescriptionSpan, {
      className: "private-checkbox__desc",
      shorthandSize: shorthandSize,
      stackContents: description && descriptionLayout === 'vertical',
      id: descriptionId,
      children: description
    })]
  }));
});
ToggleInputWrapper.displayName = 'ToggleInputWrapper';

if (process.env.NODE_ENV !== 'production') {
  ToggleInputWrapper.propTypes = {
    alignment: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    children: PropTypes.node,
    childWrapperId: PropTypes.string,
    className: PropTypes.string,
    description: PropTypes.node,
    descriptionId: PropTypes.string.isRequired,
    descriptionLayout: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    indicator: PropTypes.node.isRequired,
    inline: PropTypes.bool,
    input: PropTypes.node.isRequired,
    labelClassName: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    size: PropTypes.string
  };
}

export default ToggleInputWrapper;