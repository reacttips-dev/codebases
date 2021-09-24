import { useEffect, useRef } from 'react';
/**
 * A hook to replace ye olde `this._isMounted`. Check this value before setting state after a
 * timeout, if it isn't practical to clear that timeout on unmount.
 *
 * @returns A ref with the value `true` if this component is mounted, `false` otherwise
 */

export default function () {
  var mounted = useRef(false);
  useEffect(function () {
    mounted.current = true;
    return function () {
      mounted.current = false;
    };
  }, []);
  return mounted;
}