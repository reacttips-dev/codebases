'use es6';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import UITag from './UITag';
import * as Colors from 'HubStyleTokens/colors';
import { TAG_ICON_SPACING_X } from 'HubStyleTokens/sizes';
var statusColors = {
  disabled: Colors.BATTLESHIP,
  success: Colors.OZ,
  warning: Colors.MARIGOLD,
  danger: Colors.CANDY_APPLE,
  info: Colors.CALYPSO
};

var getDotColor = function getDotColor(color, use) {
  if (color != null) return color;
  var computedUse = UITag.STATUS_ALIAS_MAP[use] || use;
  return statusColors[computedUse] || Colors[computedUse.toUpperCase().replace('-', '_')] || Colors.BATTLESHIP;
};

var UIStatusDot = styled.span.withConfig({
  displayName: "UIStatusDot",
  componentId: "n6tsa3-0"
})(["background-color:", ";border:", ";border-radius:100%;display:inline-block;margin-right:", ";&&{height:10px;width:10px;}"], function (_ref) {
  var color = _ref.color,
      hollow = _ref.hollow,
      use = _ref.use;
  return !hollow && getDotColor(color, use);
}, function (_ref2) {
  var color = _ref2.color,
      hollow = _ref2.hollow,
      use = _ref2.use;
  return hollow && "2px solid " + getDotColor(color, use);
}, TAG_ICON_SPACING_X);
UIStatusDot.propTypes = {
  color: PropTypes.string,
  hollow: PropTypes.bool.isRequired,
  use: UITag.propTypes.use
};
UIStatusDot.defaultProps = {
  hollow: false,
  use: 'info'
};
UIStatusDot.getDotColor = getDotColor; // expose for tests

export default UIStatusDot;