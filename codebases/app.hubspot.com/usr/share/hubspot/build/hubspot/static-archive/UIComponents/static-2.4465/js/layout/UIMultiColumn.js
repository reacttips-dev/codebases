'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
export default function UIMultiColumn(props) {
  var children = props.children,
      className = props.className,
      flush = props.flush,
      other = _objectWithoutProperties(props, ["children", "className", "flush"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, other, {
    className: classNames('private-multicolumn', className, flush && 'private-multicolumn--flush'),
    children: children
  }));
}
UIMultiColumn.displayName = 'UIMultiColumn';
UIMultiColumn.propTypes = {
  children: PropTypes.node,
  flush: PropTypes.bool.isRequired
};
UIMultiColumn.defaultProps = {
  flush: false
};