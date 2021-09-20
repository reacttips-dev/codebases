import { useState } from 'react'
import { isIosSafari } from 'marketing-site/src/library/utils'

const createIOsInputScrollEvents = (onFocusFallback?: () => void, onBlurFallback?: () => void) => {
  if (!isIosSafari()) {
    return {
      iosOnFocus: onFocusFallback || constants.doNothing,
      iosOnBlur: onBlurFallback || constants.doNothing,
    }
  }

  let initialScrollYPosition = 0

  const saveInitialScrollPosition = () => {
    initialScrollYPosition = window.pageYOffset
  }

  const scrollToInitialScrollPosition = () => {
    window.scrollTo(0, initialScrollYPosition)
  }

  return {
    iosOnFocus: saveInitialScrollPosition,
    iosOnBlur: scrollToInitialScrollPosition,
  }
}

export const constants = {
  doNothing: () => {},
  createIOsInputScrollEvents,
}

export const useIOsInputScrollEvents = (
  onFocusFallback?: () => void,
  onBlurFallback?: () => void,
) => {
  const [iosInputScrollEvents] = useState(
    constants.createIOsInputScrollEvents(onFocusFallback, onBlurFallback),
  )
  return iosInputScrollEvents
}
