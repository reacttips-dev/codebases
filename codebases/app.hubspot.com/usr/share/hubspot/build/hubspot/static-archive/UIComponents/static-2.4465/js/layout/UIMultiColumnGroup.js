'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
export default function UIMultiColumnGroup(props) {
  var children = props.children,
      className = props.className,
      other = _objectWithoutProperties(props, ["children", "className"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, other, {
    className: classNames('private-multicolumn__group', className),
    children: children
  }));
}
UIMultiColumnGroup.displayName = 'UIMultiColumnGroup';
UIMultiColumnGroup.propTypes = {
  children: PropTypes.node
};