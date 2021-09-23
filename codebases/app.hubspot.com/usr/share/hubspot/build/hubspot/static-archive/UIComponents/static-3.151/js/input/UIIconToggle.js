'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { FLINT, MARIGOLD } from 'HubStyleTokens/colors';
import { MERCURY_LAYER } from 'HubStyleTokens/sizes';
import UIIcon from '../icon/UIIcon';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import Checkable from '../decorators/Checkable';
import { allSizes } from '../utils/propTypes/tshirtSize';
import { hidden } from '../utils/propTypes/decorators';
import { uiFocus } from '../utils/Styles';
/*
  If there is a percentage, the background icon will be the unchecked icon
  for the foreground icon to cover
*/

var foregroundIconStyles = css(["left:0;overflow:hidden;position:absolute;z-index:", ";width:", ";"], MERCURY_LAYER, function (_ref) {
  var percentFilled = _ref.percentFilled;
  return percentFilled != null ? percentFilled / 100 + "em" : '';
}); // Pass in allowed props to UIIcon

var StyledUIIcon = styled(function (_ref2) {
  var checked = _ref2.checked,
      className = _ref2.className,
      isForeground = _ref2.isForeground,
      percentFilled = _ref2.percentFilled,
      role = _ref2.role,
      size = _ref2.size;
  var backgroundIconUnchecked = !checked || percentFilled != null;
  return /*#__PURE__*/_jsx(UIIcon, {
    className: className,
    color: !isForeground && backgroundIconUnchecked ? FLINT : MARIGOLD,
    name: !isForeground && backgroundIconUnchecked ? 'favoriteHollow' : 'favorite',
    role: role,
    size: size
  });
}).withConfig({
  displayName: "UIIconToggle__StyledUIIcon",
  componentId: "sc-74w91p-0"
})(["line-height:117%;", ";"], function (_ref3) {
  var isForeground = _ref3.isForeground;
  return isForeground && foregroundIconStyles;
});
var StyledLabel = styled.label.withConfig({
  displayName: "UIIconToggle__StyledLabel",
  componentId: "sc-74w91p-1"
})(["display:inline-flex;position:relative;.hubspot-enable-focus-styles & input:focus ~ .private-icon{", ";}"], uiFocus);
var StyledUIIconToggle = styled(function (_ref4) {
  var __disabled = _ref4.disabled,
      __readOnly = _ref4.readOnly,
      rest = _objectWithoutProperties(_ref4, ["disabled", "readOnly"]);

  return /*#__PURE__*/_jsx(StyledLabel, Object.assign({}, rest));
}).withConfig({
  displayName: "UIIconToggle__StyledUIIconToggle",
  componentId: "sc-74w91p-2"
})(["cursor:", ";"], function (_ref5) {
  var disabled = _ref5.disabled,
      readOnly = _ref5.readOnly;
  return disabled || readOnly ? 'inherit' : 'pointer';
});
var UIIconToggle = memoWithDisplayName('UIIconToggle', function (props) {
  var active = props.active,
      ariaLabel = props['aria-label'],
      checked = props.checked,
      className = props.className,
      disabled = props.disabled,
      focus = props.focus,
      hover = props.hover,
      IconComponent = props.IconComponent,
      id = props.id,
      index = props.index,
      _onChange = props.onChange,
      percentFilled = props.percentFilled,
      readOnly = props.readOnly,
      size = props.size,
      tabIndex = props.tabIndex,
      rest = _objectWithoutProperties(props, ["active", "aria-label", "checked", "className", "disabled", "focus", "hover", "IconComponent", "id", "index", "onChange", "percentFilled", "readOnly", "size", "tabIndex"]);

  var hasPercentage = percentFilled != null;
  var sharedProps = {
    active: active,
    checked: checked,
    disabled: disabled,
    focus: focus,
    hover: hover,
    index: index,
    percentFilled: percentFilled,
    readOnly: readOnly,
    size: size
  };
  return /*#__PURE__*/_jsxs(StyledUIIconToggle, Object.assign({}, rest, {
    className: className,
    disabled: disabled,
    readOnly: readOnly,
    children: [/*#__PURE__*/_jsx("input", {
      "aria-label": ariaLabel,
      checked: checked,
      className: "sr-only",
      id: id,
      type: "checkbox",
      onChange: function onChange(evt) {
        if (disabled || readOnly) {
          evt.preventDefault();
          return;
        }

        _onChange(evt);
      },
      tabIndex: tabIndex
    }), /*#__PURE__*/_jsx(IconComponent, Object.assign({}, sharedProps, {
      isForeground: false
    })), hasPercentage && /*#__PURE__*/_jsx(IconComponent, Object.assign({}, sharedProps, {
      isForeground: true,
      role: "presentation"
    }))]
  }));
});
UIIconToggle.propTypes = {
  'aria-label': PropTypes.string.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  IconComponent: hidden(PropTypes.elementType),
  size: PropTypes.oneOfType([allSizes, PropTypes.oneOf(['xxs', 'xxl'])]),
  onChange: PropTypes.func,
  percentFilled: PropTypes.number,
  readOnly: PropTypes.bool
};
UIIconToggle.defaultProps = {
  checked: false,
  IconComponent: StyledUIIcon,
  size: 'xs',
  tabIndex: 0
};
export default Checkable(UIIconToggle);