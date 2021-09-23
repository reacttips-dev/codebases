'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import cx from 'classnames';
import styled, { css } from 'styled-components';
import { FONT_FAMILIES, setFontSmoothing, toPx } from '../utils/Styles';
import NormalColors from '../core/NormalColors';
import { LORAX, NORMAN, OLAF, OZ, PANTERA, THUNDERDOME, KOALA, OBSIDIAN } from 'HubStyleTokens/colors';
import { badgeStylesMixin } from './internal';
var BADGE_COLORS = {
  pantera: PANTERA,
  koala: KOALA,
  beta: THUNDERDOME,
  default: LORAX,
  free: LORAX,
  new: OZ,
  none: null
};
var COUNT_BADGES = {
  count: null,
  dot: null
};
var BADGE_USES = Object.assign({}, NormalColors, {}, BADGE_COLORS, {}, COUNT_BADGES);
var DEFAULT_BADGE_USE = 'free';

var colorStylesMixin = function colorStylesMixin(props) {
  var backgroundColor = BADGE_USES[props.use] || BADGE_USES[DEFAULT_BADGE_USE];
  return css(["background-color:", ";color:", ";"], backgroundColor, backgroundColor === KOALA ? OBSIDIAN : OLAF);
};

var NOTIFICATION_BADGE_BORDER_WIDTH = '1px';
var NOTIFICATION_BADGE_DEFAULT_SIZE = '21px';
var NOTIFICATION_BADGE_FONT_SIZE = '11px';
var NOTIFICATION_BADGE_SMALL_SIZE = '10px';
var COMPUTED_LINE_HEIGHT = toPx(parseInt(NOTIFICATION_BADGE_DEFAULT_SIZE, 10) - parseInt(NOTIFICATION_BADGE_BORDER_WIDTH, 10) * 2);
var StyledBadge = styled.span.withConfig({
  displayName: "UIBadge__StyledBadge",
  componentId: "mizvk1-0"
})(["", ";", ";padding:0 8px;"], badgeStylesMixin, colorStylesMixin);
var countStyles = "\n  " + FONT_FAMILIES.demibold() + ";\n  font-size: " + NOTIFICATION_BADGE_FONT_SIZE + ";\n  " + setFontSmoothing('antialiased') + ";\n  border-radius: 500px;\n  color: " + OLAF + ";\n  line-height: " + COMPUTED_LINE_HEIGHT + ";\n  min-height: " + NOTIFICATION_BADGE_DEFAULT_SIZE + ";\n  min-width: " + NOTIFICATION_BADGE_DEFAULT_SIZE + ";\n  padding: 0 4px;\n";
var dotStyles = "\n  border-radius: 100%;\n  height: " + NOTIFICATION_BADGE_SMALL_SIZE + ";\n  text-indent: -1000rem;\n  width: " + NOTIFICATION_BADGE_SMALL_SIZE + ";\n";
var CountBadge = styled.span.withConfig({
  displayName: "UIBadge__CountBadge",
  componentId: "mizvk1-1"
})(["background-color:", ";border:", " solid ", ";box-shadow:0 0 0 ", " ", ";display:inline-block;pointer-events:none;text-align:center;vertical-align:baseline;", ";", ";"], NORMAN, NOTIFICATION_BADGE_BORDER_WIDTH, OLAF, NOTIFICATION_BADGE_BORDER_WIDTH, OLAF, function (props) {
  return props.use === 'count' ? countStyles : null;
}, function (props) {
  return props.use === 'dot' ? dotStyles : null;
});

var UIBadge = function UIBadge(_ref) {
  var children = _ref.children,
      className = _ref.className,
      use = _ref.use,
      rest = _objectWithoutProperties(_ref, ["children", "className", "use"]);

  var RenderedBadge = !(use === 'count' || use === 'dot') ? StyledBadge : CountBadge;
  var computedClassName = cx(className, !(use === 'count' || use === 'dot') && 'private-badge', {
    'count': 'private-badge--count',
    'dot': 'private-badge--dot'
  }[use]);
  return /*#__PURE__*/_jsx(RenderedBadge, Object.assign({}, rest, {
    className: computedClassName,
    use: use,
    children: children
  }));
};

UIBadge.propTypes = {
  children: PropTypes.node.isRequired,
  use: PropTypes.oneOf(Object.keys(BADGE_USES))
};
UIBadge.defaultProps = {
  use: DEFAULT_BADGE_USE
};
UIBadge.displayName = 'UIBadge';
export default UIBadge;