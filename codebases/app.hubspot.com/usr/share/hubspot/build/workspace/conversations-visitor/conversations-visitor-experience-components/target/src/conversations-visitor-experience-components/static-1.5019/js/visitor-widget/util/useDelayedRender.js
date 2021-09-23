'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useEffect } from 'react';
export var useDelayedRender = function useDelayedRender(delay) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      finished = _useState2[0],
      setFinished = _useState2[1];

  useEffect(function () {
    setTimeout(function () {
      return setFinished(true);
    }, delay); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return finished;
};