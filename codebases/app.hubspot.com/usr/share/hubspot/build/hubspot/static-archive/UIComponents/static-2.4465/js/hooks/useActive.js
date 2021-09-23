'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useCallback, useEffect, useState } from 'react';

var keyTogglesActive = function keyTogglesActive(_ref) {
  var key = _ref.key;
  return key === 'Enter' || key === ' ';
};

export default function useActive(_ref2) {
  var active = _ref2.active,
      onMouseDown = _ref2.onMouseDown,
      onKeyDown = _ref2.onKeyDown,
      onKeyUp = _ref2.onKeyUp,
      onBlur = _ref2.onBlur;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      activeState = _useState2[0],
      setActiveState = _useState2[1];

  var handleMouseDown = useCallback(function (evt) {
    if (onMouseDown) onMouseDown(evt);
    setActiveState(true);
  }, [onMouseDown]);
  var handleKeyDown = useCallback(function (evt) {
    if (onKeyDown) onKeyDown(evt);
    if (keyTogglesActive(evt)) setActiveState(true);
  }, [onKeyDown]);
  var handleKeyUp = useCallback(function (evt) {
    if (onKeyUp) onKeyUp(evt);
    if (keyTogglesActive(evt)) setActiveState(false);
  }, [onKeyUp]);
  var handleBlur = useCallback(function (evt) {
    if (onBlur) onBlur(evt);
    setActiveState(false);
  }, [onBlur]); // After `mousedown` on the wrapped element, `mouseup` may occur elsewhere in the document.

  useEffect(function () {
    if (!activeState) return undefined;

    var handleMouseUp = function handleMouseUp() {
      setActiveState(false);
    };

    addEventListener('mouseup', handleMouseUp);
    return function () {
      removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeState]);
  return {
    active: active != null ? active : activeState,
    onMouseDown: activeState ? onMouseDown : handleMouseDown,
    onKeyDown: activeState ? onKeyDown : handleKeyDown,
    onKeyUp: activeState ? handleKeyUp : onKeyUp,
    onBlur: activeState ? handleBlur : onBlur
  };
}