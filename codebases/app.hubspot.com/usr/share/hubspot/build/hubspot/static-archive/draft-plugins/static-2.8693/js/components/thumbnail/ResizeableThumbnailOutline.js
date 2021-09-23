'use es6';

import styled from 'styled-components';
import { FOCUS_RING_BASE } from 'HubStyleTokens/colors'; // Invert Horizontal and Vetical are optional props that can be passed in and
// are based on whether the drag is being inverted in theose directions

export default styled.div.withConfig({
  displayName: "ResizeableThumbnailOutline",
  componentId: "sc-1lyy4fc-0"
})(["border:3px solid ", ";cursor:pointer;height:", ";width:", ";opacity:", ";position:absolute;left:", ";right:", ";top:", ";bottom:", ";"], FOCUS_RING_BASE, function (props) {
  return props.height ? props.height + "px" : '100%';
}, function (props) {
  return props.width ? props.width + "px" : '100%';
}, function (props) {
  return props.selected ? 1 : 0;
}, function (props) {
  return props.invertHorizontal ? null : '0px';
}, function (props) {
  return props.invertHorizontal ? '0px' : null;
}, function (props) {
  return props.invertVertical ? null : '0px';
}, function (props) {
  return props.invertVertical ? '0px' : null;
});