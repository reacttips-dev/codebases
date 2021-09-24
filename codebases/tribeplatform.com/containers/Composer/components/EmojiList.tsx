import React, { useEffect, useRef } from 'react'

import { Box } from '@chakra-ui/react'
import Quill from 'quill'

import {
  ListView,
  ListViewTrigger,
  ListViewContent,
  ListViewItem,
  EmojiPickerResult,
} from 'tribe-components'

import { useOnClickOutside } from 'utils/useOnClickOutside'

import useDropdownKeyboard from '../hooks/useDropdownKeyboard'
import useEmoji from '../hooks/useEmoji'
import useInsertEmoji from '../hooks/useInsertEmoji'
import { getTriggerStyle } from '../utils'

const EmojiList = ({ quill }: { quill: Quill }) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const { insertEmojiWithColon } = useInsertEmoji(quill)
  const { state, hide, colonSymPos, cursorPos } = useEmoji(quill)
  const quillId = (quill as any)?.container?.id
  const emojiListId = `${quillId}-emoji-list`
  useOnClickOutside(emojiPickerRef, hide)
  const { onShow, onHide } = useDropdownKeyboard(emojiListId, quill, {
    onEscape: hide,
  })
  const isOpen = state.list?.length > 0

  const onClick = (emoji: EmojiPickerResult) => {
    hide()
    insertEmojiWithColon(emoji, colonSymPos, cursorPos)
  }

  useEffect(() => {
    if (state.list?.length > 0) {
      onShow()
    } else {
      onHide()
    }
  }, [onHide, onShow, state.list?.length])

  if (!isOpen) return null

  return (
    <div ref={emojiPickerRef}>
      <ListView isOpen>
        <ListViewTrigger style={getTriggerStyle(quill, colonSymPos)} />
        <ListViewContent id={emojiListId}>
          {state.list.map(emoji => (
            <ListViewItem
              key={emoji.id}
              display="flex"
              onClick={() => onClick(emoji)}
            >
              <Box w={10}>{emoji.native}</Box>
              <Box>{emoji.colons}</Box>
            </ListViewItem>
          ))}
        </ListViewContent>
      </ListView>
    </div>
  )
}

export default EmojiList
