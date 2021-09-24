'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CALYPSO } from 'HubStyleTokens/colors';
var StyledOverlay = styled.div.withConfig({
  displayName: "DragAndDropOverlay__StyledOverlay",
  componentId: "o5an79-0"
})(["transition:all 0.15s ease-out;position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;pointer-events:none;border:12px solid transparent;visibility:", ";opacity:", ";border-color:", ";"], function (props) {
  return props.isOver ? 'visible' : 'hidden';
}, function (props) {
  return props.isOver ? 1 : 0;
}, function (props) {
  return props.isOver ? CALYPSO : 'transparent';
});
export default function DragAndDropOverlay(props) {
  var isOver = props.isOver;
  return /*#__PURE__*/_jsx(StyledOverlay, {
    isOver: isOver
  });
}
DragAndDropOverlay.propTypes = {
  isOver: PropTypes.bool.isRequired
};