'use es6';

import { useEffect, useRef } from 'react';
/**
 * Tracks whether the current component is mounted or not. Because functional
 * components don't have lifecycle methods we need to use a combination of refs
 * and side effects to track this.
 *
 * @example
 * function MyAsyncComponent() {
 *   const [response, setResponse] = useState(null);
 *   const isMounted = useIsMounted();
 *   useEffect(() => {
 *     fetch(myUrl).then(response => {
 *       if (isMounted.current) setResponse(response)
 *     })
 *   }, [isMounted]);
 *   return <div>hello, world!</div>
 * }
 *
 * @returns {React.Ref<Boolean>} A ref representing the component's mount state
 */

export function useIsMounted() {
  var isMounted = useRef(true);
  useEffect(function () {
    return function () {
      return isMounted.current = false;
    };
  }, []);
  return isMounted;
}