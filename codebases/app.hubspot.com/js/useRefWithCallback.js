'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useCallback } from 'react'; // Similar to useRef hook but updating the ref actually triggers rerenders

export var useRefWithCallback = function useRefWithCallback() {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      ref = _useState2[0],
      setRef = _useState2[1];

  var onSetRef = useCallback(function (node) {
    setRef(node);
  }, []);
  return [ref, onSetRef];
};