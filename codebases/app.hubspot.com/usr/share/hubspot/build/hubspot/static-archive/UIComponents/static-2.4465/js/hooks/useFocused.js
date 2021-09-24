'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useCallback, useState } from 'react';
export default function useFocused(_ref) {
  var focused = _ref.focused,
      onFocus = _ref.onFocus,
      onBlur = _ref.onBlur;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      focusedState = _useState2[0],
      setFocusedState = _useState2[1];

  var handleFocus = useCallback(function (evt) {
    if (onFocus) onFocus(evt);
    setFocusedState(true);
  }, [onFocus]);
  var handleBlur = useCallback(function (evt) {
    if (onBlur) onBlur(evt);
    setFocusedState(false);
  }, [onBlur]);
  return {
    focused: focused != null ? focused : focusedState,
    onFocus: focusedState ? onFocus : handleFocus,
    onBlur: focusedState ? handleBlur : onBlur
  };
}