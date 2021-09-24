import React, { useEffect, useCallback, useRef } from 'react'

import { List } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { SearchEntity } from 'tribe-api/interfaces'
import { Text, SIDEBAR_VISIBLE } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { logger } from 'lib/logger'

import useRoveFocus from '../hooks/useRoveFocus'
import { handleSearchClick } from '../utils'
import { useSearchContext } from './Context'
import SearchItem from './SearchItem'

const staticProps = {
  list: {
    pr: 1,
    pl: {
      base: 4,
      [SIDEBAR_VISIBLE]: 3,
    },
    py: {
      base: 0,
      [SIDEBAR_VISIBLE]: 3,
    },
  },
}

const SearchBody = ({ searchResults, inputRef }) => {
  const { hits, totalCount } = searchResults
  const [focus, setFocus] = useRoveFocus(totalCount)

  let index = -1
  const searchResultsRef = useRef<HTMLUListElement>(null)

  const router = useRouter()

  const { onSearchClose } = useSearchContext()

  const handleInputKeyPress = useCallback(
    e => {
      try {
        if (e?.code === 'Enter') {
          // When enter is pressed on the input click the highlighted item.
          if (searchResults?.totalCount > 0 && searchResultsRef?.current) {
            const searchItem = searchResultsRef.current?.querySelector(
              'li.active',
            ) as HTMLElement
            if (searchItem) {
              inputRef.current.blur()
              searchItem.click()
            }
          }
        }
      } catch (e) {
        logger.error('Search enter key failed', e)
      }
    },
    [inputRef, searchResults?.totalCount],
  )

  const handleSearchItemClick = useCallback(
    (searchEntity: SearchEntity): void => {
      handleSearchClick(router, searchEntity)
      onSearchClose()
    },
    [onSearchClose, router],
  )

  // Triggers click for the first active element when input is focused and enter is clicked.
  useEffect(() => {
    const input = inputRef?.current
    if (!input) return
    input.addEventListener('keypress', handleInputKeyPress)
    return () => {
      input.removeEventListener('keypress', handleInputKeyPress)
    }
  }, [handleInputKeyPress, inputRef])

  if (!searchResults) {
    return null
  }

  const getSearchItems = (heading: string, items: SearchEntity[]) =>
    items ? (
      <div key={heading}>
        <Text
          size="md"
          pl={3}
          my={1}
          color="label.secondary"
          textTransform="capitalize"
        >
          <Trans
            i18nKey={`common:search.subheadings.${heading}`}
            defaults={heading ? `${heading}s` : 'Unknown'}
          />
        </Text>
        {items.map(hit => {
          // For arrow navigation.
          index += 1
          return (
            <SearchItem
              key={hit.id}
              setFocus={setFocus}
              index={index}
              isFocused={focus[0] === index}
              isFocusedWithMouse={focus[1]}
              searchEntity={hit}
              handleSearchItemClick={handleSearchItemClick}
            />
          )
        })}
      </div>
    ) : null

  return (
    <List
      styleType="none"
      data-testid="search-list-body"
      {...staticProps.list}
      ref={searchResultsRef}
    >
      {hits.map(hit => getSearchItems(hit?.entityType, hit?.hits))}
    </List>
  )
}

export default SearchBody
