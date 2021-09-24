import React, {
  useEffect,
  useRef,
  useCallback,
  FC,
  Dispatch,
  SetStateAction,
  MouseEvent,
} from 'react'

import { ListItem } from '@chakra-ui/react'

import { SearchEntity } from 'tribe-api/interfaces'
import { SIDEBAR_VISIBLE, SearchResult } from 'tribe-components'

import scrollElementIntoView from 'lib/dom/scrollIntoView'

import { getSearchItemLink, getSubTitle } from '../utils'

export interface SearchItem {
  searchEntity: SearchEntity
  isFocused: boolean
  isFocusedWithMouse: boolean
  index: number
  setFocus: Dispatch<SetStateAction<[number, boolean]>>
  handleSearchItemClick: (searchEntity: SearchEntity) => void
}
const SearchItem: FC<SearchItem> = React.memo(
  ({
    searchEntity,
    isFocused,
    isFocusedWithMouse,
    index,
    setFocus,
    handleSearchItemClick,
  }) => {
    const ref = useRef<HTMLLIElement>(null)
    const {
      content,
      entityType,
      media,
      title,
      subtitle,
      by,
      created,
    } = searchEntity

    useEffect(() => {
      const currentElement = ref?.current
      if (!currentElement) return

      if (isFocused) {
        if (!isFocusedWithMouse) scrollElementIntoView(currentElement)

        currentElement.classList.add('active')
      } else {
        currentElement.classList.remove('active')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused])

    const handleSelectWithMouse = useCallback(() => {
      // setting isFocused to that element when it is selected
      setFocus([index, true])
    }, [index, setFocus])

    const handleSelectWithKey = useCallback(() => {
      // setting isFocused to that element when it is selected
      setFocus([index, false])
    }, [index, setFocus])

    const handleClick = useCallback(
      (event: MouseEvent) => {
        // Don't trigger a manual redirect if ctrl is pressed
        if (event.ctrlKey) return

        handleSearchItemClick(searchEntity)
      },
      [handleSearchItemClick, searchEntity],
    )

    const handleSearchKeyPress = useCallback(
      e => {
        if (e.key === 'Enter') {
          handleSearchItemClick(searchEntity)
        }
      },
      [handleSearchItemClick, searchEntity],
    )

    return (
      <ListItem
        as="a"
        href={getSearchItemLink(searchEntity)[1]}
        tabIndex={isFocused ? 0 : -1}
        borderRadius={3}
        _focus={{
          outline: 'none',
        }}
        sx={{
          transition: 'background 0.2s ease',
          '&.active': {
            background: {
              base: 'transparent',
              [SIDEBAR_VISIBLE]: 'bg.secondary',
            },
          },
        }}
        // seems Chakra expects a non-react ref object?
        // Type 'RefObject<HTMLLIElement>' provides no match for the signature '(instance: HTMLLIElement | null): void'
        ref={(ref as unknown) as any}
        onClick={handleClick}
        onKeyPress={handleSearchKeyPress}
        onFocus={handleSelectWithKey}
        onMouseMove={handleSelectWithMouse}
      >
        <SearchResult
          media={media}
          entityType={entityType}
          title={title || 'Untitled'}
          subtext={getSubTitle({
            entityType,
            subtitle: subtitle || '',
            space: searchEntity.in,
            author: by,
            createdAt: created,
            content,
          })}
        />
      </ListItem>
    )
  },
)

export default SearchItem
