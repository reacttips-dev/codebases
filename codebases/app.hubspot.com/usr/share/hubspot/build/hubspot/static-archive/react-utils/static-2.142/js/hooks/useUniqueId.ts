var count = 0;
import { useRef } from 'react';
/**
 * @param {?string} prefix
 * @return {string} An id string that's unique for that prefix
 */

export default function useUniqueId(prefix) {
  var idRef = useRef();

  if (!idRef.current) {
    count += 1;
    idRef.current = "" + prefix + count;
  }

  return idRef.current;
}