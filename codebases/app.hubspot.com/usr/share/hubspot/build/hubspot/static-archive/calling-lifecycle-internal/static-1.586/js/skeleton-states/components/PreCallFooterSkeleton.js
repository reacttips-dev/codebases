'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SkeletonBox from 'conversations-skeleton-state/components/SkeletonBox';

function PreCallFooterSkeleton(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_jsx("div", {
    className: classNames('p-top-4', className),
    children: /*#__PURE__*/_jsx(SkeletonBox, {
      height: 32,
      width: 100
    })
  });
}

PreCallFooterSkeleton.propTypes = {
  className: PropTypes.string
};
export default /*#__PURE__*/memo(PreCallFooterSkeleton);