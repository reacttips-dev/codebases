'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useRef, useEffect, useState } from 'react'; // From https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/.

export var usePrevious = function usePrevious(value) {
  var ref = useRef();
  useEffect(function () {
    ref.current = value;
  });
  return ref.current;
};
export function useWindowSize() {
  var _useState = useState({
    width: undefined,
    height: undefined
  }),
      _useState2 = _slicedToArray(_useState, 2),
      windowSize = _useState2[0],
      setWindowSize = _useState2[1];

  useEffect(function () {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return function () {
      return window.removeEventListener('resize', handleResize);
    };
  }, []);
  return windowSize;
}