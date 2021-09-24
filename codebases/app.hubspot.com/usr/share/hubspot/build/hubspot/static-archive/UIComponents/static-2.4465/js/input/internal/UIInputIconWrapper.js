'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { INPUT_DEFAULT_PADDING_X, INPUT_FONT_SIZE, INPUT_SM_FONT_SIZE, VENUS_LAYER } from 'HubStyleTokens/sizes';
import { BATTLESHIP } from 'HubStyleTokens/colors';
import UIIcon from '../../icon/UIIcon';
import { toPx } from '../../utils/Styles';
import { listAttrIncludes } from '../../utils/Dom';

var getFontSize = function getFontSize(size) {
  if (typeof size === 'number') return size;
  return parseInt(size === 'small' ? INPUT_SM_FONT_SIZE : INPUT_FONT_SIZE, 10);
};

var InputWrapper = styled.div.withConfig({
  displayName: "UIInputIconWrapper__InputWrapper",
  componentId: "sc-3w8iaf-0"
})(["position:relative;&& input{padding-left:", ";}"], function (_ref) {
  var inFloatingForm = _ref.inFloatingForm,
      size = _ref.size;
  return toPx((inFloatingForm ? 6 : parseInt(INPUT_DEFAULT_PADDING_X, 10) * 2) + getFontSize(size));
});
var IconWrapper = styled.div.withConfig({
  displayName: "UIInputIconWrapper__IconWrapper",
  componentId: "sc-3w8iaf-1"
})(["display:flex;align-items:center;position:absolute;top:0;bottom:0;left:0;padding:", ";pointer-events:none;.private-input-group &{z-index:", ";}"], function (_ref2) {
  var inFloatingForm = _ref2.inFloatingForm;
  return inFloatingForm ? '6px 0 0' : "0 " + INPUT_DEFAULT_PADDING_X;
}, VENUS_LAYER);
var Icon = styled(UIIcon).withConfig({
  displayName: "UIInputIconWrapper__Icon",
  componentId: "sc-3w8iaf-2"
})(["transform:translateY(1px);"]);

var UIInputIconWrapper = function UIInputIconWrapper(props) {
  var children = props.children,
      className = props.className,
      disabled = props.disabled,
      iconName = props.iconName,
      size = props.size,
      rest = _objectWithoutProperties(props, ["children", "className", "disabled", "iconName", "size"]);

  var inFloatingForm = listAttrIncludes(className, 'private-form__control--inline');
  var computedSize = inFloatingForm ? 14 : getFontSize(size);
  return /*#__PURE__*/_jsxs(InputWrapper, Object.assign({}, rest, {
    className: className,
    inFloatingForm: inFloatingForm,
    size: computedSize,
    children: [children, /*#__PURE__*/_jsx(IconWrapper, {
      inFloatingForm: inFloatingForm,
      children: /*#__PURE__*/_jsx(Icon, {
        name: iconName,
        color: disabled ? BATTLESHIP : undefined,
        size: computedSize
      })
    })]
  }));
};

if (process.env.NODE_ENV !== 'production') {
  UIInputIconWrapper.propTypes = {
    align: PropTypes.oneOf(['left', 'right']).isRequired,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    iconName: UIIcon.propTypes.name,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['default', 'small'])]).isRequired
  };
}

UIInputIconWrapper.defaultProps = {
  align: 'left'
};
UIInputIconWrapper.displayName = 'UIInputIconWrapper';
export default UIInputIconWrapper;