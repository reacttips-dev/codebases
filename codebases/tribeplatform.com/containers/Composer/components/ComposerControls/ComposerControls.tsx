import React, { CSSProperties, FC, useCallback, useState } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import Quill from 'quill'
import AddLineIcon from 'remixicon-react/AddLineIcon'
import EmotionLineIcon from 'remixicon-react/EmotionLineIcon'
import Image2LineIcon from 'remixicon-react/Image2LineIcon'

import { EmojiPickerResult, EmojiPicker } from 'tribe-components'

import useEmbed from 'containers/Composer/hooks/useEmbed'
import useInsertEmoji from 'containers/Composer/hooks/useInsertEmoji'

import useToggle from 'hooks/useToggle'

import Menu, { MenuItemType } from '../Menu'
import { ComposerIconButton } from './ComposerIconButton'

interface ComposerControlsProps {
  quill: Quill | null
}

const menuTriggerStyles: CSSProperties = {
  position: 'relative',
  top: 0,
  left: 0,
}

const ComposerControls: FC<ComposerControlsProps> = ({ quill, children }) => {
  const [isMenuVisible, toggleMenu] = useToggle(false)
  const quillId = (quill?.container as HTMLElement)?.id
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { insertEmoji } = useInsertEmoji(quill)

  const { embed } = useEmbed()

  const onEmojiSelect = useCallback(
    (emoji: EmojiPickerResult) => {
      quill.focus()

      const cursor = quill.getSelection()
      insertEmoji(emoji, cursor.index)
      setShowEmojiPicker(false)
    },
    [insertEmoji, quill],
  )

  const selectImage = useCallback(() => {
    const fileInput = document.getElementById(`${quillId}-fileInput`)
    if (fileInput) fileInput.click()
  }, [quillId])

  const onMenuItemClick = (menuItemType: MenuItemType) => {
    setShowEmojiPicker(menuItemType === MenuItemType.Emoji)
  }

  const handleEmbedPaste = useCallback(
    (value: string) => {
      return new Promise((resolve, reject) => {
        embed(value)
          .then(data => {
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    [embed],
  )

  if (!quill) {
    return null
  }

  const slashMenuTrigger = (
    <ComposerIconButton
      icon={AddLineIcon}
      aria-label="Options"
      onClick={toggleMenu}
      position={isMenuVisible ? 'absolute' : 'relative'}
    />
  )

  return (
    <HStack
      spacing={2}
      pr={2}
      // Prevents tag hashes from oveflowing
      overflow="hidden"
    >
      {isMenuVisible ? (
        <Box>
          <Menu
            quill={quill}
            hide={toggleMenu}
            triggerStyles={menuTriggerStyles}
            onMenuItemClick={onMenuItemClick}
            handleEmbedPaste={handleEmbedPaste}
          >
            {slashMenuTrigger}
          </Menu>
        </Box>
      ) : (
        slashMenuTrigger
      )}

      <EmojiPicker shouldShow={showEmojiPicker} onSelect={onEmojiSelect}>
        <ComposerIconButton icon={EmotionLineIcon} aria-label="Emoji" />
      </EmojiPicker>
      <ComposerIconButton
        icon={Image2LineIcon}
        aria-label="Image"
        onClick={selectImage}
      />
      {/* <IconButton
              icon={<AttachmentLineIcon size="16px" />}
              aria-label="asada"
              border="1px solid"
              borderColor="border.base"
              px={2}
              py={2}
              h="auto"
              borderRadius="md"
            /> */}
      {children}
    </HStack>
  )
}

export default ComposerControls
