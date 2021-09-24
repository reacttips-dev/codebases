'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { ALIGN_PROPS } from './UIColumnConstants';
import UIAbstractColumn from './abstract/UIAbstractColumn';
export default function UIColumnSpreads(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ["children"]);

  return /*#__PURE__*/_jsx(UIAbstractColumn, Object.assign({
    columnType: "spreads"
  }, props, {
    children: children
  }));
}
UIColumnSpreads.propTypes = {
  align: PropTypes.oneOf(ALIGN_PROPS),
  alignSelf: PropTypes.oneOf(ALIGN_PROPS),
  expands: PropTypes.bool,
  overflow: PropTypes.bool,
  children: PropTypes.node
};
UIColumnSpreads.displayName = 'UIColumnSpreads';