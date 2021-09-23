import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Picker, BaseEmoji } from 'emoji-mart'
import Quill from 'quill'

import {
  Popover,
  PopoverContentNoAnimate,
  PopoverBody,
  ListViewContentProps,
} from 'tribe-components'

import useStateCallback from 'hooks/useStateCallback'

import EmojiList from './components/EmojiList'
import MentionList from './components/MentionList'
import Menu, {
  ComposerMenuFilter,
  MenuItemType,
  MENU_ITEMS,
} from './components/Menu'
import { SLASH_SYMBOL } from './constants'
import useDropdownKeyboard from './hooks/useDropdownKeyboard'
import useEmbed from './hooks/useEmbed'
import useInsertCode from './hooks/useInsertCode'
import useComposerFile from './useComposerFile'
import { getCursorPosition, getSymbolSearchTerm } from './utils'

const INITIAL_FILTER_STATE: ComposerMenuFilter = {}

interface SlashMenuProps {
  quill: Quill | null
}

const SlashMenu = ({ quill }: SlashMenuProps) => {
  const dropdownValues: { current: any[] } = useRef([])
  const pickerRef = useRef<Picker>(null)
  const lastSelectionRef = useRef(null)
  const dropdownContainer = useRef<HTMLUListElement>(null)
  const atSlashPosition = useRef<number>()
  const [isOpen, setIsOpen] = useStateCallback(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useStateCallback(false)
  const { upload } = useComposerFile()
  const quillId = (quill as any)?.container?.id
  const fileInputId = `${quillId}-fileInput`
  const slashMenuId = `${quillId}-slash-menu`

  useInsertCode(quill)

  const { embed } = useEmbed()
  const [filteredItems, setFilteredItems] = useState(INITIAL_FILTER_STATE)

  const isFilterEmpty = !Object.keys(filteredItems).length

  const resetFilter = useCallback(() => {
    setFilteredItems(INITIAL_FILTER_STATE)
  }, [])

  let hide

  const skipFocusOnIndexes = useMemo(
    () =>
      isFilterEmpty
        ? MENU_ITEMS.reduce(
            (acc, menuItem, index) =>
              'label' in menuItem && menuItem.label ? acc : [...acc, index],
            [],
          )
        : [],
    [isFilterEmpty],
  )

  const { onShow, onHide } = useDropdownKeyboard(slashMenuId, quill, {
    onEscape: hide,
    skipFocusOnIndexes,
  })

  hide = useCallback(() => {
    setIsOpen(false)
    onHide()

    // To fix and issue with the test env
    if (process.env.NODE_ENV !== 'test' && quill) {
      quill.focus()
    }
  }, [onHide, quill, setIsOpen])

  const show = useCallback(() => {
    setIsOpen(true, () => {
      setTimeout(() => {
        if (dropdownValues.current.length === 0) {
          const dropdown = dropdownContainer?.current
          if (!dropdown) {
            return
          }

          const dropdownItems = dropdown.querySelectorAll('li')

          dropdownItems.forEach((dropdownItem: HTMLLIElement) => {
            const type = dropdownItem.getAttribute('data-type')

            dropdownValues.current.push({
              item: {
                type,
                value: dropdownItem.textContent,
              },
            })
          })
        }
      })
    })

    onShow()
  }, [onShow, setIsOpen])

  const getEmojiPickerStyle = useCallback((): React.CSSProperties => {
    if (typeof window === 'undefined') {
      return {}
    }

    const cursorPosition = getCursorPosition(quill)

    if (cursorPosition == null) return {}

    const emojiPickerHeight =
      ((pickerRef?.current as unknown) as HTMLElement)?.clientHeight || 352
    const emojiPickerWidth =
      ((pickerRef?.current as unknown) as HTMLElement)?.clientWidth || 352
    const windowPadding = 20
    const { innerWidth, innerHeight } = window || {}

    const emojiPickerStyle: React.CSSProperties = {
      position: 'fixed',
      top: cursorPosition.top,
      left: cursorPosition.left,
    }

    if (cursorPosition.top + emojiPickerHeight > innerHeight) {
      emojiPickerStyle.top = innerHeight - emojiPickerHeight - windowPadding
    }

    if (cursorPosition.left + emojiPickerWidth > innerWidth) {
      emojiPickerStyle.left = innerWidth - emojiPickerWidth - windowPadding
    }

    return emojiPickerStyle
  }, [quill])

  const clearSlashMenu = useCallback(() => {
    resetFilter()
    hide()
  }, [hide, resetFilter])

  const slashSearchTermMatches = useCallback(
    () =>
      getSymbolSearchTerm({
        quill,
        symbolPositionRef: atSlashPosition,
        symbol: SLASH_SYMBOL,
      }),
    [quill],
  )

  const handleSlashType = useCallback(() => {
    const localFilter: ComposerMenuFilter = {}

    const searchTerm = slashSearchTermMatches()

    if (
      typeof searchTerm === 'string' &&
      typeof atSlashPosition.current === 'number'
    ) {
      if (searchTerm) {
        const trimmedString = searchTerm.toLowerCase()

        dropdownValues.current.forEach(dropdown => {
          if (
            trimmedString.length > 0 &&
            dropdown?.item?.value.toLowerCase().includes(trimmedString)
          ) {
            localFilter[dropdown?.item?.type] = trimmedString
          }
        })

        if (Object.keys(localFilter).length === 0) {
          clearSlashMenu()
        } else {
          setFilteredItems(localFilter)

          if (!isOpen) {
            show()
          }
        }
      } else {
        resetFilter()
        show()
      }
    } else {
      clearSlashMenu()
    }
  }, [clearSlashMenu, isOpen, resetFilter, show, slashSearchTermMatches])

  const onSomethingChange = useCallback(() => {
    if (!quill) return

    handleSlashType()
  }, [handleSlashType, quill])

  const onTextChange = useCallback(
    (delta, oldDelta, source) => {
      if (source === 'user') {
        onSomethingChange()
      }
    },
    [onSomethingChange],
  )

  const onSelectionChange = useCallback(
    (range, oldRange, source) => {
      if (source !== 'user') return

      if (range) {
        lastSelectionRef.current = quill.getText(range.index, range.length)
      }

      // We reset whenever another text is selected.
      atSlashPosition.current = undefined
      if (range && range.length === 0) {
        onSomethingChange()
      }
    },
    [onSomethingChange, quill],
  )

  useEffect(() => {
    if (quill) {
      quill.on('text-change', onTextChange)
      quill.on('selection-change', onSelectionChange)
    }

    return () => {
      if (quill) {
        quill.off('text-change', onTextChange)
        quill.off('selection-change', onSelectionChange)
      }
    }
  }, [onSelectionChange, onTextChange, quill])

  const removeTextAfterSlash = useCallback(
    (range: number | undefined) => {
      const slashPosition = quill.getSelection(true)?.index || 0

      quill.deleteText(slashPosition - 1, range || 1, 'user')
    },
    [quill],
  )

  const onMenuItemClick = useCallback(
    (tag: string) => {
      if (filteredItems) {
        removeTextAfterSlash(filteredItems[tag]?.length)
      }

      if (tag === MenuItemType.Emoji) {
        return setIsEmojiPickerOpen(true)
      }
    },
    [filteredItems, removeTextAfterSlash, setIsEmojiPickerOpen],
  )

  const onFileChange = useCallback(
    e => {
      upload(e?.target?.files, quill)

      // Clear the file input state
      const fileInput = document.getElementById(
        fileInputId,
      ) as HTMLInputElement | null

      if (fileInput) {
        fileInput.value = ''
      }
    },
    [fileInputId, quill, upload],
  )

  const onSelectEmoji = useCallback(
    (emoji: BaseEmoji) => {
      const cursorPosition = quill.getSelection(true)?.index

      quill.insertText(cursorPosition, emoji.native)
      return setIsEmojiPickerOpen(false)
    },
    [quill, setIsEmojiPickerOpen],
  )
  const closeEmojiPopover = useCallback(() => {
    if (isEmojiPickerOpen) {
      return setIsEmojiPickerOpen(false)
    }
  }, [isEmojiPickerOpen, setIsEmojiPickerOpen])

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

  return (
    <div>
      <input
        type="file"
        id={fileInputId}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
      <Popover
        isOpen={isEmojiPickerOpen}
        closeOnBlur
        returnFocusOnClose={false}
        variant="responsive"
        isLazy
        onClose={closeEmojiPopover}
      >
        <PopoverContentNoAnimate>
          <PopoverBody p={0}>
            <Picker
              ref={pickerRef}
              style={getEmojiPickerStyle()}
              onSelect={onSelectEmoji}
              showSkinTones={false}
              showPreview={false}
              autoFocus
              native
            />
          </PopoverBody>
        </PopoverContentNoAnimate>
      </Popover>
      <EmojiList quill={quill} />
      {isOpen && (
        <Menu
          listContentProps={
            { ref: dropdownContainer, id: slashMenuId } as ListViewContentProps
          }
          filteredItems={filteredItems}
          quill={quill}
          hide={hide}
          onMenuItemClick={onMenuItemClick}
          handleEmbedPaste={handleEmbedPaste}
        />
      )}
      {quill && <MentionList quill={quill} />}
    </div>
  )
}

export default SlashMenu
