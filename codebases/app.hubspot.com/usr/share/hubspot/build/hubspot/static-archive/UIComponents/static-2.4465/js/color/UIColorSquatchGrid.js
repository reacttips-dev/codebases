'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIButtonWrapper from '../layout/UIButtonWrapper';
export default function UIColorSquatchGrid(_ref) {
  var children = _ref.children,
      gapSize = _ref.gapSize,
      rest = _objectWithoutProperties(_ref, ["children", "gapSize"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    children: /*#__PURE__*/_jsx(UIButtonWrapper, {
      horizontalGap: gapSize,
      verticalGap: gapSize,
      children: children
    })
  }));
}
UIColorSquatchGrid.propTypes = {
  children: PropTypes.node,
  gapSize: PropTypes.number
};
UIColorSquatchGrid.defaultProps = {
  gapSize: 6
};
UIColorSquatchGrid.displayName = 'UIColorSquatchGrid';