import { useState, useContext } from 'react'
import { FocusVisibleContext } from './FocusVisibleManager'

function useFocusVisible() {
  const [isFocused, setIsFocused] = useState(false)
  const { hasHadKeyboardEvent, isInitialized } = useContext(FocusVisibleContext)

  function onFocus() {
    setIsFocused(true)
  }

  function onBlur() {
    setIsFocused(false)
  }

  let focusVisible
  if (isInitialized) {
    focusVisible = hasHadKeyboardEvent && isFocused
  } else {
    focusVisible = isFocused
  }

  return {
    focusVisible,
    onFocus,
    onBlur,
  }
}

export default useFocusVisible
