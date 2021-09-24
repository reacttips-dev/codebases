'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { AVATAR_SIZES } from '../../Constants';
import { ICON_SIZES } from 'UIComponents/icon/IconConstants';
import PropTypes from 'prop-types';
import SVGTextIconStyle from './SVGTextIconStyle';
import SVGWrapper from './SVGWrapper';
var AVATAR_RESPONSIVE_CENTER = 10;
var AVATAR_ICON_LARGEST_SIZE = AVATAR_SIZES['xl'];
var AVATAR_CENTER_MULTIPLYER = AVATAR_RESPONSIVE_CENTER / AVATAR_ICON_LARGEST_SIZE;
var AVATAR_TEXT_MULTIPLIER = 0.37;

var SVGIconEdit = function SVGIconEdit(_ref) {
  var wrapperProps = _ref.wrapperProps,
      size = _ref.size;
  var avatar_y = size ? size * AVATAR_CENTER_MULTIPLYER : AVATAR_RESPONSIVE_CENTER;
  var icon_size = size * AVATAR_TEXT_MULTIPLIER;
  var avatar_style = size ? {
    fontSize: icon_size + "px",
    fontWeight: "" + (icon_size > ICON_SIZES.medium ? 'bold' : 'normal')
  } : {};
  var SVGIconEditStyle = Object.assign({}, avatar_style);
  SVGIconEditStyle.fontSize = size * (AVATAR_TEXT_MULTIPLIER / 1.25) + "px";
  return /*#__PURE__*/_jsx(SVGWrapper, Object.assign({
    className: "overlay-content"
  }, wrapperProps, {
    children: /*#__PURE__*/_jsx(SVGTextIconStyle, {
      x: 0,
      y: avatar_y,
      style: avatar_style,
      children: "edit"
    })
  }));
};

SVGIconEdit.propTypes = {
  size: PropTypes.number.isRequired,
  wrapperProps: PropTypes.object.isRequired
};
export default SVGIconEdit;