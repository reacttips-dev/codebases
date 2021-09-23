'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ShareButton from '../decorators/ShareButton';
import UITooltip from '../tooltip/UITooltip';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import refObject from '../utils/propTypes/refObject';
import { wrapPropTypes } from '../utils/propTypes/wrapPropTypes';
import UIButton from './UIButton';

var UICopyButton = function UICopyButton(props) {
  var buttonRef = props.buttonRef,
      children = props.children,
      hint = props.hint,
      hintSuccess = props.hintSuccess,
      onClick = props.onClick,
      tooltipClassName = props.tooltipClassName,
      tooltipPlacement = props.tooltipPlacement,
      value = props.value,
      valueWhenCopied = props.valueWhenCopied,
      rest = _objectWithoutProperties(props, ["buttonRef", "children", "hint", "hintSuccess", "onClick", "tooltipClassName", "tooltipPlacement", "value", "valueWhenCopied"]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      tooltipActive = _useState2[0],
      setTooltipActive = _useState2[1];

  var handleTooltipOpenChange = function handleTooltipOpenChange(evt) {
    // Every time the tooltip opens, reset to the original title
    if (evt.target.value) {
      if (tooltipActive) setTooltipActive(false);
    }
  };

  var handleClick = function handleClick(evt) {
    var textarea = document.createElement('textarea');
    var parentEl = buttonRef.current.parentElement;
    parentEl.appendChild(textarea);
    textarea.value = valueWhenCopied(value);
    textarea.select();
    textarea.setSelectionRange(0, 999999); // Needed for iOS Safari

    try {
      document.execCommand('copy');
      setTooltipActive(true);
    } catch (err) {
      /* Ignore error */
    }

    parentEl.removeChild(textarea); // Restore focus to the button element

    buttonRef.current.focus();
    if (onClick) onClick(evt);
  };

  var tooltipTitle = tooltipActive ? lazyEval(hintSuccess) : lazyEval(hint);

  var renderedButtonContent = children || /*#__PURE__*/_jsx("span", {
    className: "private-button--internal-spacing",
    children: I18n.text('salesUI.UICopyInput.label')
  });

  return /*#__PURE__*/_jsx(UITooltip, {
    className: tooltipClassName,
    disabled: !tooltipTitle,
    onOpenChange: handleTooltipOpenChange,
    placement: tooltipPlacement,
    title: tooltipTitle,
    children: /*#__PURE__*/_jsx(UIButton, Object.assign({}, rest, {
      buttonRef: buttonRef,
      onClick: handleClick,
      children: renderedButtonContent
    }))
  });
};

UICopyButton.propTypes = Object.assign({}, wrapPropTypes(UIButton), {
  buttonRef: refObject.isRequired,
  children: PropTypes.node,
  hint: createLazyPropType(PropTypes.node).isRequired,
  hintSuccess: createLazyPropType(PropTypes.node).isRequired,
  onClick: PropTypes.func,
  tooltipClassName: PropTypes.string,
  tooltipPlacement: UITooltip.propTypes.placement,
  value: PropTypes.any,
  valueWhenCopied: PropTypes.func
});
UICopyButton.defaultProps = {
  hint: function hint() {
    return I18n.text('salesUI.UICopyInput.title');
  },
  hintSuccess: function hintSuccess() {
    return I18n.text('salesUI.UICopyInput.tooltipCopied');
  },
  tooltipPlacement: 'top',
  use: 'tertiary-light',
  valueWhenCopied: function valueWhenCopied(value) {
    return value;
  }
};
UICopyButton.displayName = 'UICopyButton';
export default ShareButton(UICopyButton);