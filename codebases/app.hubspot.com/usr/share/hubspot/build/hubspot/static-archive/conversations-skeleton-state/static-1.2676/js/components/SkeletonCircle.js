'use es6';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import SkeletonBase from './SkeletonBase';
import { CIRCLE_BASE_SIZE } from '../constants/baseValues';
import { getSize } from '../operators/getSize';
var SkeletonCircle = styled(SkeletonBase).withConfig({
  displayName: "SkeletonCircle",
  componentId: "sybrcz-0"
})(["border-radius:50%;width:", ";height:", ";min-width:", ";"], function (_ref) {
  var size = _ref.size;
  return getSize(size);
}, function (_ref2) {
  var size = _ref2.size;
  return getSize(size);
}, function (_ref3) {
  var size = _ref3.size;
  return getSize(size);
});
SkeletonCircle.defaultProps = {
  size: CIRCLE_BASE_SIZE
};
SkeletonCircle.propTypes = {
  size: PropTypes.number
};
export default SkeletonCircle;