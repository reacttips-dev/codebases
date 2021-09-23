import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';

/**
 * Use SVG animate tag to animate d attribute of path (overlay and highlighted border)
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate}
 */
var UITourPulserPath = function UITourPulserPath(props) {
  var className = props.className,
      duration = props.duration,
      fill = props.fill,
      pathStart = props.pathStart,
      pathEnd = props.pathEnd,
      pathProps = _objectWithoutProperties(props, ["className", "duration", "fill", "pathStart", "pathEnd"]);

  if (!pathStart) {
    return null;
  }

  return /*#__PURE__*/_jsx("path", Object.assign({
    className: className,
    d: pathStart,
    fill: fill
  }, pathProps, {
    children: pathEnd && /*#__PURE__*/_jsx("animate", {
      attributeName: "d",
      calcMode: "spline",
      dur: duration,
      repeatCount: "indefinite",
      values: pathStart + ";" + pathEnd + ";" + pathStart,
      keyTimes: "0; 0.5; 1" // Use keySplines for pulser easing: ease-out for expand, ease-in for shrink
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/keySplines
      ,
      keySplines: "0.61,1,0.88,1; 0.37,0,0.63,1"
    })
  }));
};

UITourPulserPath.propTypes = {
  className: PropTypes.string,
  duration: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  pathStart: PropTypes.string,
  pathEnd: PropTypes.string
};
export default UITourPulserPath;