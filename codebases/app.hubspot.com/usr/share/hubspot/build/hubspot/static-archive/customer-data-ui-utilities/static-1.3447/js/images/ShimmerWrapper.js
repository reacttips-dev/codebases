'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
var basis = '500px';
var shimmerKeyframes = keyframes(["0%{background-position:-", " 0;}100%{background-position:", " 0;}"], basis, basis);
var Wrapper = styled.div.withConfig({
  displayName: "ShimmerWrapper__Wrapper",
  componentId: "sc-9jphap-0"
})(["position:relative;"]);
var ShimmerLayer = styled.div.withConfig({
  displayName: "ShimmerWrapper__ShimmerLayer",
  componentId: "sc-9jphap-1"
})(["position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient( 106deg,rgba(255,255,255,0.1) 20%,rgba(255,255,255,0.67) 35%,rgba(255,255,255,0.1) 67% );animation:", " 2400ms linear 0s infinite normal forwards;"], shimmerKeyframes);

var ShimmerWrapper = function ShimmerWrapper(props) {
  var children = props.children,
      rest = _objectWithoutProperties(props, ["children"]);

  return /*#__PURE__*/_jsxs(Wrapper, Object.assign({}, rest, {
    children: [children, /*#__PURE__*/_jsx(ShimmerLayer, {})]
  }));
};

ShimmerWrapper.propTypes = {
  children: PropTypes.node.isRequired
};
export default ShimmerWrapper;