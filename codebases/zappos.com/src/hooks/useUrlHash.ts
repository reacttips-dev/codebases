import { useEffect, useRef, useState } from 'react';

import { useWindowEvent } from 'hooks/useEvent';
import useMartyContext from 'hooks/useMartyContext';

// This hook syncs up a state variable with the hash history.
// Hash url state is pushed with a change and popped when the user/code hits the back button
// If removeHashOnUnmount is true, the hashes are removed on unmount using a history.go call with the number of hash changes
// This maintains correcty browser history without needing to manually call history.back

// This can be used with manual window.history.back() calls and popstate browser event listeners
// to do some complicated hash history manipulation while maintaining proper browser history
// (i.e able to remove the hash before navigating to another page to prevent user from returning to previous page with hash)
const useUrlHash = (initialHash: string, { hashEmptyEvent, removeHashOnUnmount = true }: { hashEmptyEvent?: EventListener; removeHashOnUnmount?: boolean }) => {
  const isMounted = useRef(true); // prevent state change in hashchange event handler after component that uses this is unmounted
  const hashChangeCount = useRef(0); // keep track of how many hash changes so we can pop them all on unmount if flag passed in
  const [hash, setHash] = useState(initialHash);
  const { loadedWithHash } = useMartyContext();

  useWindowEvent('hashchange', e => {
    if (window.location.hash === '') {
      hashEmptyEvent && typeof hashEmptyEvent === 'function' && hashEmptyEvent(e);
      isMounted.current && setHash(''); // sync the hash state.
    }
  });
  useEffect(() => {
    const newHash = `#${hash}`;
    if (window.location.hash !== newHash) { // only change hash if a new one is added to avoid duplicate hash history entry
      window.history.pushState(null, '', newHash);
      hashChangeCount.current += 1;
    }
    return () => {
      isMounted.current = false;
      if (removeHashOnUnmount && window.location.hash !== '') {
        hashChangeCount.current > 0 && window.history.go(-hashChangeCount.current); // Need to pop all the hash changes
        if (loadedWithHash) { // page was loaded with a hash
          window.history.replaceState(null, '', ' '); // Need to replace the initial page load hashed state with the same state but without the hash
        } else if (hashChangeCount.current === 0) {
          window.history.back(); // Need to go back despite no hash changes because this state was navigated to via forward button so we need to pop this still
        }
      }
    };
  }, [hash, hashChangeCount, removeHashOnUnmount, loadedWithHash]);
  return [hash, setHash];
};

export default useUrlHash;
