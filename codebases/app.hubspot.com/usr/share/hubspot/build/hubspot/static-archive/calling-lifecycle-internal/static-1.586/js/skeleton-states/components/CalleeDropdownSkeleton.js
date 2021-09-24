'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import PropTypes from 'prop-types';
import SkeletonBox from 'conversations-skeleton-state/components/SkeletonBox';

var CalleeDropdownSkeleton = function CalleeDropdownSkeleton(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: /*#__PURE__*/_jsx(SkeletonBox, {
      height: 16,
      width: 320
    })
  });
};

CalleeDropdownSkeleton.propTypes = {
  className: PropTypes.string
};
CalleeDropdownSkeleton.defaultProps = {
  className: 'p-bottom-2'
};
export default /*#__PURE__*/memo(CalleeDropdownSkeleton);