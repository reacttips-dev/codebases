import { useState, useEffect } from 'react'
import copy from 'copy-to-clipboard'

interface Options {
  duration?: number
}

function useCopy(
  options: Options = {
    duration: 1000,
  }
): { isCopied: boolean; setCopy: (text: string) => void } {
  const { duration } = options
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isCopied && duration != null) {
      const timer = setTimeout(() => setIsCopied(false), duration)
      return () => clearTimeout(timer)
    }
  }, [duration, isCopied])

  return {
    isCopied,
    setCopy: (text: string) => {
      const didCopy = copy(text)
      setIsCopied(didCopy)
    },
  }
}

export default useCopy
