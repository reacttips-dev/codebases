'use es6';

import styled from 'styled-components';
export default styled('div').withConfig({
  displayName: "AvatarWrapper",
  componentId: "sc-1x1e5rf-0"
})(["box-sizing:content-box;display:inline-flex;position:relative;transition-delay:150ms;transition:margin ease 300ms;flex-shrink:0;&:not(:only-of-type),& ~ &:not(:first-of-type){margin-", ":", "px;}&:last-of-type{", "}"], function (props) {
  return props._isListReversed ? 'left' : 'right';
}, function (props) {
  return -1 * props.overlapOffset;
}, function (props) {
  return props._isListReversed && 'margin-left: 0 !important;';
});