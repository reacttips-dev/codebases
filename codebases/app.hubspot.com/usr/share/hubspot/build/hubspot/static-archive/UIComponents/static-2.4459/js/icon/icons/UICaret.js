'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CARET_HEIGHT, CARET_WIDTH } from '../IconConstants';
export default function UICaret(_ref) {
  var altText = _ref.altText,
      className = _ref.className,
      color = _ref.color,
      strokeWidth = _ref.strokeWidth,
      viewBoxHeight = _ref.viewBoxHeight,
      viewBoxWidth = _ref.viewBoxWidth,
      width = _ref.width,
      rest = _objectWithoutProperties(_ref, ["altText", "className", "color", "strokeWidth", "viewBoxHeight", "viewBoxWidth", "width"]);

  var viewBox = "0 0 " + viewBoxWidth + " " + viewBoxHeight;
  return /*#__PURE__*/_jsxs("svg", Object.assign({}, rest, {
    className: classNames('private-icon-caret', className),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: viewBox,
    width: width,
    children: [/*#__PURE__*/_jsx("title", {
      children: altText
    }), /*#__PURE__*/_jsx("path", {
      className: "private-icon-caret__inner",
      d: "M2 2l7.5 8.5-7.4 8.6",
      fill: "none",
      stroke: color,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: strokeWidth
    })]
  }));
}
UICaret.defaultProps = {
  strokeWidth: 4,
  viewBoxHeight: CARET_HEIGHT,
  viewBoxWidth: CARET_WIDTH
};
UICaret.propTypes = {
  altText: PropTypes.string,
  color: PropTypes.string,
  strokeWidth: PropTypes.number,
  viewBoxHeight: PropTypes.number,
  viewBoxWidth: PropTypes.number,
  width: PropTypes.number
};
UICaret.displayName = 'UICaret';