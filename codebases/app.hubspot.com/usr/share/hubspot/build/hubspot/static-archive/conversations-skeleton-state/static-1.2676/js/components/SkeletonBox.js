'use es6';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import SkeletonBase from './SkeletonBase';
import { BOX_BASE_HEIGHT, BOX_BASE_WIDTH } from '../constants/baseValues';
import { getSize } from '../operators/getSize';
var SkeletonBox = styled(SkeletonBase).withConfig({
  displayName: "SkeletonBox",
  componentId: "fuc4tz-0"
})(["width:", ";height:", ";min-width:", ";"], function (_ref) {
  var width = _ref.width;
  return getSize(width);
}, function (_ref2) {
  var height = _ref2.height;
  return getSize(height);
}, function (_ref3) {
  var width = _ref3.width;
  return getSize(width);
});
SkeletonBox.defaultProps = {
  height: BOX_BASE_HEIGHT,
  width: BOX_BASE_WIDTH
};
SkeletonBox.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default SkeletonBox;