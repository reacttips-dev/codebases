import { useEffect, useReducer, useRef } from 'react'

import { emojiIndex, BaseEmoji } from 'emoji-mart'

import { ActionMap } from 'utils/reducer.utils'

type UseEmoji = typeof initialState

export enum UseEmojiAction {
  CLEAR = 'clear',
  SET_LIST = 'setList',
}
export type UseEmojiActions = ActionMap<UseEmojiPayload>[keyof ActionMap<
  UseEmojiPayload
>]

type UseEmojiPayload = {
  [UseEmojiAction.CLEAR]: undefined
  [UseEmojiAction.SET_LIST]: UseEmoji
}

const initialState = {
  list: [] as BaseEmoji[],
  query: '',
}

function reducer(state: Partial<UseEmoji>, action: UseEmojiActions): UseEmoji {
  switch (action.type) {
    case UseEmojiAction.CLEAR:
      return {
        ...state,
        list: [],
        query: '',
      }
    case UseEmojiAction.SET_LIST:
      return {
        ...state,
        list: action.list,
        query: action.query,
      }
    default:
      return state as UseEmoji
  }
}

const useEmoji = quillRef => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const hide = () => dispatch({ type: UseEmojiAction.CLEAR })
  const colonSymPos = useRef()
  const cursorPos = useRef()

  useEffect(() => {
    if (quillRef) {
      quillRef.on('text-change', onTextChange)
      quillRef.on('selection-change', onSelectionChange)
    }
    return () => {
      if (quillRef) {
        quillRef.off('text-change', onTextChange)
        quillRef.off('selection-change', onSelectionChange)
      }
    }
  }, [quillRef])

  const onSomethingChange = () => {
    if (!quillRef) return
    const range = quillRef.getSelection()
    if (range == null) return

    const startPos = Math.max(0, range.index - 2) // getting two character since we need space + :
    const textBeforeCursor = quillRef.getText(startPos, range.index - startPos)

    if (textBeforeCursor === ':' && quillRef.getText().trim().length === 1) {
      colonSymPos.current = range.index
    } else if (textBeforeCursor === ' :') {
      colonSymPos.current = range.index
    }

    const colonSymPosition = colonSymPos.current
    // minimum input length is one
    if (colonSymPosition) {
      const colonSymExists = quillRef.getText(colonSymPosition - 1, 1) === ':'
      if (!colonSymExists) {
        hide()
        colonSymPos.current = undefined
        return
      }

      if (colonSymPosition < range.index - 1) {
        const textAfterColonSym = quillRef.getText(
          colonSymPosition,
          range.index,
        )
        if (textAfterColonSym.indexOf(' ') > -1) {
          hide()
        } else {
          cursorPos.current = range.index
          const list = (emojiIndex.search(textAfterColonSym) ||
            []) as BaseEmoji[]
          dispatch({
            type: UseEmojiAction.SET_LIST,
            list,
            query: textAfterColonSym,
          })
        }
      } else {
        hide()
      }
    }
  }

  const onTextChange = (delta, oldDelta, source) => {
    if (source === 'user') {
      onSomethingChange()
    }
  }

  const onSelectionChange = range => {
    if (range && range.length === 0) {
      onSomethingChange()
    }
  }

  return {
    state,
    hide,
    colonSymPos: colonSymPos.current || 0,
    cursorPos: cursorPos.current || 1,
  }
}
export default useEmoji
