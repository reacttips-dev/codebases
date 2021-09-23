'use es6'; // Prevent unwanted focus styles

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import '../listeners/focusStylesListener';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef, useContext } from 'react';
import devLogger from 'react-utils/devLogger';
import useUniqueId from 'react-utils/hooks/useUniqueId';
import memoize from 'react-utils/memoize';
import styled, { css } from 'styled-components';
import { BATTLESHIP, CALYPSO, KOALA, OLAF } from 'HubStyleTokens/colors';
import { TOGGLE_BUTTON_SIZE } from 'HubStyleTokens/sizes';
import { FieldsetContext } from '../context/FieldsetContext';
import Checkable from '../decorators/Checkable';
import UICheckmark from '../icon/icons/UICheckmark';
import { propTypeForSizes } from '../utils/propTypes/tshirtSize';
import { getTabIndex } from '../utils/TabIndex';
import { ALIGNMENT_CLASSES } from './CheckboxConstants';
import ToggleInputWrapper from './internal/ToggleInputWrapper';
import { setUiTransition, uiFocus } from '../utils/Styles';
var Checkbox = styled(ToggleInputWrapper).withConfig({
  displayName: "UICheckbox__Checkbox",
  componentId: "sc-1cmxl7j-0"
})(["user-select:none;", ";", ";", ";"], function (props) {
  return props.description && props.descriptionLayout === 'vertical' && css(["flex-direction:column;flex-wrap:wrap;margin-top:6px;"]);
}, function (props) {
  return props.hasChildren && css(["height:", ";width:", ";"], TOGGLE_BUTTON_SIZE, TOGGLE_BUTTON_SIZE);
}, function (props) {
  return (props.hasChildren && !props.inline || props.innerPadding === 'none') && css(["display:block;min-height:0;"]);
});
var PrivateCheckboxIndicator = styled.span.withConfig({
  displayName: "UICheckbox__PrivateCheckboxIndicator",
  componentId: "sc-1cmxl7j-1"
})(["", " flex-shrink:0;background-color:", ";color:", ";height:1.25em;left:0.0625em;position:relative;width:1.25em;border:2px solid ", ";border-radius:3px;"], setUiTransition(), OLAF, BATTLESHIP, BATTLESHIP);
var PrivateCheckboxIconInner = styled(UICheckmark).withConfig({
  displayName: "UICheckbox__PrivateCheckboxIconInner",
  componentId: "sc-1cmxl7j-2"
})(["fill:currentColor;width:1em;"]);
var PrivateCheckboxIconInnerSVG = styled.path.withConfig({
  displayName: "UICheckbox__PrivateCheckboxIconInnerSVG",
  componentId: "sc-1cmxl7j-3"
})(["fill:currentColor;width:1em;"]);
var PrivateCheckboxIcon = styled.span.withConfig({
  displayName: "UICheckbox__PrivateCheckboxIcon",
  componentId: "sc-1cmxl7j-4"
})(["align-items:center;display:flex;justify-content:center;bottom:0;left:0;opacity:0;position:absolute;right:0;top:0;> svg{fill:currentColor;width:94%;}"]);
var PrivateCheckboxInput = styled.input.withConfig({
  displayName: "UICheckbox__PrivateCheckboxInput",
  componentId: "sc-1cmxl7j-5"
})(["&:checked{+ ", "{", "{fill:", ";opacity:1;}.private-checkbox__dash{opacity:0;}}}&.indeterminate:not(:checked){+ ", "{.private-checkbox__check{opacity:0;}.private-checkbox__dash{fill:", ";opacity:1;> svg{width:100%;}}}}&:checked,&.indeterminate{+ ", "{border-color:currentColor;color:", ";}}&:focus:not(:checked){+ ", "{border-color:", ";}}.hubspot-enable-focus-styles &:focus{&:not([readonly]) + ", "{", ";background-color:", ";border-color:currentColor;}&[readonly] + ", "{outline:auto;}}"], PrivateCheckboxIndicator, PrivateCheckboxIcon, CALYPSO, PrivateCheckboxIndicator, CALYPSO, PrivateCheckboxIndicator, CALYPSO, PrivateCheckboxIndicator, BATTLESHIP, PrivateCheckboxIndicator, uiFocus, KOALA, PrivateCheckboxIndicator);
var renderCheckmark = memoize(function () {
  return /*#__PURE__*/_jsx(PrivateCheckboxIconInner, {
    className: "private-checkbox__icon__inner"
  });
});
var renderDash = memoize(function () {
  return /*#__PURE__*/_jsx("svg", {
    role: "presentation",
    viewBox: "0 0 14 14",
    xmlns: "http://www.w3.org/2000/svg",
    children: /*#__PURE__*/_jsx(PrivateCheckboxIconInnerSVG, {
      className: "private-checkbox__icon__inner",
      d: "M 2 6 L12 6 L12 9 L2 9 L2 6 z"
    })
  });
});
var renderIndicator = memoize(function (color) {
  return /*#__PURE__*/_jsxs(PrivateCheckboxIndicator, {
    className: "private-checkbox__indicator",
    "data-indicator": true,
    style: {
      color: color
    },
    children: [/*#__PURE__*/_jsx(PrivateCheckboxIcon, {
      className: "private-checkbox__check",
      children: renderCheckmark()
    }), /*#__PURE__*/_jsx(PrivateCheckboxIcon, {
      className: "private-checkbox__dash",
      children: renderDash()
    })]
  });
});
var UICheckbox = /*#__PURE__*/forwardRef(function (props, ref) {
  var dataVrFocus = props['data-vr-focus'],
      ariaLabel = props['aria-label'],
      ariaLabelledBy = props['aria-labelledby'],
      autoFocus = props.autoFocus,
      checked = props.checked,
      children = props.children,
      className = props.className,
      color = props.color,
      description = props.description,
      disabled = props.disabled,
      id = props.id,
      indeterminate = props.indeterminate,
      name = props.name,
      _onChange = props.onChange,
      readOnly = props.readOnly,
      size = props.size,
      tabIndex = props.tabIndex,
      value = props.value,
      rest = _objectWithoutProperties(props, ["data-vr-focus", "aria-label", "aria-labelledby", "autoFocus", "checked", "children", "className", "color", "description", "disabled", "id", "indeterminate", "name", "onChange", "readOnly", "size", "tabIndex", "value"]);

  var _useContext = useContext(FieldsetContext),
      fieldSize = _useContext.size,
      fieldDisabled = _useContext.disabled;

  if (process.env.NODE_ENV !== 'production') {
    if (children == null && !ariaLabel && !ariaLabelledBy) {
      devLogger.warn({
        message: "UICheckbox: `aria-label` or `aria-labelledby` is required if you don't define `children`.",
        key: 'UICheckbox: no label'
      });
    }

    if (ariaLabel && (children || ariaLabelledBy)) {
      devLogger.warn({
        message: 'UICheckbox: `aria-label` should not be used with `children` or `aria-labelledby`.',
        key: 'UICheckbox: aria-label hides children',
        url: 'https://git.hubteam.com/HubSpot/UIComponents/pull/8473/files#r1011220'
      });
    }
  }

  var descriptionId = useUniqueId('checkbox-');
  var childWrapperId = useUniqueId('checkbox-content-');
  var computedDisabled = disabled || fieldDisabled;
  var computedSize = size || fieldSize;
  var ariaLabelledByIds = classNames(ariaLabelledBy, children && childWrapperId);
  return /*#__PURE__*/_jsx(Checkbox, Object.assign({}, rest, {
    checked: checked,
    childWrapperId: childWrapperId,
    className: classNames(className, 'private-checkbox'),
    description: description,
    descriptionId: descriptionId,
    disabled: computedDisabled,
    hasChildren: children == null,
    input: /*#__PURE__*/_jsx(PrivateCheckboxInput, {
      "data-vr-focus": dataVrFocus,
      "aria-describedby": description ? descriptionId : null,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledByIds,
      autoFocus: autoFocus,
      checked: checked,
      className: 'private-checkbox__input sr-only' + (indeterminate ? " indeterminate" : ""),
      disabled: computedDisabled,
      id: id,
      name: name,
      onChange: function onChange(evt) {
        if (disabled || readOnly) {
          evt.preventDefault();
          return;
        }

        _onChange(evt);
      },
      readOnly: readOnly,
      tabIndex: getTabIndex(readOnly || disabled, tabIndex),
      type: "checkbox",
      value: value
    }),
    indicator: renderIndicator(color),
    onChange: _onChange,
    readOnly: readOnly,
    ref: ref,
    size: computedSize,
    children: children
  }));
});
UICheckbox.propTypes = {
  alignment: PropTypes.oneOf(Object.keys(ALIGNMENT_CLASSES)),
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string,
  autoFocus: PropTypes.bool,
  checked: PropTypes.bool,
  children: PropTypes.node,
  color: PropTypes.string,
  description: PropTypes.node,
  descriptionLayout: PropTypes.oneOf(['horizontal', 'vertical']),
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  inline: PropTypes.bool,
  innerPadding: PropTypes.oneOf(['default', 'none']),
  labelClassName: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  size: PropTypes.oneOfType([propTypeForSizes(['sm']), PropTypes.oneOf(['default'])]),
  value: PropTypes.any
};
UICheckbox.defaultProps = {
  alignment: 'start',
  checked: false,
  descriptionLayout: 'vertical',
  innerPadding: 'default'
};
UICheckbox.displayName = 'UICheckbox';
export default Checkable(UICheckbox);