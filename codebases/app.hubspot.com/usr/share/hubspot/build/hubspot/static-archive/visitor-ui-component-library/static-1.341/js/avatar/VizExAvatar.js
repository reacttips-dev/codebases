'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { MEDIUM, LARGE, EXTRA_LARGE, EXTRA_EXTRA_SMALL, EXTRA_SMALL, SMALL } from '../constants/sizes';
import { AVATAR_SIZES } from './constants/AvatarSizes';

var getSizeStyles = function getSizeStyles(_ref) {
  var size = _ref.size;
  var sizePx = AVATAR_SIZES[size];
  return css(["height:", "px;width:", "px;"], sizePx, sizePx);
};

var VizExAvatarWrapper = styled.div.withConfig({
  displayName: "VizExAvatar__VizExAvatarWrapper",
  componentId: "sc-1bgexmg-0"
})(["display:inline-flex;align-items:center;justify-content:center;box-sizing:content-box;font-size:initial;overflow:hidden;position:relative;border-radius:50%;", ";"], getSizeStyles);
var VizExAvatarContent = styled.div.withConfig({
  displayName: "VizExAvatar__VizExAvatarContent",
  componentId: "sc-1bgexmg-1"
})(["background-image:url(", ");background-position:center center;background-size:cover;height:100%;width:100%;"], function (_ref2) {
  var src = _ref2.src;
  return "\"" + src + "\"";
});

var VizExAvatar = function VizExAvatar(props) {
  var size = props.size,
      src = props.src,
      rest = _objectWithoutProperties(props, ["size", "src"]);

  return /*#__PURE__*/_jsx(VizExAvatarWrapper, Object.assign({}, rest, {
    size: size,
    children: /*#__PURE__*/_jsx(VizExAvatarContent, {
      src: src
    })
  }));
};

VizExAvatar.displayName = 'VizExAvatar';
VizExAvatar.propTypes = {
  size: PropTypes.oneOf([EXTRA_EXTRA_SMALL, EXTRA_SMALL, SMALL, MEDIUM, LARGE, EXTRA_LARGE]),
  src: PropTypes.string.isRequired
};
VizExAvatar.defaultProps = {
  size: MEDIUM
};
export default VizExAvatar;