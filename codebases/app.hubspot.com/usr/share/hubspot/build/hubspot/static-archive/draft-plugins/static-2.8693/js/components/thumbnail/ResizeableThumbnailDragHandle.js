'use es6';

import styled from 'styled-components';
import { FOCUS_RING_BASE } from 'HubStyleTokens/colors';
export default styled.div.withConfig({
  displayName: "ResizeableThumbnailDragHandle",
  componentId: "sc-64y367-0"
})(["background-color:", ";cursor:ew-resize;height:100%;opacity:", ";position:absolute;right:0;top:0;width:3px;"], FOCUS_RING_BASE, function (props) {
  return props.selected ? 1 : 0;
});