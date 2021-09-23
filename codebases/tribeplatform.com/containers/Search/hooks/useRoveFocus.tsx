import {
  useCallback,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'

// TODO: Not reusable enough to be included in common hooks folder. Make it more reusable
const useRoveFocus = (
  size: number,
): [[number, boolean], Dispatch<SetStateAction<[number, boolean]>>] => {
  const [[currentFocus, withMouse], setCurrentFocus] = useState<
    [number, boolean]
  >([0, false])

  const handleKeyDown = useCallback(
    e => {
      if (e.keyCode === 40) {
        // Down arrow
        e.preventDefault()
        setCurrentFocus([
          currentFocus === size - 1 ? 0 : currentFocus + 1,
          false,
        ])
      } else if (e.keyCode === 38) {
        // Up arrow
        e.preventDefault()
        setCurrentFocus([
          currentFocus === 0 ? size - 1 : currentFocus - 1,
          false,
        ])
      }
    },
    [size, currentFocus, setCurrentFocus],
  )

  useEffect(() => {
    if (size > 0) {
      setCurrentFocus([0, false])
    }
  }, [size])

  useEffect(() => {
    // TODO: Attach listener to some inner element. Having focus issues with up/down. Reverting to document for now.
    document.addEventListener('keydown', handleKeyDown, false)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
    }
  }, [handleKeyDown])

  return [[currentFocus, withMouse], setCurrentFocus]
}

export default useRoveFocus
