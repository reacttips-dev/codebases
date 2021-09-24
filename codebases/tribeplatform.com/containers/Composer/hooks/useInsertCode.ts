import { useEffect, useRef } from 'react'

const KeyCodes = {
  Enter: 13,
}
const useInsertCode = quillRef => {
  const doubleBackTicksPos: { current: number | null } = useRef(0)
  const containerId = quillRef?.container?.id

  const keyEnterHandler = () => {
    doubleBackTicksPos.current = null
    return true
  }

  useEffect(() => {
    if (quillRef) {
      quillRef.on('text-change', onTextChange)
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
    return () => {
      if (quillRef) {
        quillRef.off('text-change', onTextChange)
        const enterBindings = quillRef.keyboard.bindings[KeyCodes.Enter]
        const index = enterBindings.findIndex(
          e => e.containerId === containerId,
        )
        if (index > -1) {
          quillRef.keyboard.bindings[KeyCodes.Enter].splice(index, 1)
        }
      }
    }
  }, [quillRef])

  const onSomethingChange = () => {
    if (!quillRef) return
    const range = quillRef.getSelection()
    if (range == null) return

    const startPos = Math.max(0, range.index - 2) // getting two character since we need space + :
    const textBeforeCursor = quillRef.getText(startPos, range.index - startPos)

    if (textBeforeCursor === '``') {
      if (!doubleBackTicksPos.current) {
        doubleBackTicksPos.current = range.index
      } else {
        if (Math.abs(doubleBackTicksPos?.current - range.index) === 1) {
          doubleBackTicksPos.current = null
          return
        }
        quillRef.formatText(
          doubleBackTicksPos.current,
          range.index,
          'code',
          true,
        )
        // Empty space
        quillRef.insertText(range.index, ' ', 'code', true)
        // Remove backticks after text including empty space.
        quillRef.formatText(range.index - 2, 3, 'code', false)
        quillRef.deleteText(range.index - 2, 2)
        // Remove backticks before text.
        quillRef.deleteText(doubleBackTicksPos?.current - 2, 2)
        doubleBackTicksPos.current = null
      }
    }
  }

  const onTextChange = (delta, oldDelta, source) => {
    if (source === 'user') {
      onSomethingChange()
    }
  }
}
export default useInsertCode
