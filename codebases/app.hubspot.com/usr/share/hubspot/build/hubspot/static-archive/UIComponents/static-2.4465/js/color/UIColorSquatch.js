'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import devLogger from 'react-utils/devLogger';
import { CALYPSO, CALYPSO_MEDIUM, MONOLITH, OLAF } from 'HubStyleTokens/colors';
import { setUiTransition, toPx } from '../utils/Styles';
import { hidden } from '../utils/propTypes/decorators';
import { getGradient } from './gradients/Styles';
import { rgba } from '../core/Color';
import ActiveProvider from '../providers/ActiveProvider';
import HoverProvider from '../providers/HoverProvider';
import UIClickable from '../button/UIClickable';
import FocusProvider from '../providers/FocusProvider';
var CHECKERBOARD_IMAGE = "\n  <svg height=\"16\" width=\"16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\">\n    <g fill-rule=\"nonzero\" fill=\"none\">\n      <path fill=\"%23F2F5F8\" d=\"M0 0h16v16H0z\"/>\n      <g fill=\"%23CBD6E2\">\n        <path d=\"M8 8h8v8H8zM0 0h8v8H0z\"/>\n      </g>\n    </g>\n  </svg>\n";
var SQUATCH_SIZE = 28;
var getSelectedShadow = "\n  box-shadow: 0 0 0 1px " + OLAF + ", 0 0 0 3px " + CALYPSO + ";\n";
var getHoverShadow = "\n  box-shadow: 0 0 0 2px " + CALYPSO_MEDIUM + ",\n    0 0 8px 0 " + rgba(CALYPSO, 0.3) + ";\n";

var getOpacityAffordance = function getOpacityAffordance(size) {
  return css(["background-image:url('data:image/svg+xml;utf8,", "');background-repeat:repeat;background-size:", ";"], CHECKERBOARD_IMAGE, toPx(size / 2.5));
};

var SquatchOuter = styled(function (props) {
  var __active = props.active,
      __color = props.color,
      __endColor = props.endColor,
      __focused = props.focused,
      __hovered = props.hovered,
      __opacity = props.opacity,
      __startColor = props.startColor,
      __size = props.size,
      rest = _objectWithoutProperties(props, ["active", "color", "endColor", "focused", "hovered", "opacity", "startColor", "size"]);

  return /*#__PURE__*/_jsx(UIClickable, Object.assign({}, rest));
}).withConfig({
  displayName: "UIColorSquatch__SquatchOuter",
  componentId: "sc-5cr1rg-0"
})(["", ";border-radius:2px;", ";", ";height:", ";position:relative;", ";width:", ";&::after{background-color:", ";border-radius:inherit;bottom:0;content:'';display:", ";left:0;position:absolute;right:0;top:0;}"], function (props) {
  return props.opacity && getOpacityAffordance(props.size);
}, function (props) {
  return props.selected && getSelectedShadow;
}, function (props) {
  return props.hovered && !props.selected && getHoverShadow;
}, function (props) {
  return toPx(props.size);
}, setUiTransition('box-shadow'), function (props) {
  return toPx(props.size);
}, rgba(MONOLITH, 0.1), function (props) {
  return props.active ? 'block' : 'none';
});
var SquatchColor = styled.span.withConfig({
  displayName: "UIColorSquatch__SquatchColor",
  componentId: "sc-5cr1rg-1"
})(["background:", ";", ";border-width:1px;border-color:", ";border-radius:inherit;border-style:solid;display:block;height:100%;opacity:", ";pointer-events:none;width:100%;"], function (props) {
  return props.color && props.color + " !important";
}, function (props) {
  return props.startColor && getGradient(undefined, props.angle, props.startColor, undefined, props.endColor, undefined);
}, function (props) {
  return props.selected ? OLAF : rgba(MONOLITH, 0.2);
}, function (props) {
  return props.opacity && props.opacity / 100;
});
export default function UIColorSquatch(props) {
  var angle = props.angle,
      color = props.color,
      endColor = props.endColor,
      label = props.label,
      opacity = props.opacity,
      selected = props.selected,
      startColor = props.startColor,
      _children = props.children,
      rest = _objectWithoutProperties(props, ["angle", "color", "endColor", "label", "opacity", "selected", "startColor", "children"]);

  var implicitLabel = label || color;
  var colorOrLabel = !label && startColor && endColor ? startColor + ", " + endColor : implicitLabel;
  var computedLabel = "" + colorOrLabel + (opacity ? ", " + opacity + " opacity" : '');

  if (process.env.NODE_ENV !== 'production') {
    if (startColor && !endColor) {
      devLogger.warn({
        message: 'UIColorSquatch: Please set an endColor if using a startColor',
        key: 'UIColorSquatch: no startColor without endColor'
      });
    }

    if (!startColor && endColor) {
      devLogger.warn({
        message: 'UIColorSquatch: Please set a startColor if using an endColor',
        key: 'UIColorSquatch: no endColor without startColor'
      });
    }
  }

  return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, props, {
    children: function children(hoverProviderProps) {
      return /*#__PURE__*/_jsx(ActiveProvider, Object.assign({}, props, {
        children: function children(activeProviderProps) {
          return /*#__PURE__*/_jsx(FocusProvider, Object.assign({}, props, {
            children: function children(focusProviderProps) {
              return /*#__PURE__*/_jsx(SquatchOuter, Object.assign({}, rest, {}, hoverProviderProps, {}, activeProviderProps, {}, focusProviderProps, {
                "aria-label": computedLabel,
                "aria-pressed": selected,
                opacity: opacity,
                selected: selected,
                children: /*#__PURE__*/_jsx(SquatchColor, {
                  angle: angle,
                  color: color,
                  endColor: endColor,
                  opacity: opacity,
                  startColor: startColor,
                  children: _children
                })
              }));
            }
          }));
        }
      }));
    }
  }));
}
UIColorSquatch.propTypes = {
  children: PropTypes.node,
  angle: PropTypes.string,
  color: PropTypes.string,
  endColor: PropTypes.string,
  focused: hidden(PropTypes.bool),
  hovered: hidden(PropTypes.bool),
  label: PropTypes.string,
  opacity: PropTypes.number,
  selected: PropTypes.bool,
  size: PropTypes.number,
  startColor: PropTypes.string
};
UIColorSquatch.defaultProps = {
  angle: '90deg',
  size: SQUATCH_SIZE
};
UIColorSquatch.displayName = 'UIColorSquatch';