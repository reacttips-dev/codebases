'use es6';

import { getStatusIndicatorBorderColor, getStatusIndicatorOfflineBackgroundColor, getStatusIndicatorOnlineBackgroundColor } from './theme/statusIndicatorThemeOperators';
import styled, { css } from 'styled-components';
import { EXTRA_SMALL, MEDIUM, SMALL } from '../constants/sizes';
import PropTypes from 'prop-types';
import { OFFLINE, ONLINE } from './constants/StatusIndicatorStatus';

var getSizeStyles = function getSizeStyles(_ref) {
  var size = _ref.size;

  switch (size) {
    case EXTRA_SMALL:
      {
        return css(["width:10px;height:10px;"]);
      }

    case MEDIUM:
      {
        return css(["width:13px;height:13px;"]);
      }

    case SMALL:
    default:
      return css(["height:11px;width:11px;"]);
  }
};

var getStatusStyles = function getStatusStyles(_ref2) {
  var status = _ref2.status,
      theme = _ref2.theme;

  switch (status) {
    case ONLINE:
      {
        return css(["background:", ";"], getStatusIndicatorOnlineBackgroundColor(theme));
      }

    case OFFLINE:
    default:
      {
        return css(["background:", ";"], getStatusIndicatorOfflineBackgroundColor(theme));
      }
  }
};

var VizExStatusIndicator = styled.div.withConfig({
  displayName: "VizExStatusIndicator",
  componentId: "o30zbu-0"
})(["position:relative;display:inline-flex;::after{content:'';position:absolute;right:0;bottom:1px;border-radius:50%;border:2px solid;border-color:", ";", " ", "}"], function (_ref3) {
  var theme = _ref3.theme;
  return getStatusIndicatorBorderColor(theme);
}, getSizeStyles, getStatusStyles);
VizExStatusIndicator.propTypes = {
  size: PropTypes.oneOf([EXTRA_SMALL, MEDIUM, SMALL]),
  status: PropTypes.oneOf([ONLINE, OFFLINE])
};
export default VizExStatusIndicator;