'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useCallback, useState } from 'react';
export default function useHovered(_ref) {
  var hovered = _ref.hovered,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      onMouseMove = _ref.onMouseMove;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      hoveredState = _useState2[0],
      setHoveredState = _useState2[1];

  var handleMouseEnter = useCallback(function (evt) {
    if (onMouseEnter) onMouseEnter(evt);
    setHoveredState(true);
  }, [onMouseEnter]);
  var handleMouseLeave = useCallback(function (evt) {
    if (onMouseLeave) onMouseLeave(evt);
    setHoveredState(false);
  }, [onMouseLeave]); // Why listen for `mousemove`? See: https://git.hubteam.com/HubSpot/UIComponents/issues/3927

  var handleMouseMove = useCallback(function (evt) {
    if (onMouseMove) onMouseMove(evt);
    setHoveredState(true);
  }, [onMouseMove]);
  return {
    hovered: hovered != null ? hovered : hoveredState,
    onMouseEnter: hoveredState ? onMouseEnter : handleMouseEnter,
    onMouseLeave: hoveredState ? handleMouseLeave : onMouseLeave,
    onMouseMove: hoveredState ? onMouseMove : handleMouseMove
  };
}