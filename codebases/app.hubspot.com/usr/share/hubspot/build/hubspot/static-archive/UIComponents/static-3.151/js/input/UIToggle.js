'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import { BATTLESHIP, CALYPSO, GYPSUM, HEFFALUMP, KOALA, OLAF, SLINKY, BUTTON_DISABLED_TEXT } from 'HubStyleTokens/colors';
import UICheckmark from '../icon/icons/UICheckmark';
import lazyEval from '../utils/lazyEval';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import { setBorderRadius, setUiTransition, uiFocus, FONT_FAMILIES, setFontSmoothing } from '../utils/Styles';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
import { hidden } from '../utils/propTypes/decorators';
import useFocused from '../hooks/useFocused';
import { useChecked, checkedPropTypes, checkedDefaultProps } from '../hooks/useChecked';
var SIZE_VALUES = {
  default: 40,
  sm: 32,
  xs: 26
};
var Outer = styled.label.withConfig({
  displayName: "UIToggle__Outer",
  componentId: "sc-744fpe-0"
})(["position:relative;display:inline-block;vertical-align:middle;user-select:none;color:", ";cursor:", ";"], function (_ref) {
  var isOnDark = _ref.isOnDark;
  return isOnDark && BATTLESHIP;
}, function (_ref2) {
  var disabledOrReadOnly = _ref2.disabledOrReadOnly;
  return disabledOrReadOnly ? 'not-allowed' : 'pointer';
});
var Switch = styled.span.withConfig({
  displayName: "UIToggle__Switch",
  componentId: "sc-744fpe-1"
})(["position:relative;display:inline-block;vertical-align:middle;height:", "px;width:", ";min-width:", "px;background-color:", ";box-shadow:", ";", ";.hubspot-enable-focus-styles &{", ";}"], function (_ref3) {
  var size = _ref3.size;
  return SIZE_VALUES[size];
}, function (_ref4) {
  var size = _ref4.size;
  return size !== 'default' && SIZE_VALUES[size] * 2 + "px";
}, function (_ref5) {
  var size = _ref5.size;
  return size === 'default' ? 80 : 0;
}, function (_ref6) {
  var checked = _ref6.checked,
      disabledOrReadOnly = _ref6.disabledOrReadOnly,
      isOnDark = _ref6.isOnDark,
      size = _ref6.size;
  if (disabledOrReadOnly) return GYPSUM;
  if (checked) return CALYPSO;
  if (isOnDark) return HEFFALUMP;
  return size === 'default' ? KOALA : GYPSUM;
}, function (_ref7) {
  var checked = _ref7.checked,
      isOnDark = _ref7.isOnDark;
  return !checked && "inset 0 0 0 1px " + (isOnDark ? SLINKY : BATTLESHIP);
}, setBorderRadius(), function (_ref8) {
  var focused = _ref8.focused;
  return focused && uiFocus;
});
var Handle = styled.span.withConfig({
  displayName: "UIToggle__Handle",
  componentId: "sc-744fpe-2"
})(["position:absolute;top:0;left:", ";transform:", ";height:", "px;width:", "px;padding:", "px;overflow:hidden;background-color:", ";box-shadow:", ";", ";", ";"], function (_ref9) {
  var checked = _ref9.checked;
  return checked ? '100%' : 0;
}, function (_ref10) {
  var checked = _ref10.checked;
  return checked && 'translateX(-100%)';
}, function (_ref11) {
  var size = _ref11.size;
  return SIZE_VALUES[size];
}, function (_ref12) {
  var size = _ref12.size;
  return SIZE_VALUES[size];
}, function (_ref13) {
  var size = _ref13.size;
  return size === 'xs' ? 5 : 7;
}, function (_ref14) {
  var disabledOrReadOnly = _ref14.disabledOrReadOnly;
  return disabledOrReadOnly ? GYPSUM : OLAF;
}, function (_ref15) {
  var checked = _ref15.checked,
      disabledOrReadOnly = _ref15.disabledOrReadOnly,
      isOnDark = _ref15.isOnDark;
  var boxShadowColor;

  if (disabledOrReadOnly) {
    boxShadowColor = BATTLESHIP;
  } else if (checked) {
    boxShadowColor = CALYPSO;
  } else {
    boxShadowColor = isOnDark ? SLINKY : BATTLESHIP;
  }

  return "0 0 0 1px " + boxShadowColor + ", 0 5px 5px 0 rgba(0, 0, 0, 0.08)";
}, setBorderRadius(), setUiTransition());
var Text = styled.span.withConfig({
  displayName: "UIToggle__Text",
  componentId: "sc-744fpe-3"
})(["position:relative;display:block;top:", ";", ";text-align:center;line-height:41px;padding-left:", "px;padding-right:", "px;visibility:", ";color:", ";", ";"], function (_ref16) {
  var checked = _ref16.checked,
      size = _ref16.size;
  return size === 'default' && !checked && '-40px';
}, FONT_FAMILIES.demibold, function (_ref17) {
  var checked = _ref17.checked;
  return checked ? 16 : 56;
}, function (_ref18) {
  var checked = _ref18.checked;
  return checked ? 56 : 16;
}, function (_ref19) {
  var visible = _ref19.visible;
  return !visible && 'hidden';
}, function (_ref20) {
  var checked = _ref20.checked,
      disabledOrReadOnly = _ref20.disabledOrReadOnly;
  if (disabledOrReadOnly) return BUTTON_DISABLED_TEXT;
  if (checked) return OLAF;
  return null;
}, setFontSmoothing());
var Checkmark = styled(function (_ref21) {
  var className = _ref21.className;
  return /*#__PURE__*/_jsx(UICheckmark, {
    className: className
  });
}).withConfig({
  displayName: "UIToggle__Checkmark",
  componentId: "sc-744fpe-4"
})(["fill:", ";stroke:", ";stroke-width:2;"], function (_ref22) {
  var disabledOrReadOnly = _ref22.disabledOrReadOnly;
  return disabledOrReadOnly ? BUTTON_DISABLED_TEXT : CALYPSO;
}, function (_ref23) {
  var disabledOrReadOnly = _ref23.disabledOrReadOnly;
  return disabledOrReadOnly ? GYPSUM : OLAF;
});
var UIToggle = memoWithDisplayName('UIToggle', function (props) {
  var className = props.className,
      disabled = props.disabled,
      __focused = props.focused,
      __onFocus = props.onFocus,
      __onBlur = props.onBlur,
      id = props.id,
      name = props.name,
      __checked = props.checked,
      __onChange = props.onChange,
      __defaultChecked = props.defaultChecked,
      onClick = props.onClick,
      readOnly = props.readOnly,
      size = props.size,
      textChecked = props.textChecked,
      textUnchecked = props.textUnchecked,
      use = props.use,
      rest = _objectWithoutProperties(props, ["className", "disabled", "focused", "onFocus", "onBlur", "id", "name", "checked", "onChange", "defaultChecked", "onClick", "readOnly", "size", "textChecked", "textUnchecked", "use"]);

  var _useChecked = useChecked(props),
      checked = _useChecked.checked,
      onChange = _useChecked.onChange;

  var disabledOrReadOnly = disabled || readOnly;
  var labelClassName = classNames("uiToggle private-form__toggle-switch", className, disabledOrReadOnly && 'private-form__toggle-switch--disabled');
  var switchClassName = "uiToggleSwitch private-form__toggle-switch__inner" + (checked ? " uiToggleSwitchOn" : "");

  var _useFocused = useFocused(props),
      focused = _useFocused.focused,
      onFocus = _useFocused.onFocus,
      onBlur = _useFocused.onBlur;

  var shorthandSize = toShorthandSize(size);
  var isOnDark = use === 'on-dark';

  var handleChange = function handleChange(evt) {
    if (disabledOrReadOnly) {
      evt.preventDefault();
      return;
    }

    onChange(evt);
  };

  return /*#__PURE__*/_jsxs(Outer, Object.assign({}, rest, {
    className: labelClassName,
    disabledOrReadOnly: disabledOrReadOnly,
    isOnDark: isOnDark,
    size: shorthandSize,
    onFocus: onFocus,
    onBlur: onBlur,
    children: [/*#__PURE__*/_jsx("input", {
      checked: checked,
      disabled: disabled,
      className: "private-form__toggle-input sr-only",
      id: id,
      name: name,
      onChange: handleChange,
      onClick: onClick,
      readOnly: readOnly,
      type: "checkbox"
    }), /*#__PURE__*/_jsxs(Switch, {
      checked: checked,
      className: switchClassName,
      disabledOrReadOnly: disabledOrReadOnly,
      focused: focused,
      role: "presentation",
      size: shorthandSize,
      isOnDark: isOnDark,
      children: [/*#__PURE__*/_jsx(Text, {
        checked: true,
        disabledOrReadOnly: disabledOrReadOnly,
        size: shorthandSize,
        visible: checked,
        className: shorthandSize !== 'default' && 'sr-only',
        children: lazyEval(textChecked)
      }), /*#__PURE__*/_jsx(Text, {
        checked: false,
        disabledOrReadOnly: disabledOrReadOnly,
        size: shorthandSize,
        visible: !checked,
        className: 'private-form__toggle-switch__label--unchecked' + (shorthandSize !== 'default' ? " sr-only" : ""),
        children: lazyEval(textUnchecked)
      }), /*#__PURE__*/_jsx(Handle, {
        checked: checked,
        disabledOrReadOnly: disabledOrReadOnly,
        isOnDark: isOnDark,
        size: shorthandSize,
        children: checked && /*#__PURE__*/_jsx(Checkmark, {
          disabledOrReadOnly: disabledOrReadOnly
        })
      })]
    })]
  }));
});
UIToggle.propTypes = Object.assign({}, checkedPropTypes, {
  disabled: PropTypes.bool,
  focused: hidden(PropTypes.bool),
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  size: PropTypes.oneOfType([propTypeForSizes(['xs', 'sm']), PropTypes.oneOf(['default'])]).isRequired,
  textChecked: createLazyPropType(PropTypes.node).isRequired,
  textUnchecked: createLazyPropType(PropTypes.node).isRequired,
  use: PropTypes.oneOf(['default', 'on-dark'])
});
UIToggle.defaultProps = Object.assign({}, checkedDefaultProps, {
  size: 'default',
  textChecked: function textChecked() {
    return I18n.text('salesUI.UIToggle.checkedLabel');
  },
  textUnchecked: function textUnchecked() {
    return I18n.text('salesUI.UIToggle.uncheckedLabel');
  },
  use: 'default'
});
export default UIToggle;