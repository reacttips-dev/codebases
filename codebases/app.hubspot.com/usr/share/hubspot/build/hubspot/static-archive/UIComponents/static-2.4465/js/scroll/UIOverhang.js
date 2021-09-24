'use es6';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { KOALA } from 'HubStyleTokens/colors';
import { rgba } from '../core/Color';

var isVertical = function isVertical(side) {
  return side === 'top' || side === 'bottom';
};

var UIOverhang = styled.div.withConfig({
  displayName: "UIOverhang",
  componentId: "sc-190bzrg-0"
})(["background-image:", ";background-size:", ";height:", ";width:", ";opacity:", ";pointer-events:none;position:absolute;top:", ";bottom:", ";left:", ";right:", ";"], function (_ref) {
  var gradientColor = _ref.gradientColor,
      side = _ref.side;
  return "linear-gradient(to " + side + ", " + rgba(gradientColor, 0) + ", " + gradientColor + ")";
}, function (_ref2) {
  var side = _ref2.side,
      size = _ref2.size;
  return isVertical(side) ? "100% " + size + "px}" : size + "px 100%";
}, function (_ref3) {
  var side = _ref3.side,
      size = _ref3.size;
  return isVertical(side) && size + "px";
}, function (_ref4) {
  var side = _ref4.side,
      size = _ref4.size;
  return !isVertical(side) && size + "px";
}, function (_ref5) {
  var opacity = _ref5.opacity;
  return opacity;
}, function (_ref6) {
  var side = _ref6.side;
  return side !== 'bottom' && 0;
}, function (_ref7) {
  var side = _ref7.side;
  return side !== 'top' && 0;
}, function (_ref8) {
  var side = _ref8.side;
  return side !== 'right' && 0;
}, function (_ref9) {
  var side = _ref9.side;
  return side !== 'left' && 0;
});
UIOverhang.propTypes = {
  gradientColor: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  side: PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
  size: PropTypes.number.isRequired
};
UIOverhang.defaultProps = {
  gradientColor: KOALA,
  opacity: 1,
  size: 14
};
export default UIOverhang;