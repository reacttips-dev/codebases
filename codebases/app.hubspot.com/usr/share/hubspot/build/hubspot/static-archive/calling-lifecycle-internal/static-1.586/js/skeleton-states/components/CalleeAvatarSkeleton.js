'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import SkeletonCircle from 'conversations-skeleton-state/components/SkeletonCircle';
export default function CalleeAvatarSkeleton() {
  return /*#__PURE__*/_jsx("div", {
    className: "justify-center m-top-3 m-bottom-6",
    children: /*#__PURE__*/_jsx(SkeletonCircle, {
      size: 108
    })
  });
}