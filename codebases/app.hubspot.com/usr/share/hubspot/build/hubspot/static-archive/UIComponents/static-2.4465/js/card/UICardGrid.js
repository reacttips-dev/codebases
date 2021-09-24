'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { toPx } from '../utils/Styles';

var getColumnSize = function getColumnSize(value, correction) {
  // subtract correction from % values
  if (typeof value === 'string' && /%$/.test(value)) {
    return "calc(" + value + " - " + toPx(correction) + ")";
  } // convert raw numbers to px strings


  if (typeof value === 'number') {
    return toPx(value);
  } // leave other string values alone


  return value;
};

var getTemplateColumns = function getTemplateColumns(_ref) {
  var columns = _ref.columns,
      columnSize = _ref.columnSize,
      gutterSize = _ref.gutterSize;
  if (columns) return "repeat(" + columns + ", 1fr)";
  var computedColumnSize = getColumnSize(columnSize, gutterSize);
  return "repeat(auto-fit, minmax(" + computedColumnSize + ", 1fr))";
};

var getFlexChildFallback = function getFlexChildFallback(_ref2) {
  var columns = _ref2.columns,
      columnSize = _ref2.columnSize,
      gutterSize = _ref2.gutterSize;
  return css(["flex-grow:", ";flex-shrink:1;flex-basis:", ";margin-bottom:0;margin-left:", ";margin-right:0;margin-top:", ";"], typeof columnSize === 'string' && /%$/.test(columnSize) ? '0' : '1', getColumnSize(columns ? Math.floor(100 / columns) + "%" : columnSize, gutterSize), toPx(gutterSize), toPx(gutterSize));
};

var CardGrid = styled.div.withConfig({
  displayName: "UICardGrid__CardGrid",
  componentId: "sc-37gja6-0"
})(["display:flex;flex-wrap:wrap;margin-bottom:0;margin-left:-", ";margin-right:0;margin-top:-", ";&& > *{", ";}@supports (display:grid){display:flex;display:grid;grid-column-gap:", ";grid-row-gap:", ";grid-template-columns:", ";margin:0;&& > *{margin:0;}}"], function (props) {
  return toPx(props.gutterSize);
}, function (props) {
  return toPx(props.gutterSize);
}, getFlexChildFallback, function (props) {
  return toPx(props.gutterSize);
}, function (props) {
  return toPx(props.gutterSize);
}, getTemplateColumns);
var CardShim = styled.div.withConfig({
  displayName: "UICardGrid__CardShim",
  componentId: "sc-37gja6-1"
})(["", ";&&{margin-top:0;}@supports (display:grid){display:none;}"], getFlexChildFallback);
export default function UICardGrid(_ref3) {
  var children = _ref3.children,
      className = _ref3.className,
      columnSize = _ref3.columnSize,
      gutterSize = _ref3.gutterSize,
      rest = _objectWithoutProperties(_ref3, ["children", "className", "columnSize", "gutterSize"]);

  return /*#__PURE__*/_jsxs(CardGrid, Object.assign({}, rest, {
    className: className,
    columnSize: columnSize,
    gutterSize: gutterSize,
    children: [children, /*#__PURE__*/_jsx(CardShim, {
      columnSize: columnSize,
      gutterSize: gutterSize
    }), /*#__PURE__*/_jsx(CardShim, {
      columnSize: columnSize,
      gutterSize: gutterSize
    }), /*#__PURE__*/_jsx(CardShim, {
      columnSize: columnSize,
      gutterSize: gutterSize
    }), /*#__PURE__*/_jsx(CardShim, {
      columnSize: columnSize,
      gutterSize: gutterSize
    }), /*#__PURE__*/_jsx(CardShim, {
      columnSize: columnSize,
      gutterSize: gutterSize
    })]
  }));
}
UICardGrid.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.number,
  columnSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  gutterSize: PropTypes.number
};
UICardGrid.defaultProps = {
  columnSize: 295,
  expandToFill: true,
  gutterSize: 32
};
UICardGrid.displayName = 'UICardGrid';