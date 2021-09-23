'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toPx } from '../utils/Styles';
import { BASE_SPACING_X, BASE_SPACING_Y, GRID_BREAKPOINT_SMALL } from 'HubStyleTokens/sizes';
import UIFlex from './UIFlex';
var FlexContainer = styled(UIFlex).withConfig({
  displayName: "UIButtonWrapper__FlexContainer",
  componentId: "sc-3d5s05-0"
})(["margin-left:-", ";margin-top:-", ";max-width:none;width:auto;@media only screen and (max-width:", "){flex-grow:1;}&&& > *{margin-left:", ";margin-top:", ";}"], function (props) {
  return toPx(props.horizontalGap);
}, function (props) {
  return toPx(props.verticalGap);
}, GRID_BREAKPOINT_SMALL, function (props) {
  return toPx(props.horizontalGap);
}, function (props) {
  return toPx(props.verticalGap);
});

var UIButtonWrapper = function UIButtonWrapper(props) {
  var alignItems = props.alignItems,
      children = props.children,
      horizontalGap = props.horizontalGap,
      justify = props.justify,
      verticalGap = props.verticalGap,
      rest = _objectWithoutProperties(props, ["alignItems", "children", "horizontalGap", "justify", "verticalGap"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    children: /*#__PURE__*/_jsx(FlexContainer, {
      align: alignItems,
      horizontalGap: horizontalGap,
      justify: justify,
      verticalGap: verticalGap,
      wrap: "wrap",
      children: children
    })
  }));
};

UIButtonWrapper.propTypes = {
  alignItems: UIFlex.propTypes.align,
  children: PropTypes.node,
  justify: UIFlex.propTypes.justify,
  horizontalGap: PropTypes.number,
  verticalGap: PropTypes.number
};
UIButtonWrapper.defaultProps = {
  alignItems: 'center',
  horizontalGap: parseInt(BASE_SPACING_X, 10),
  verticalGap: parseInt(BASE_SPACING_Y, 10)
};
UIButtonWrapper.displayName = 'UIButtonWrapper';
export default UIButtonWrapper;