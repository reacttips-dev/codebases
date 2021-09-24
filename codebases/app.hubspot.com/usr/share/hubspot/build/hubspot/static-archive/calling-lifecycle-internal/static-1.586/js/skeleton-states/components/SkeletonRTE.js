'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import SkeletonBox from 'conversations-skeleton-state/components/SkeletonBox';
import styled from 'styled-components';
import { GREAT_WHITE } from 'HubStyleTokens/colors';
var Spacer = styled.div.withConfig({
  displayName: "SkeletonRTE__Spacer",
  componentId: "sc-1cmr75s-0"
})(["border-right:1px solid ", ";width:0;height:25px;"], GREAT_WHITE);
var Wrapper = styled.div.withConfig({
  displayName: "SkeletonRTE__Wrapper",
  componentId: "sc-1cmr75s-1"
})(["position:relative;border:1px solid ", ";border-width:1px 0;flex:1;"], GREAT_WHITE);
var Utilities = styled.div.withConfig({
  displayName: "SkeletonRTE__Utilities",
  componentId: "sc-1cmr75s-2"
})(["position:sticky;bottom:0;height:26px;"]);
var RTEBody = styled.div.withConfig({
  displayName: "SkeletonRTE__RTEBody",
  componentId: "sc-1cmr75s-3"
})(["flex:1;"]);

function SkeletonRTE() {
  return /*#__PURE__*/_jsxs(Wrapper, {
    className: "p-top-3 p-bottom-2 flex-column",
    children: [/*#__PURE__*/_jsx(SkeletonBox, {
      width: 40,
      height: 16,
      className: "m-bottom-2"
    }), /*#__PURE__*/_jsx(RTEBody, {
      children: /*#__PURE__*/_jsx(SkeletonBox, {
        width: 152,
        height: 16
      })
    }), /*#__PURE__*/_jsxs(Utilities, {
      children: [/*#__PURE__*/_jsx(SkeletonBox, {
        width: 26,
        height: 25,
        className: "display-inline-block"
      }), /*#__PURE__*/_jsx(Spacer, {
        className: "m-x-1 display-inline-block"
      }), /*#__PURE__*/_jsx(SkeletonBox, {
        width: 26,
        height: 25,
        className: "display-inline-block"
      })]
    })]
  });
}

export default /*#__PURE__*/memo(SkeletonRTE);