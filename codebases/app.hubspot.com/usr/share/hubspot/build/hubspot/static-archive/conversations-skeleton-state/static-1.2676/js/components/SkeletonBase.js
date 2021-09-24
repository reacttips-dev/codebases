'use es6';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getBackground } from '../operators/getBackground';
import { getSize } from '../operators/getSize';
import { animation } from '../constants/animation';
import { DARK, DEFAULT, SHADE, BLANK } from '../constants/useOptions';
var SkeletonBase = styled.div.withConfig({
  displayName: "SkeletonBase",
  componentId: "sc-1vhra9k-0"
})(["margin:", ";padding:", ";", ";", ";"], function (_ref) {
  var margin = _ref.margin;
  return margin ? getSize(margin) : undefined;
}, function (_ref2) {
  var padding = _ref2.padding;
  return padding ? getSize(padding) : undefined;
}, function (_ref3) {
  var use = _ref3.use;
  return getBackground({
    use: use
  });
}, function (_ref4) {
  var use = _ref4.use;
  return use !== BLANK && animation;
});
SkeletonBase.defaultProps = {
  use: DEFAULT
};
SkeletonBase.propTypes = {
  margin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  use: PropTypes.oneOf([DEFAULT, SHADE, DARK, BLANK])
};
export default SkeletonBase;