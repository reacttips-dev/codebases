import { jsx as _jsx } from "react/jsx-runtime";

/**
 * Use SVG filter tag to define shadow effects on border
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDropShadow}
 */
var UITourPulserShadow = function UITourPulserShadow(_ref) {
  var shadowColor = _ref.shadowColor;
  return /*#__PURE__*/_jsx("filter", {
    id: "dropshadow",
    children: /*#__PURE__*/_jsx("feDropShadow", {
      floodColor: shadowColor,
      stdDeviation: "3",
      dx: "0",
      dy: "0"
    })
  });
};

export default UITourPulserShadow;