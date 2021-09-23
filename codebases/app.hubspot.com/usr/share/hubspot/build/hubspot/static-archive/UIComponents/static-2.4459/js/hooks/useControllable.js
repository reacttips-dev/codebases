'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useCallback, useRef, useState } from 'react';
import usePrevious from 'react-utils/hooks/usePrevious';
/**
 * A hook for implementing the controllable pattern.
 *
 * @param {*} value The current value of the controllable property
 * @param {*} defaultValue The default value of the controllable property
 * @param {Function} onChange An external handler to fire when `handleChange` is called
 * @return {Array} An array of the form `[computedValue, handleChange]`
 */

export default function useControllable(value, defaultValue, onChange) {
  var _useState = useState(defaultValue),
      _useState2 = _slicedToArray(_useState, 2),
      stateValue = _useState2[0],
      setStateValue = _useState2[1]; // Store `onChange` in a ref so that our `handleChange` can be a constant


  var onChangeRef = useRef();
  onChangeRef.current = onChange; // Compute the return value

  var computedValue = value !== undefined ? value : stateValue;
  var handleChange = useCallback(function (evt) {
    setStateValue(evt.target.value);
    if (onChangeRef.current) onChangeRef.current(evt);
  }, []); // Edge case: If `value` has become `undefined`, reset the state value to the default

  var prevValue = usePrevious(value);

  if (prevValue !== value && value === undefined && stateValue !== defaultValue) {
    setStateValue(defaultValue);
  }

  return [computedValue, handleChange];
}