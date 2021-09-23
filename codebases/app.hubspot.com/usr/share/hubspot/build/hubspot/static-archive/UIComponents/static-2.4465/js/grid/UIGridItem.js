'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import classNames from 'classnames';
import { OFFSET_RANGE, OFFSET_CLASSES, SIZE_CLASSES, SCREEN_SIZES } from './UIGridConstants';

function makeBreakPointsType(range) {
  var rangePropType = PropTypes.oneOf(range);
  var screenSizeShapePropType = PropTypes.shape(SCREEN_SIZES.reduce(function (shape, screenSize) {
    shape[screenSize] = rangePropType;
    return shape;
  }, {}));
  return PropTypes.oneOfType([PropTypes.string, // only intended for UIStepIndicator (#1753)
  rangePropType, screenSizeShapePropType]);
}

function breakPointsToClassName(classMap, breakPoints) {
  if (breakPoints == null) return null; // CRM-12024

  if (typeof breakPoints === 'string') {
    return null;
  }

  if (typeof breakPoints === 'number') {
    return classMap.xs[breakPoints];
  }

  return Object.keys(breakPoints).map(function (screenSize) {
    var value = breakPoints[screenSize];
    return "" + classMap[screenSize][value];
  }).join(' ');
}

var UIGridItem = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var className = _ref.className,
      offset = _ref.offset,
      size = _ref.size,
      rest = _objectWithoutProperties(_ref, ["className", "offset", "size"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    className: classNames(className, breakPointsToClassName(OFFSET_CLASSES, offset), breakPointsToClassName(SIZE_CLASSES, size)),
    ref: ref
  }));
});
UIGridItem.propTypes = {
  children: PropTypes.node,
  offset: makeBreakPointsType(OFFSET_RANGE).isRequired,
  size: makeBreakPointsType(OFFSET_RANGE).isRequired
};
UIGridItem.defaultProps = {
  offset: 0
};
UIGridItem.displayName = 'UIGridItem';
export default UIGridItem;