'use es6';

import { useRef } from 'react';
var INITIAL_REF_VALUE = Symbol();
/**
 * @param {Function} factory A function that's run once to generate a value
 * @return {*} The value returned by the factory function on first render
 */

export default function useFactory(factory) {
  var ref = useRef(INITIAL_REF_VALUE);

  if (ref.current === INITIAL_REF_VALUE) {
    ref.current = factory();
  }

  return ref.current;
}