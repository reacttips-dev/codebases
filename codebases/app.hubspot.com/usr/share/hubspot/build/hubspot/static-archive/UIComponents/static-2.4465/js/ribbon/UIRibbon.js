'use es6';

import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import NormalColors from '../core/NormalColors';
import { OLAF, KOALA, OBSIDIAN, THUNDERDOME, LORAX, OZ, PANTERA } from 'HubStyleTokens/colors';
import { setRibbonRounding } from './internal/ribbonStyles';
import { badgeStylesMixin } from '../badge/internal';
var BACKGROUND_COLOR_FOR_USE = Object.assign({}, NormalColors, {
  pantera: PANTERA,
  koala: KOALA,
  beta: THUNDERDOME,
  free: LORAX,
  new: OZ
});
var RIBBON_USES = Object.keys(BACKGROUND_COLOR_FOR_USE);
var DEFAULT_RIBBON_USE = 'new';

var colorStylesMixin = function colorStylesMixin(props) {
  var backgroundColor = BACKGROUND_COLOR_FOR_USE[props.use] || BACKGROUND_COLOR_FOR_USE[DEFAULT_RIBBON_USE];
  return css(["background-color:", ";color:", ";"], backgroundColor, backgroundColor === KOALA ? OBSIDIAN : OLAF);
};

var UIRibbon = styled.span.withConfig({
  displayName: "UIRibbon",
  componentId: "sc-1g67ady-0"
})(["", ";", ";", ";position:absolute;top:8px;", ";z-index:1;"], badgeStylesMixin, colorStylesMixin, function (_ref) {
  var position = _ref.position;
  return setRibbonRounding(position);
}, function (_ref2) {
  var position = _ref2.position;
  return position === 'right' ? 'right: -4px' : 'left: -4px';
});
UIRibbon.propTypes = {
  position: PropTypes.oneOf(['left', 'right']).isRequired,
  children: PropTypes.node,
  use: PropTypes.oneOf(RIBBON_USES).isRequired
};
UIRibbon.defaultProps = {
  position: 'right',
  use: DEFAULT_RIBBON_USE
};
UIRibbon.displayName = 'UIRibbon';
export default UIRibbon;