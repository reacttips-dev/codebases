'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import SkeletonBox from 'conversations-skeleton-state/components/SkeletonBox';

function CalleeNumbersSkeleton(_ref) {
  var phoneNumbers = _ref.phoneNumbers,
      calleeIndex = _ref.calleeIndex;
  return _toConsumableArray(Array(phoneNumbers)).map(function (_item, index) {
    return /*#__PURE__*/_jsxs("div", {
      className: "m-bottom-2",
      children: [/*#__PURE__*/_jsx(SkeletonBox, {
        width: 16,
        height: 16,
        className: "m-right-1 display-inline-block"
      }), /*#__PURE__*/_jsx(SkeletonBox, {
        width: 24,
        height: 16,
        className: "m-right-1 display-inline-block"
      }), /*#__PURE__*/_jsx(SkeletonBox, {
        width: 120,
        height: 16,
        className: "m-right-1 display-inline-block"
      }), /*#__PURE__*/_jsx(SkeletonBox, {
        width: 80,
        height: 16,
        className: "m-right-1 display-inline-block"
      })]
    }, "number-placeholder_" + calleeIndex + "-" + index);
  });
}

function CalleesSkeleton(_ref2) {
  var showCalleeNames = _ref2.showCalleeNames;
  var calleeLength = showCalleeNames ? 2 : 1;
  return /*#__PURE__*/_jsx("div", {
    className: "m-top-3",
    children: _toConsumableArray(Array(calleeLength)).map(function (value, index) {
      return /*#__PURE__*/_jsxs("div", {
        className: "m-x-3 m-bottom-0",
        children: [showCalleeNames ? /*#__PURE__*/_jsx(SkeletonBox, {
          width: 152,
          height: 16,
          className: "m-bottom-4"
        }) : null, /*#__PURE__*/_jsx(CalleeNumbersSkeleton, {
          phoneNumbers: 4,
          calleeIndex: index
        })]
      }, "callee-placeholder_" + index);
    })
  });
}

export default /*#__PURE__*/memo(CalleesSkeleton);