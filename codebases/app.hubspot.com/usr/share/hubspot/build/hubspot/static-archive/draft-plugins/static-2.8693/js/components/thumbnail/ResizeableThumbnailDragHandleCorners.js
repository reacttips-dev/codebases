'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import { FOCUS_RING_BASE } from 'HubStyleTokens/colors';
var cornerOffset = '-5px';
var cornerSize = '8px';
var ResizeableThumbnailDragHandleCorner = styled.div.withConfig({
  displayName: "ResizeableThumbnailDragHandleCorners__ResizeableThumbnailDragHandleCorner",
  componentId: "f28bnq-0"
})(["background-color:", ";height:", ";width:", ";opacity:", ";position:absolute;border:1px solid white;cursor:", ";top:", ";bottom:", ";left:", ";right:", ";"], FOCUS_RING_BASE, cornerSize, cornerSize, function (props) {
  return props.selected ? 1 : 0;
}, function (props) {
  return props.cursor ? props.cursor : 'nwse-resize';
}, function (props) {
  return props.top ? props.top : null;
}, function (props) {
  return props.bottom ? props.bottom : null;
}, function (props) {
  return props.left ? props.left : null;
}, function (props) {
  return props.right ? props.right : null;
});

var ResizeableThumbnailDragHandleCorners = function ResizeableThumbnailDragHandleCorners(props) {
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(ResizeableThumbnailDragHandleCorner, {
      left: cornerOffset,
      top: cornerOffset,
      cursor: 'nwse-resize',
      onMouseDown: function onMouseDown(e) {
        return props.handleMouseDown(e, true, true);
      },
      selected: props.selected
    }), /*#__PURE__*/_jsx(ResizeableThumbnailDragHandleCorner, {
      left: cornerOffset,
      bottom: cornerOffset,
      cursor: 'nesw-resize',
      onMouseDown: function onMouseDown(e) {
        return props.handleMouseDown(e, true, false);
      },
      selected: props.selected
    }), /*#__PURE__*/_jsx(ResizeableThumbnailDragHandleCorner, {
      right: cornerOffset,
      top: cornerOffset,
      cursor: 'nesw-resize',
      onMouseDown: function onMouseDown(e) {
        return props.handleMouseDown(e, false, true);
      },
      selected: props.selected
    }), /*#__PURE__*/_jsx(ResizeableThumbnailDragHandleCorner, {
      right: cornerOffset,
      bottom: cornerOffset,
      cursor: 'nwse-resize',
      onMouseDown: function onMouseDown(e) {
        return props.handleMouseDown(e, false, false);
      },
      selected: props.selected
    })]
  });
};

export default ResizeableThumbnailDragHandleCorners;