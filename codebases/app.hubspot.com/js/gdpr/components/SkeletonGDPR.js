'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import SkeletonBox from 'conversations-skeleton-state/components/SkeletonBox';

function SkeletonGDPR() {
  return /*#__PURE__*/_jsxs("div", {
    className: "m-bottom-12 m-top-7",
    children: [/*#__PURE__*/_jsx(SkeletonBox, {
      width: "80%",
      height: 18,
      className: "center-block"
    }), /*#__PURE__*/_jsx(SkeletonBox, {
      width: "40%",
      height: 18,
      className: "m-top-1 center-block"
    }), /*#__PURE__*/_jsx(SkeletonBox, {
      width: "92%",
      height: 16,
      className: "m-top-4 center-block"
    }), /*#__PURE__*/_jsx(SkeletonBox, {
      width: "80%",
      height: 16,
      className: "m-top-2 center-block"
    }), /*#__PURE__*/_jsx(SkeletonBox, {
      width: 128,
      height: 42,
      className: "m-top-6 center-block"
    })]
  });
}

export default /*#__PURE__*/memo(SkeletonGDPR);