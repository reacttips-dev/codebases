import React, { FC, ReactNode, useCallback, useEffect, useRef } from 'react'

import { Box, Divider } from '@chakra-ui/react'
import Quill from 'quill'
import { RemixiconReactIconComponentType } from 'remixicon-react'
import AtLineIcon from 'remixicon-react/AtLineIcon'
import EmotionLineIcon from 'remixicon-react/EmotionLineIcon'
import H1Icon from 'remixicon-react/H1Icon'
import H2Icon from 'remixicon-react/H2Icon'
import Image2LineIcon from 'remixicon-react/Image2LineIcon'
import ListOrderedIcon from 'remixicon-react/ListOrderedIcon'
import ListUnorderedIcon from 'remixicon-react/ListUnorderedIcon'
import SafariLineIcon from 'remixicon-react/SafariLineIcon'

import {
  useToast,
  ListViewTrigger,
  ListView,
  ListViewContent,
  ListViewItem,
  ListViewIcon,
  ListViewContentProps,
  ListViewProps,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { useOnClickOutside } from 'utils/useOnClickOutside'

import useInsertCode from '../hooks/useInsertCode'
import { getTriggerStyle } from '../utils'

const staticProps = {
  menuContainerStyles: {
    '& > div': {
      // Fix interactability of the slash menu items
      // when it's rendered/stacked above composer
      zIndex: 'popover',
    },
  },
}

export enum MenuItemType {
  BulletList = 'bulletList',
  NumberedList = 'numberedList',
  LargeHeader = 'largeHeader',
  MediumHeader = 'mediumHeader',
  Image = 'image',
  Emoji = 'emoji',
  Mention = 'mention',
  Embed = 'embed',
}

type MenuItem =
  | {
      type: MenuItemType
      label: string
      icon: RemixiconReactIconComponentType
    }
  | {
      Component: ({ isFilterEmpty }: { isFilterEmpty?: boolean }) => JSX.Element
    }

export const MENU_ITEMS: MenuItem[] = [
  {
    type: MenuItemType.BulletList,
    label: 'Bulleted List',
    icon: ListUnorderedIcon,
  },
  {
    type: MenuItemType.NumberedList,
    label: 'Numbered List',
    icon: ListOrderedIcon,
  },
  {
    type: MenuItemType.LargeHeader,
    label: 'Large Header',
    icon: H1Icon,
  },
  {
    type: MenuItemType.MediumHeader,
    label: 'Medium Header',
    icon: H2Icon,
  },
  {
    Component: ({ isFilterEmpty = false }: { isFilterEmpty: boolean }) =>
      isFilterEmpty ? <Divider /> : <></>,
  },
  {
    type: MenuItemType.Image,
    label: 'Image',
    icon: Image2LineIcon,
  },
  {
    type: MenuItemType.Emoji,
    label: 'Emoji',
    icon: EmotionLineIcon,
  },
  {
    type: MenuItemType.Mention,
    label: 'Mention',
    icon: AtLineIcon,
  },
  {
    type: MenuItemType.Embed,
    label: 'Embed',
    icon: SafariLineIcon,
  },
]

// Create a state object to hold all filter values.
export type ComposerMenuFilter = Partial<Record<MenuItemType, boolean>>

interface MenuProps {
  quill: Quill | null
  filteredItems?: ComposerMenuFilter
  hide: () => void
  onMenuItemClick?: (tag: MenuItemType) => void
  triggerStyles?: React.CSSProperties
  listProps?: ListViewProps
  listContentProps?: ListViewContentProps
  handleEmbedPaste: (value: string) => Promise<unknown>
  children?: ReactNode
}

const Menu: FC<MenuProps> = ({
  quill,
  filteredItems = {},
  hide,
  triggerStyles,
  listProps,
  listContentProps,
  handleEmbedPaste,
  onMenuItemClick,
  children,
}) => {
  const listViewRef = useRef<HTMLDivElement>(null)
  const { network } = useGetNetwork()
  const themeSettings = network?.themes?.active?.tokens
  const { t } = useTranslation()
  const toast = useToast()
  const quillId = (quill?.container as HTMLElement)?.id
  const fileInputId = `${quillId}-fileInput`

  useInsertCode(quill)
  useOnClickOutside(listViewRef, hide)

  const handleEmbedInvalid = useCallback(() => {
    toast({
      title: t('composer:embed.error.title', {
        defaultValue: 'Error',
      }),
      description: t('composer:embed.error.description', {
        defaultValue: 'Invalid Embed Link',
      }),
      status: 'error',
    })
  }, [])

  const onClick = useCallback(
    (tag: MenuItemType) => async e => {
      e.preventDefault()
      hide?.()
      onMenuItemClick?.(tag)

      switch (tag) {
        case MenuItemType.LargeHeader:
          quill.format('header', 1)
          break
        case MenuItemType.MediumHeader:
          quill.format('header', 2)
          break
        case MenuItemType.BulletList:
          quill.format('list', 'bullet')
          break
        case MenuItemType.NumberedList:
          quill.format('list', 'ordered')
          break
        case MenuItemType.Mention: {
          const range = quill.getSelection(true)

          quill.insertText(range.index, '@', Quill.sources.USER)
          quill.setSelection(range.index + 1, Quill.sources.USER)
          break
        }
        case MenuItemType.Image: {
          const fileInput = document.getElementById(fileInputId)
          if (fileInput) fileInput.click()
          break
        }
        case MenuItemType.Embed: {
          const range = quill.getSelection(true)

          quill.insertEmbed(range.index, 'embed', {
            handleEmbedPaste,
            handleEmbedInvalid,
            quill,
            placeholder: t('composer:embed.placeholder', 'Paste the link...'),
            themeSettings,
          })
          break
        }

        default:
          break
      }
    },
    [
      hide,
      onMenuItemClick,
      quill,
      fileInputId,
      handleEmbedPaste,
      handleEmbedInvalid,
      themeSettings,
    ],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.addEventListener('scroll', hide)

    return () => {
      window.removeEventListener('scroll', hide)
    }
  }, [hide])

  if (!quill) {
    return null
  }

  const isFilterEmpty = Object.keys(filteredItems).length === 0

  return (
    <Box ref={listViewRef} sx={staticProps.menuContainerStyles} h={8}>
      {children}
      <ListView {...listProps} isOpen>
        <ListViewTrigger style={getTriggerStyle(quill, null, triggerStyles)} />
        <ListViewContent {...listContentProps}>
          {MENU_ITEMS.map((menuItem, idx) => {
            if ('type' in menuItem) {
              const { type, label, icon } = menuItem
              return (
                (isFilterEmpty || filteredItems?.[type]) && (
                  <ListViewItem onClick={onClick(type)} data-type={type}>
                    <ListViewIcon w={4} h={4} as={icon} />
                    <Trans
                      i18nKey={`composer:slashmenu.${type}`}
                      defaults={label}
                    />
                  </ListViewItem>
                )
              )
            }
            const { Component } = menuItem
            // there is no other way to provide a key for this
            // eslint-disable-next-line react/no-array-index-key
            return <Component key={idx} isFilterEmpty={isFilterEmpty} />
          })}
        </ListViewContent>
      </ListView>
    </Box>
  )
}

export default Menu
