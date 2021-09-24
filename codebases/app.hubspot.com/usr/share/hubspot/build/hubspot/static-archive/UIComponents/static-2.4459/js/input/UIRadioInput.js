'use es6'; // Prevent unwanted focus styles

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import '../listeners/focusStylesListener';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef, useContext, useMemo } from 'react';
import devLogger from 'react-utils/devLogger';
import useUniqueId from 'react-utils/hooks/useUniqueId';
import styled, { css } from 'styled-components';
import { CALYPSO, KOALA, OLAF } from 'HubStyleTokens/colors';
import { FieldsetContext } from '../context/FieldsetContext';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
import { ALIGNMENT_CLASSES } from './CheckboxConstants';
import ToggleInputWrapper from './internal/ToggleInputWrapper';
import { uiFocus } from '../utils/Styles';

var getRadioDeprecatedPatternStyles = function getRadioDeprecatedPatternStyles(props) {
  if (!props.hasChildren && props.shorthandSize === 'sm') {
    return css(["font-size:0.915em;margin-right:9px;vertical-align:baseline;"]);
  } else if (!props.hasChildren) {
    return css(["font-size:1.143em;margin-right:12px;vertical-align:text-bottom;"]);
  }

  return '';
};

var Radio = styled(ToggleInputWrapper).withConfig({
  displayName: "UIRadioInput__Radio",
  componentId: "jroedv-0"
})(["", " ", ";", ""], function (props) {
  return props.hasChildren && "user-select: none;";
}, function (props) {
  return !props.hasChildren && css(["min-height:0;&::after{display:none;}display:inline-block;"]);
}, function (props) {
  return getRadioDeprecatedPatternStyles(props);
});
var PrivateRadioDot = styled.circle.withConfig({
  displayName: "UIRadioInput__PrivateRadioDot",
  componentId: "jroedv-1"
})([""]);
var PrivateRadioIndicator = styled.span.withConfig({
  displayName: "UIRadioInput__PrivateRadioIndicator",
  componentId: "jroedv-2"
})(["flex-shrink:0;transition:all 150ms ease-out;background-color:", ";color:#cbd6e2;height:1.25em;left:0.0625em;position:relative;width:1.25em;border:0;border-radius:100%;"], OLAF);
var PrivateRadioInput = styled.input.withConfig({
  displayName: "UIRadioInput__PrivateRadioInput",
  componentId: "jroedv-3"
})(["&:checked{+ ", "{color:", ";", "{fill:currentColor;}}}+ ", "{", "{fill:$color-olaf;}}.hubspot-enable-focus-styles &:focus{&:not([readonly]) + ", "{", ";background-color:", ";border-color:currentColor;}&[readonly] + ", "{outline:auto;}}"], PrivateRadioIndicator, CALYPSO, PrivateRadioDot, PrivateRadioIndicator, PrivateRadioDot, PrivateRadioIndicator, uiFocus, KOALA, PrivateRadioIndicator);
var PrivateRadioCircle = styled.circle.withConfig({
  displayName: "UIRadioInput__PrivateRadioCircle",
  componentId: "jroedv-4"
})(["fill:", ";stroke:", ";"], function (props) {
  return props.$readOnly || props.$disabled ? KOALA : OLAF;
}, function (props) {
  return props.$readOnly && KOALA;
});
var UIRadioInput = /*#__PURE__*/forwardRef(function (props, ref) {
  var dataVrFocus = props['data-vr-focus'],
      ariaLabel = props['aria-label'],
      ariaLabelledBy = props['aria-labelledby'],
      autoFocus = props.autoFocus,
      checked = props.checked,
      children = props.children,
      className = props.className,
      color = props.color,
      defaultChecked = props.defaultChecked,
      description = props.description,
      disabled = props.disabled,
      id = props.id,
      name = props.name,
      _onChange = props.onChange,
      readOnly = props.readOnly,
      size = props.size,
      value = props.value,
      rest = _objectWithoutProperties(props, ["data-vr-focus", "aria-label", "aria-labelledby", "autoFocus", "checked", "children", "className", "color", "defaultChecked", "description", "disabled", "id", "name", "onChange", "readOnly", "size", "value"]);

  var _useContext = useContext(FieldsetContext),
      fieldSize = _useContext.size,
      fieldDisabled = _useContext.disabled;

  var descriptionId = useUniqueId('radio-');
  var childWrapperId = useUniqueId('radio-content-');
  var computedSize = size || fieldSize;
  var computedDisabled = disabled || fieldDisabled;
  var ariaLabelledByIds = classNames(ariaLabelledBy, children && childWrapperId);

  if (process.env.NODE_ENV !== 'production') {
    if (!name) {
      devLogger.warn({
        message: 'UIRadioInput: `name` must be specified. Try wrapping with `UIToggleGroup`.',
        key: 'UIRadioInput: name',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#defining_a_radio_group'
      });
    }

    if (children == null && !ariaLabel && !ariaLabelledBy) {
      devLogger.warn({
        message: "UIRadioInput: `aria-label` or `aria-labelledby` is required if you don't define `children`.",
        key: 'UICheckbox: no label'
      });
    }

    if (ariaLabel && (children || ariaLabelledBy)) {
      devLogger.warn({
        message: 'UIRadioInput: `aria-label` should not be used with `children` or `aria-labelledby`.',
        key: 'UIRadioInput: aria-label hides children',
        url: 'https://git.hubteam.com/HubSpot/UIComponents/pull/8473/files#r1011220'
      });
    }
  }

  var shorthandSize = toShorthandSize(computedSize);
  return /*#__PURE__*/_jsx(Radio, Object.assign({}, rest, {
    checked: checked,
    childWrapperId: childWrapperId,
    className: classNames(className, 'private-radio', !children ? 'private-checkbox--flush' : 'private-checkbox'),
    description: description,
    descriptionId: descriptionId,
    disabled: computedDisabled,
    hasChildren: !!children,
    input: /*#__PURE__*/_jsx(PrivateRadioInput, {
      "data-vr-focus": dataVrFocus,
      "aria-describedby": description ? descriptionId : null,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledByIds,
      autoFocus: autoFocus,
      checked: checked,
      className: "sr-only private-checkbox__input",
      defaultChecked: defaultChecked,
      disabled: computedDisabled,
      id: id,
      name: name,
      onChange: function onChange(evt) {
        if (disabled || readOnly) {
          evt.preventDefault();
          return;
        }

        if (_onChange) _onChange(evt);
      },
      readOnly: readOnly,
      type: "radio",
      value: value
    }),
    indicator: useMemo(function () {
      return /*#__PURE__*/_jsx(PrivateRadioIndicator, {
        className: "private-checkbox__indicator private-radio__indicator",
        "data-indicator": true,
        style: {
          color: color
        },
        children: /*#__PURE__*/_jsx("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 22 22",
          children: /*#__PURE__*/_jsxs("g", {
            fill: "none",
            fillRule: "evenodd",
            transform: "translate(1 1)",
            children: [/*#__PURE__*/_jsx(PrivateRadioCircle, {
              cx: "10",
              cy: "10",
              r: "10",
              className: "private-radio__circle",
              stroke: "currentColor",
              strokeWidth: "1.5",
              $readOnly: readOnly,
              $disabled: disabled
            }), /*#__PURE__*/_jsx(PrivateRadioDot, {
              className: "private-radio__dot",
              id: "a",
              cx: "10",
              cy: "10",
              r: "5"
            })]
          })
        })
      });
    }, [color, readOnly, disabled]),
    onChange: _onChange,
    readOnly: readOnly,
    shorthandSize: shorthandSize,
    ref: ref,
    size: computedSize,
    children: children
  }));
});
UIRadioInput.propTypes = {
  alignment: PropTypes.oneOf(Object.keys(ALIGNMENT_CLASSES)),
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string,
  autoFocus: PropTypes.bool,
  checked: PropTypes.bool,
  children: PropTypes.node,
  color: PropTypes.string,
  defaultChecked: PropTypes.bool,
  description: PropTypes.node,
  descriptionLayout: PropTypes.oneOf(['horizontal', 'vertical']),
  disabled: PropTypes.bool,
  inline: PropTypes.bool,
  labelClassName: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  size: PropTypes.oneOfType([propTypeForSizes(['sm']), PropTypes.oneOf(['default'])]),
  value: PropTypes.any
};
UIRadioInput.defaultProps = {
  alignment: 'start',
  descriptionLayout: 'vertical'
};
UIRadioInput.displayName = 'UIRadioInput';
export default UIRadioInput;