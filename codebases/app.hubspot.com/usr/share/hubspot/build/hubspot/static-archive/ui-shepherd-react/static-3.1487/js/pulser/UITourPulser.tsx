import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { PANTERA, THUNDERDOME } from 'HubStyleTokens/colors';
import { JUPITER_LAYER } from 'HubStyleTokens/sizes';
import UITourPulserPath from './UITourPulserPath';
import UITourPulserShadow from './UITourPulserShadow';
import UITourPulserSVG from './UITourPulserSVG';
import { usePulserContainer, usePulserSVGPaths } from '../hooks/pulser';
var UITourPulserDefaultProps = {
  borderColor: THUNDERDOME,
  borderRadius: 3,
  borderSize: 3,
  enableBorder: true,
  enableOverlay: true,
  enablePulse: true,
  pulserDistance: 6,
  pulserDuration: '2s',
  pulserPadding: 4,
  pulserZIndex: Number(JUPITER_LAYER)
};
var isDropShadowSupported = typeof SVGFEDropShadowElement !== 'undefined';
var UITourPulser = /*#__PURE__*/forwardRef(function (props, ref) {
  var _ref = props,
      attachTo = _ref.attachTo,
      borderColor = _ref.borderColor,
      borderRadius = _ref.borderRadius,
      borderSize = _ref.borderSize,
      enableBorder = _ref.enableBorder,
      enableOverlay = _ref.enableOverlay,
      enablePulse = _ref.enablePulse,
      pulserDistance = _ref.pulserDistance,
      pulserDuration = _ref.pulserDuration,
      pulserPadding = _ref.pulserPadding,
      pulserZIndex = _ref.pulserZIndex,
      target = _ref.target;
  var pulserContainer = usePulserContainer(target);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      shouldShowPulser = _useState2[0],
      setShouldShowPulser = _useState2[1];

  var pulserPathProps = useMemo(function () {
    return {
      padding: pulserPadding,
      distance: enablePulse ? pulserDistance : undefined,
      radius: borderRadius
    };
  }, [enablePulse, borderRadius, pulserDistance, pulserPadding]);
  var paths = usePulserSVGPaths(shouldShowPulser ? attachTo || target : null, pulserPathProps); // expose showPulser to parent component
  // This is for showing pulser after tour step popover is opened

  useImperativeHandle(ref, function () {
    return {
      showPulser: function showPulser() {
        return setShouldShowPulser(true);
      }
    };
  });

  if (!pulserContainer) {
    return null;
  }

  return /*#__PURE__*/createPortal( /*#__PURE__*/_jsxs(UITourPulserSVG, {
    className: 'tour-pulser' + (shouldShowPulser ? " tour-pulser--visible" : ""),
    zIndex: pulserZIndex,
    children: [/*#__PURE__*/_jsx("defs", {
      children: isDropShadowSupported && /*#__PURE__*/_jsx(UITourPulserShadow, {
        shadowColor: borderColor
      })
    }), enableOverlay && /*#__PURE__*/_jsx(UITourPulserPath, {
      className: "tour-pulser-overlay",
      duration: pulserDuration,
      fill: PANTERA,
      pathStart: paths.start.overlay,
      pathEnd: paths.end.overlay
    }), enableBorder && /*#__PURE__*/_jsx(UITourPulserPath, {
      className: "tour-pulser-border",
      duration: pulserDuration,
      fill: "none",
      filter: isDropShadowSupported ? 'url(#dropshadow)' : undefined,
      pathStart: paths.start.border,
      pathEnd: paths.end.border,
      stroke: borderColor,
      strokeWidth: borderSize
    })]
  }), pulserContainer);
});
UITourPulser.defaultProps = UITourPulserDefaultProps;
UITourPulser.propTypes = {
  attachTo: PropTypes.string,
  borderColor: PropTypes.string,
  borderRadius: PropTypes.number,
  borderSize: PropTypes.number,
  enableBorder: PropTypes.bool,
  enableOverlay: PropTypes.bool,
  enablePulse: PropTypes.bool,
  pulserDistance: PropTypes.number,
  pulserDuration: PropTypes.string,
  pulserPadding: PropTypes.number,
  pulserZIndex: PropTypes.number,
  target: PropTypes.instanceOf(Element)
};
export default UITourPulser;