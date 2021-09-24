'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import SkeletonBox from 'conversations-skeleton-state/components/SkeletonBox';
import PropTypes from 'prop-types';

var CalleeSkeleton = function CalleeSkeleton(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: /*#__PURE__*/_jsx(SkeletonBox, {
      width: 120,
      height: 16
    })
  });
};

CalleeSkeleton.propTypes = {
  className: PropTypes.string
};
CalleeSkeleton.defaultProps = {
  className: 'p-bottom-2'
};
export default /*#__PURE__*/memo(CalleeSkeleton);