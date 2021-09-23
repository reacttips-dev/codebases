'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { ICON_SIZES } from './constants/IconSizes';
import themePropType from '../utils/themePropType';
import { getIconColor } from './theme/iconThemeOperators';

var getIconSizeStyles = function getIconSizeStyles(size) {
  return css(["font-size:", ";height:", ";width:", ";"], ICON_SIZES[size] ? ICON_SIZES[size] + "px" : size, ICON_SIZES[size] ? ICON_SIZES[size] + "px" : size, ICON_SIZES[size] ? ICON_SIZES[size] + "px" : size);
};

var IconWrapper = styled.div.withConfig({
  displayName: "VizExIcon__IconWrapper",
  componentId: "j6fcha-0"
})(["display:inline-flex;vertical-align:middle;fill:", ";", ""], function (_ref) {
  var theme = _ref.theme;
  return getIconColor(theme) || 'currentColor';
}, function (_ref2) {
  var size = _ref2.size;
  return size && getIconSizeStyles(size);
});

var VizExIcon = function VizExIcon(props) {
  var icon = props.icon,
      size = props.size,
      rest = _objectWithoutProperties(props, ["icon", "size"]);

  return /*#__PURE__*/_jsx(IconWrapper, Object.assign({}, rest, {
    size: size,
    children: icon
  }));
};

VizExIcon.displayName = 'VizExIcon';
VizExIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  size: PropTypes.oneOfType([PropTypes.oneOf(Object.keys(ICON_SIZES)), PropTypes.string]),
  theme: themePropType
};
export default VizExIcon;