'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import UIFlex from '../layout/UIFlex';
import UIBox from '../layout/UIBox';
import { BASE_SPACING_X, BASE_SPACING_Y } from 'HubStyleTokens/sizes';
var Outer = styled(function (props) {
  var __orientation = props.orientation,
      rest = _objectWithoutProperties(props, ["orientation"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest));
}).withConfig({
  displayName: "UISplitLayout__Outer",
  componentId: "xeacw6-0"
})(["padding-left:", ";width:100%;"], BASE_SPACING_X);
var Inner = styled(UIFlex).withConfig({
  displayName: "UISplitLayout__Inner",
  componentId: "xeacw6-1"
})(["margin-left:-", ";margin-top:-", ";"], BASE_SPACING_X, BASE_SPACING_Y);
var getSlotPadding = "\n  padding-left: " + BASE_SPACING_X + ";\n  padding-top: " + BASE_SPACING_Y + ";\n";
var PrimarySlot = styled(UIBox).withConfig({
  displayName: "UISplitLayout__PrimarySlot",
  componentId: "xeacw6-2"
})(["", ";"], getSlotPadding);
var SecondarySlot = styled(UIBox).withConfig({
  displayName: "UISplitLayout__SecondarySlot",
  componentId: "xeacw6-3"
})(["", ";"], getSlotPadding);
export default function UISplitLayout(props) {
  var InnerWrapper = props.InnerWrapper,
      orientation = props.orientation,
      Primary = props.Primary,
      primaryContent = props.primaryContent,
      primaryClassName = props.primaryClassName,
      primaryWidth = props.primaryWidth,
      reverseOrder = props.reverseOrder,
      Secondary = props.Secondary,
      secondaryContent = props.secondaryContent,
      secondaryClassName = props.secondaryClassName,
      secondaryWidth = props.secondaryWidth,
      rest = _objectWithoutProperties(props, ["InnerWrapper", "orientation", "Primary", "primaryContent", "primaryClassName", "primaryWidth", "reverseOrder", "Secondary", "secondaryContent", "secondaryClassName", "secondaryWidth"]);

  var computedDirection = orientation === 'horizontal' ? 'row' : 'column';
  return /*#__PURE__*/_jsx(Outer, Object.assign({}, rest, {
    orientation: orientation,
    children: /*#__PURE__*/_jsxs(InnerWrapper, {
      direction: computedDirection,
      justify: "between",
      wrap: "wrap",
      children: [/*#__PURE__*/_jsx(Primary, {
        className: primaryClassName,
        basis: primaryWidth,
        orientation: orientation,
        order: reverseOrder ? 1 : 0,
        children: primaryContent
      }), /*#__PURE__*/_jsx(Secondary, {
        basis: secondaryWidth,
        className: secondaryClassName,
        orientation: orientation,
        children: secondaryContent
      })]
    })
  }));
}
UISplitLayout.propTypes = {
  InnerWrapper: getComponentPropType(UIFlex),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  Primary: getComponentPropType(UIBox),
  primaryContent: PropTypes.node.isRequired,
  primaryClassName: PropTypes.string,
  primaryWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  reverseOrder: PropTypes.bool.isRequired,
  Secondary: getComponentPropType(UIBox),
  secondaryContent: PropTypes.node,
  secondaryClassName: PropTypes.string,
  secondaryWidth: PropTypes.number,
  width: PropTypes.number
};
UISplitLayout.defaultProps = {
  InnerWrapper: Inner,
  Primary: PrimarySlot,
  Secondary: SecondarySlot,
  orientation: 'horizontal',
  reverseOrder: false
};
UISplitLayout.displayName = 'UISplitLayout';