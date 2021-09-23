import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

import { VStack, Box } from '@chakra-ui/layout'
import { PopoverProps } from '@chakra-ui/react'
import Quill from 'quill'

import { Media, SearchEntity } from 'tribe-api/interfaces'
import {
  Avatar,
  ListView,
  ListViewContent,
  ListViewItem,
  ListViewTrigger,
  Spinner,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import useDropdownKeyboard from 'containers/Composer/hooks/useDropdownKeyboard'
import useInsertMention from 'containers/Composer/hooks/useInsertMention'
import {
  buildBackendQuery,
  getTriggerStyle,
  getSymbolSearchTerm,
  getMentionMember,
} from 'containers/Composer/utils'
import { useGetSearch } from 'containers/Search/hooks/useGetSearch'

import { useDebouncedCallback } from 'hooks/useDebounce'

import { logger } from 'lib/logger'

import { useOnClickOutside } from 'utils/useOnClickOutside'

import { MENTION_SYMBOL } from '../constants'

interface MentionListProps {
  quill: Quill
}

const staticProps = {
  containerStyles: {
    '& > div': {
      zIndex: 'toast',
    },
  },
  listViewPopoverProps: {
    placement: 'auto-end',
  } as PopoverProps,
}

const MentionList = memo(({ quill }: MentionListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const {
    searchResults,
    getSearchResults,
    searchLoading,
    query: previousQuery,
  } = useGetSearch()

  const hits = searchResults?.search?.hits[0]?.hits

  const haveResults =
    // If the search results are not empty
    !!hits?.length &&
    // And both previous and the new search terms are same.
    // If you have a slow network connection, after
    // request is sent, you can change the search input
    // to something invalid but when the results for the old
    // search term come back, they'll be shown. This makes
    // sure we always show a fresh query's results.
    previousQuery === buildBackendQuery(searchTerm)

  const listContainerRef = useRef<HTMLDivElement>(null)
  const insertMention = useInsertMention()

  const quillId = quill?.container?.id
  const mentionListId = `${quillId}-mention-list`

  const resetSearch = useCallback(() => setSearchTerm(''), [])
  const { onShow, onHide } = useDropdownKeyboard(mentionListId, quill, {
    onEscape: resetSearch,
  })

  useOnClickOutside(listContainerRef, resetSearch)

  const _queryMembers = useDebouncedCallback(({ searchTerm }) => {
    try {
      getSearchResults(buildBackendQuery(searchTerm))
    } catch (e) {
      resetSearch()
      logger.error('<MentionList /> queryMembers', e)
    }
  }, 200)

  const onChange = useCallback(
    (eventName, range, oldRange, source) => {
      // If focused on any element within the editor
      // (otherwise it can be focused on a post's title <Textarea />)
      const isFocusedInEditor = !!document.activeElement?.closest(
        `#${quillId} > .ql-editor`,
      )

      // It's important to allow `silent` selection change.
      // On new line breaks Quill triggers it. If we disable it, it causes
      // a bug when you break a line while having valid mentioning searchTerm
      if (
        (eventName !== 'selection-change' && source !== 'user') ||
        !isFocusedInEditor
      ) {
        return
      }

      // We have to focus to the editor here,
      // because this function gets called
      // on focus-out too.
      quill.focus()

      const newQuery = getSymbolSearchTerm({
        quill,
        symbol: MENTION_SYMBOL,
      })

      setSearchTerm(newQuery)

      // If it's valid search term
      if (newQuery) {
        _queryMembers({ searchTerm: newQuery })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_queryMembers],
  )

  useEffect(() => {
    quill.on('editor-change', onChange)

    return () => {
      quill.off('editor-change', onChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // If list of members will be rendered
    const hasList = haveResults && !searchLoading

    if (hasList) {
      // Bind keyboard events for moving up/down
      onShow()
    } else {
      // Unbind keyboard events for moving up/down
      onHide()
    }

    return () => {
      onHide()
    }
  }, [haveResults, onHide, onShow, searchLoading])

  if (!searchTerm || (!searchLoading && !haveResults)) return null

  return (
    <Box ref={listContainerRef} sx={staticProps.containerStyles}>
      <ListView popoverProps={staticProps.listViewPopoverProps} isOpen>
        <ListViewTrigger style={getTriggerStyle(quill)} />
        <ListViewContent id={mentionListId}>
          {searchLoading ? (
            <VStack justifyContent="center">
              <Spinner size="md" />
            </VStack>
          ) : (
            <>
              {haveResults ? (
                hits?.map((hit: SearchEntity) => {
                  return (
                    <ListViewItem
                      key={hit?.id}
                      display="flex"
                      onClick={() => {
                        const range = quill.getSelection(true)
                        const atSymbolPosition = range.index - searchTerm.length

                        insertMention(
                          quill,
                          getMentionMember(hit),
                          atSymbolPosition,
                        )
                        resetSearch()
                      }}
                    >
                      <Avatar
                        size="sm"
                        src={hit?.media as Media}
                        name={hit?.title}
                        mr={2}
                      />
                      <Text textStyle="regular/medium" ellipsis>
                        {hit?.title}
                      </Text>
                    </ListViewItem>
                  )
                })
              ) : (
                <Text color="label.secondary" textStyle="regular/small">
                  <Trans
                    i18nKey="composer:mention.noResult"
                    defaults="Couldn't find any match"
                  />
                </Text>
              )}
            </>
          )}
        </ListViewContent>
      </ListView>
    </Box>
  )
})

export default MentionList
