import { KeyboardEvent, useCallback, useRef } from 'react'

import Quill from 'quill'

import scrollElementIntoView from 'lib/dom/scrollIntoView'

const KeyCodes = {
  ArrowUp: 38,
  ArrowDown: 40,
  Enter: 13,
  Escape: 27,
}

interface DropdownOptions {
  onEscape?: (event: KeyboardEvent) => void
  skipFocusOnIndexes?: number[]
}

const FocusedClassName = 'ql-focused-item'
const useDropdownKeyboard = (
  containerId: string,
  quillRef: Quill,
  options: DropdownOptions,
) => {
  const indexRef = useRef(0)

  const keyEnterHandler = () => {
    hitElement(indexRef.current)
    return false
  }

  const keyDownHandler = (event: KeyboardEvent) => {
    const stop = () => {
      event.preventDefault()
      event.stopPropagation()
    }

    switch (event.keyCode) {
      case KeyCodes.ArrowUp:
        stop()
        focusOnElement(indexRef.current - 1)
        break
      case KeyCodes.ArrowDown:
        stop()
        focusOnElement(indexRef.current + 1)
        break
      case KeyCodes.Escape:
        options.onEscape?.(event)
        onHide()
        break
      default:
        break
    }
  }

  const hitElement = useCallback(
    index => {
      const { children = [] } = document.getElementById(containerId) || {}
      if (children[index]) (children[index] as HTMLElement).click()
    },
    [containerId],
  )

  const focusOnElement = useCallback(
    index => {
      let idx = index

      if (options.skipFocusOnIndexes?.includes(idx)) {
        if (idx > indexRef.current) {
          return focusOnElement(idx + 1)
        }
        return focusOnElement(idx - 1)
      }

      const { children = [] } = document.getElementById(containerId) || {}

      if (children.length <= idx) idx = 0
      if (idx < 0) idx = children.length - 1

      if (children[indexRef.current]) {
        children[indexRef.current].classList.remove(FocusedClassName)
      }

      const target = children[idx] as HTMLElement
      if (target) {
        scrollElementIntoView(target)
        target.classList.add(FocusedClassName)
        indexRef.current = idx
      }
    },
    [containerId, options.skipFocusOnIndexes],
  )

  const onShow = useCallback(() => {
    if (quillRef?.root) {
      quillRef.root.addEventListener('keydown', keyDownHandler)
      // enter key should only handled by addBinding otherwise it won't work
      const enterBindings = quillRef.keyboard.bindings[KeyCodes.Enter]
      const index = enterBindings.findIndex(e => e.containerId === containerId)
      if (index === -1) {
        quillRef.keyboard.addBinding(
          {
            containerId,
            key: KeyCodes.Enter,
          },
          keyEnterHandler,
        )
        quillRef.keyboard.bindings[KeyCodes.Enter].unshift(
          quillRef.keyboard.bindings[KeyCodes.Enter].pop(),
        )
      }
    }
    setTimeout(() => {
      focusOnElement(0)
    }, 10)

    // focusOnElement is new each time and causes inconsistent
    // jump when navigating between list items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, quillRef])

  const onHide = useCallback(() => {
    if (quillRef?.root) {
      quillRef.root.removeEventListener('keydown', keyDownHandler)
      const enterBindings = quillRef.keyboard.bindings[KeyCodes.Enter]
      const index = enterBindings.findIndex(e => e.containerId === containerId)
      if (index > -1) {
        quillRef.keyboard.bindings[KeyCodes.Enter].splice(index, 1)
      }
    }
  }, [quillRef])

  return {
    onShow,
    onHide,
  }
}

export default useDropdownKeyboard
