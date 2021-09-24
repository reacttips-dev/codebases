'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { memo } from 'react';
import SkeletonBox from 'conversations-skeleton-state/components/SkeletonBox';

function HubSpotRegisterNumberSkeleton() {
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs("div", {
      className: "p-x-5",
      children: [/*#__PURE__*/_jsx("div", {
        className: "p-top-8 p-bottom-7",
        children: /*#__PURE__*/_jsx(SkeletonBox, {
          height: 30,
          width: 150
        })
      }), /*#__PURE__*/_jsx(SkeletonBox, {
        height: 14,
        width: 450
      }), /*#__PURE__*/_jsx("div", {
        className: "p-y-2",
        children: /*#__PURE__*/_jsx(SkeletonBox, {
          height: 40,
          width: 360
        })
      }), /*#__PURE__*/_jsx(SkeletonBox, {
        height: 70,
        width: 240
      })]
    }), /*#__PURE__*/_jsx(SkeletonBox, {
      height: 65,
      className: "width-100 m-top-6"
    })]
  });
}

export default /*#__PURE__*/memo(HubSpotRegisterNumberSkeleton);