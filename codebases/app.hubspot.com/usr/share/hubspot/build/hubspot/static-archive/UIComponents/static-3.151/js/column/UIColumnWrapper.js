'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { ALIGN_PROPS } from './UIColumnConstants';
import UIAbstractColumn from './abstract/UIAbstractColumn';
export default function UIColumnWrapper(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ["children"]);

  return /*#__PURE__*/_jsx(UIAbstractColumn, Object.assign({
    columnType: "wrapper"
  }, props, {
    children: children
  }));
}
UIColumnWrapper.propTypes = {
  align: PropTypes.oneOf(ALIGN_PROPS),
  alignSelf: PropTypes.oneOf(ALIGN_PROPS),
  children: PropTypes.node
};
UIColumnWrapper.defaultProps = {
  align: 'start'
};
UIColumnWrapper.displayName = 'UIColumnWrapper';