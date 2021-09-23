'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import cx from 'classnames';
import { ALIGN_PROPS, COLUMN_TYPES } from '../UIColumnConstants';
var propTypes = {
  align: PropTypes.oneOf(ALIGN_PROPS),
  alignSelf: PropTypes.oneOf(ALIGN_PROPS),
  columnType: PropTypes.oneOf(COLUMN_TYPES).isRequired,
  expands: PropTypes.bool,
  overflow: PropTypes.bool,
  children: PropTypes.node
};
var WrapperColumnStyles = css(["display:inline-flex;justify-content:space-between;width:100%;word-break:break-word;overflow:visible;"]);
var SpreadsColumnStyles = css(["display:flex;flex-direction:column;flex-shrink:100000;width:100%;overflow-x:auto;overflow-y:hidden;white-space:normal;&.expand{flex-grow:1;}&.overflowVisible{overflow:visible;}"]);
var ContentColumnStyles = css(["display:flex;flex-wrap:nowrap;flex-shrink:1;.UIColumn-content > &{flex-shrink:0;}"]);
var ColumnWrapper = styled.div.withConfig({
  displayName: "UIAbstractColumn__ColumnWrapper",
  componentId: "bmmtth-0"
})(["", ""], function (_ref) {
  var columnType = _ref.columnType;
  if (columnType === 'wrapper') return WrapperColumnStyles;
  if (columnType === 'spreads') return SpreadsColumnStyles;
  return ContentColumnStyles;
});
export default function UIAbstractColumn(_ref2) {
  var align = _ref2.align,
      alignSelf = _ref2.alignSelf,
      className = _ref2.className,
      children = _ref2.children,
      columnType = _ref2.columnType,
      expands = _ref2.expands,
      overflow = _ref2.overflow,
      rest = _objectWithoutProperties(_ref2, ["align", "alignSelf", "className", "children", "columnType", "expands", "overflow"]);

  var computedClassName = cx(className, align && "align-" + align, alignSelf && "align-self-" + alignSelf, columnType && "UIColumn-" + columnType, overflow && "overflowVisible", expands && "expands");
  return /*#__PURE__*/_jsx(ColumnWrapper, Object.assign({}, rest, {
    columnType: columnType,
    className: computedClassName,
    children: children
  }));
}
UIAbstractColumn.propTypes = propTypes;
UIAbstractColumn.displayName = 'UIAbstractColumn';