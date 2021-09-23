'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import { ICON_SIZES } from './IconConstants';
import UIIcon from './UIIcon';
var Outer = styled.span.withConfig({
  displayName: "UIIconHolder__Outer",
  componentId: "g54a7d-0"
})(["display:inline-flex;font-size:", ";line-height:1;padding:", ";transform:", ";user-select:none;position:relative;&.private-icon-circle--legacy{display:inline-flex;align-items:center;height:2em;justify-content:center;width:2em;}"], function (_ref) {
  var size = _ref.size;
  return size != null && (ICON_SIZES[size] || size) + "px";
}, function (_ref2) {
  var padding = _ref2.padding;
  return padding != null && padding + "em";
}, function (_ref3) {
  var rotate = _ref3.rotate;
  return rotate != null && "rotate(" + rotate + "deg)";
});

var getIconTransform = function getIconTransform(_ref4) {
  var rotate = _ref4.rotate,
      rotateLock = _ref4.rotateLock;
  return rotate != null && !rotateLock ? "rotate(" + rotate * -1 + "deg)" : null;
};

var Icon = styled(function (props) {
  var __rotate = props.rotate,
      __rotateLock = props.rotateLock,
      rest = _objectWithoutProperties(props, ["rotate", "rotateLock"]);

  return /*#__PURE__*/_jsx(UIIcon, Object.assign({}, rest));
}).withConfig({
  displayName: "UIIconHolder__Icon",
  componentId: "g54a7d-1"
})(["height:1em;width:1em;margin:0.25em 0.125em 0;transform-origin:50% 38%;transform:", " translateY(-6.3%);"], getIconTransform);
var UIIconHolder = memoWithDisplayName('UIIconHolder', function (_ref5) {
  var backgroundColor = _ref5.backgroundColor,
      borderColor = _ref5.borderColor,
      borderRadius = _ref5.borderRadius,
      borderStyle = _ref5.borderStyle,
      borderWidth = _ref5.borderWidth,
      color = _ref5.color,
      innerClassName = _ref5.innerClassName,
      innerStyles = _ref5.innerStyles,
      name = _ref5.name,
      rotate = _ref5.rotate,
      rotateLock = _ref5.rotateLock,
      size = _ref5.size,
      style = _ref5.style,
      verticalAlign = _ref5.verticalAlign,
      rest = _objectWithoutProperties(_ref5, ["backgroundColor", "borderColor", "borderRadius", "borderStyle", "borderWidth", "color", "innerClassName", "innerStyles", "name", "rotate", "rotateLock", "size", "style", "verticalAlign"]);

  return /*#__PURE__*/_jsx(Outer, Object.assign({}, rest, {
    rotate: rotate,
    size: size,
    style: Object.assign({
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderRadius: borderRadius,
      borderStyle: borderStyle,
      borderWidth: borderWidth,
      verticalAlign: verticalAlign
    }, style),
    children: /*#__PURE__*/_jsx(Icon, {
      className: innerClassName,
      color: color,
      name: name,
      rotate: rotate,
      rotateLock: rotateLock,
      size: size,
      style: innerStyles
    })
  }));
});
UIIconHolder.propTypes = {
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderRadius: PropTypes.string,
  borderStyle: PropTypes.oneOf(['solid', 'double', 'dashed', 'dotted', 'initial', 'inherit', 'unset']),
  borderWidth: PropTypes.number,
  verticalAlign: PropTypes.string,
  classname: PropTypes.string,
  color: UIIcon.propTypes.color,
  innerClassName: PropTypes.string,
  name: UIIcon.propTypes.name,
  padding: PropTypes.number,
  rotate: PropTypes.number,
  rotateLock: PropTypes.bool,
  size: UIIcon.propTypes.size,
  innerStyles: PropTypes.object
};
UIIconHolder.defaultProps = {
  padding: 0.5,
  rotate: 0,
  borderStyle: 'solid',
  borderWidth: 0
};
export default UIIconHolder;