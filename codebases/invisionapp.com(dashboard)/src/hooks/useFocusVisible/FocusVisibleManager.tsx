/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState, createContext, ReactNode } from 'react'

export const FocusVisibleContext = createContext({
  hasHadKeyboardEvent: true,
  isInitialized: false,
})

export interface FocusVisibleManagerProps {
  children: ReactNode
}

const FocusVisibleManager = (props: FocusVisibleManagerProps) => {
  const [hasHadKeyboardEvent, setHasHadKeyboardEvent] = useState(true)

  useEffect(() => {
    const formAllowList = ['INPUT', 'TEXTAREA']

    function onPointerDown() {
      setHasHadKeyboardEvent(false)
    }

    function onPointerMove(e: Event) {
      const target = e?.target as Element
      if (target?.nodeName?.toLowerCase() === 'html') {
        return
      }
      setHasHadKeyboardEvent(false)
      removePointerEvents()
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return
      }
      // Fixes a bug whereby the focus indicator would appear when typing into a form field.
      // We only want the focus indicator to appear on tabbing through
      const currentActiveElementType = document?.activeElement?.nodeName
      const isAllowlistedElement = currentActiveElementType
        ? formAllowList.includes(currentActiveElementType)
        : false
      if (isAllowlistedElement && e.key !== 'Tab') {
        return
      }

      setHasHadKeyboardEvent(true)
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        setHasHadKeyboardEvent(true)
        addPointerEvents()
      }
    }

    function addPointerEvents() {
      document.addEventListener('mousemove', onPointerMove)
      document.addEventListener('mousedown', onPointerMove)
      document.addEventListener('mouseup', onPointerMove)
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerdown', onPointerMove)
      document.addEventListener('pointerup', onPointerMove)
      document.addEventListener('touchmove', onPointerMove)
      document.addEventListener('touchstart', onPointerMove)
      document.addEventListener('touchend', onPointerMove)
    }

    function removePointerEvents() {
      document.removeEventListener('mousemove', onPointerMove)
      document.removeEventListener('mousedown', onPointerMove)
      document.removeEventListener('mouseup', onPointerMove)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerdown', onPointerMove)
      document.removeEventListener('pointerup', onPointerMove)
      document.removeEventListener('touchmove', onPointerMove)
      document.removeEventListener('touchstart', onPointerMove)
      document.removeEventListener('touchend', onPointerMove)
    }

    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('mousedown', onPointerDown, true)
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('touchstart', onPointerDown, true)
    document.addEventListener('visibilitychange', onVisibilityChange, true)

    addPointerEvents()

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('mousedown', onPointerDown, true)
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('touchstart', onPointerDown, true)
      document.removeEventListener('visibilitychange', onVisibilityChange, true)

      removePointerEvents()
    }
  }, [])

  return (
    <FocusVisibleContext.Provider
      value={{ hasHadKeyboardEvent, isInitialized: true }}
    >
      {props.children}
    </FocusVisibleContext.Provider>
  )
}

export default FocusVisibleManager
