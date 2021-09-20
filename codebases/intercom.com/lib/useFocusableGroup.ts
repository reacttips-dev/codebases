import React, { useEffect, useState } from 'react'

interface IOptions {
  /** Whether the list should loop around the edges, like Pac-Man. */
  loop: boolean
}

export default function useFocusableGroup<T extends HTMLElement>(options?: IOptions) {
  const { loop = false } = options || {}

  const refList: React.RefObject<T>[] = []

  const [focusedIndex, setFocusedIndex] = useState(0)

  function addRef(): React.RefObject<T> {
    const ref = React.createRef<T>()
    refList.push(ref)
    return ref
  }

  function focusNext() {
    setFocusedIndex(focusedIndex + 1)
    focusAtIndex(focusedIndex + 1)
  }

  function focusPrevious() {
    setFocusedIndex(focusedIndex - 1)
    focusAtIndex(focusedIndex - 1)
  }

  function focusFirst() {
    setFocusedIndex(0)
    focusAtIndex(0)
  }

  function focusLast() {
    setFocusedIndex(refList.length - 1)
    focusAtIndex(refList.length - 1)
  }

  function isFocused(index: number) {
    return index === focusedIndex
  }

  useEffect(() => {
    let newFocusedIndex

    if (loop) {
      newFocusedIndex = ((focusedIndex % refList.length) + refList.length) % refList.length
    } else {
      newFocusedIndex = Math.max(Math.min(focusedIndex, refList.length - 1), 0)
    }

    setFocusedIndex(newFocusedIndex)
    if (newFocusedIndex !== focusedIndex) {
      focusAtIndex(newFocusedIndex)
    }
  }, [refList, focusedIndex, loop, focusAtIndex])

  function focusAtIndex(index: number) {
    const ref = refList[index]
    if (!ref) return

    const element = ref.current
    if (!element) return

    element.focus()
  }

  return {
    itemProps: (index: number) => ({
      ref: addRef(),
      tabIndex: isFocused(index) ? 0 : -1,
      onFocus: () => setFocusedIndex(index),
    }),
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    refList,
  }
}
