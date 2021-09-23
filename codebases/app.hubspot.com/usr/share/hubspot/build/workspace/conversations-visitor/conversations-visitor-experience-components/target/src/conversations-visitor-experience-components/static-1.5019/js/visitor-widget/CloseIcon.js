'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';

var CloseIcon = function CloseIcon(_ref) {
  var color = _ref.color,
      height = _ref.height,
      width = _ref.width;
  return /*#__PURE__*/_jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: width,
    height: height,
    viewBox: "0 0 19 18",
    className: "conversations-visitor-close-icon",
    children: /*#__PURE__*/_jsx("g", {
      fill: "none",
      fillRule: "evenodd",
      stroke: "none",
      strokeWidth: "1",
      children: /*#__PURE__*/_jsx("g", {
        fill: color,
        transform: "translate(-927 -991) translate(900.277 962)",
        children: /*#__PURE__*/_jsx("g", {
          transform: "translate(27 29)",
          children: /*#__PURE__*/_jsx("path", {
            d: "M10.627 9.013l6.872 6.873.708.707-1.415 1.414-.707-.707-6.872-6.872L2.34 17.3l-.707.707L.22 16.593l.707-.707L7.8 9.013.946 2.161l-.707-.708L1.653.04l.707.707L9.213 7.6 16.066.746l.707-.707 1.414 1.414-.707.708-6.853 6.852z"
          })
        })
      })
    })
  });
};

CloseIcon.propTypes = {
  color: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};
CloseIcon.displayName = 'CloseIcon';
export default CloseIcon;