import { useEffect } from 'react'

var config = {
  attributes: true,
  characterData: true,
  subtree: true,
  childList: true
}

function useMutationObserver(ref, callback, options = config) {
  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (ref.current) {
      const observer = new MutationObserver(callback)

      // Start observing the target node for configured mutations
      observer.observe(ref.current, options)
      return () => {
        observer.disconnect()
      }
    }
  }, [callback, options])
}

export default useMutationObserver
