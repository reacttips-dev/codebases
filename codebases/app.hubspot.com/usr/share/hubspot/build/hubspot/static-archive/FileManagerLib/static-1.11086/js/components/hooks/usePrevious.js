'use es6';

import { useEffect, useRef } from 'react';
export default function usePrevious(value) {
  var ref = useRef(null);
  useEffect(function () {
    ref.current = value;
  }, [value]);
  return ref.current;
}