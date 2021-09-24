import React, { useState, useCallback, useRef, useEffect } from 'react'

import { HStack, Flex, Circle } from '@chakra-ui/react'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import CloseLineIcon from 'remixicon-react/CloseLineIcon'
import SearchLineIcon from 'remixicon-react/SearchLineIcon'

import {
  Icon,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  ModalContentProps,
  SIDEBAR_VISIBLE,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { MOBILE_HEADER_HEIGHT } from 'components/Layout/MobileHeader'

import { useResponsive } from 'hooks/useResponsive'

import { isIOS } from 'utils/ios'

import { useDebounce } from '../../hooks/useDebounce'
import useGetNetwork from '../Network/useGetNetwork'
import SearchBody from './components/Body'
import { SearchContext, SearchContextProps } from './components/Context'
import SearchEmpty from './components/Empty'
import SearchFooter from './components/Footer'
import SearchHeader from './components/Header'
import SearchLoading from './components/Loading'
import { useGetSearch } from './hooks/useGetSearch'
import { useSearch } from './hooks/useSearchModal'

// Helps us show previous result when new results are loading.
const INITIAL_CACHED_RESULTS = {
  search: {
    hits: [],
    totalCount: -1,
  },
}

const staticProps = {
  modalContent: {
    mb: 0,
    mt: {
      // iOS needs more spacing from top
      base: isIOS()
        ? `calc(${MOBILE_HEADER_HEIGHT} * 2)`
        : MOBILE_HEADER_HEIGHT,
      [SIDEBAR_VISIBLE]: 20,
    },
    as: 'div',
    borderRadius: {
      base: 'none',
      [SIDEBAR_VISIBLE]: 'md',
    },
    containerProps: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: {
        base: 'center',
        [SIDEBAR_VISIBLE]: 'flex-start',
      },
    },
    h: 'auto',
    maxH: {
      base: `calc(100vh - ${MOBILE_HEADER_HEIGHT})`,
      [SIDEBAR_VISIBLE]: '30vw',
    },
    flexGrow: {
      base: 1,
      [SIDEBAR_VISIBLE]: 'unset',
    },
  } as ModalContentProps,
  inputWrapper: {
    justify: 'space-between',
    flexGrow: 1,
    bg: {
      base: 'bg.secondary',
      [SIDEBAR_VISIBLE]: 'transparent',
    },
    p: {
      base: 3,
      [SIDEBAR_VISIBLE]: 0,
    },
    borderRadius: {
      base: 'lg',
      [SIDEBAR_VISIBLE]: 0,
    },
  },
}

const Search = () => {
  const { network } = useGetNetwork()
  const [searchText, setSearchText] = useState('')
  const { t } = useTranslation()

  const searchInputRef = useRef<HTMLInputElement>(null)

  const debouncedSearchText = useDebounce(searchText, 500)
  const { isMobile, mobileHeader } = useResponsive()
  const { isSearchModalOpen, closeSearchModal } = useSearch()

  const {
    searchResults,
    searchError,
    getSearchResults,
    searchLoading,
  } = useGetSearch()

  const [cachedResults, setCachedResults] = useState(
    searchResults || INITIAL_CACHED_RESULTS,
  )

  useEffect(() => {
    if (!searchLoading && searchResults) {
      setCachedResults(searchResults)
    }
  }, [searchLoading, searchResults])

  useEffect(() => {
    if (!isSearchModalOpen) return

    mobileHeader.set({
      props: {
        zIndex: 'tooltip',
      },
      left: (
        <IconButton
          icon={<ArrowLeftLineIcon size="20" />}
          aria-label="Back"
          buttonType="secondary"
          backgroundColor="bg.secondary"
          borderRadius="base"
          p={0}
          onClick={closeSearchModal}
        />
      ),
      title: <Trans i18nKey="common:space.sidebar.search" defaults="Search" />,
      right: null,
    })
  }, [isSearchModalOpen, mobileHeader, closeSearchModal])

  useEffect(() => {
    // Make sure we have a value (user has entered something in input)
    if (debouncedSearchText.length > 0) {
      getSearchResults(debouncedSearchText)
    }
  }, [getSearchResults, debouncedSearchText])

  const handleInputReset = useCallback(() => {
    setSearchText('')
    if (searchInputRef?.current) (searchInputRef.current as HTMLElement).focus()
  }, [])

  const handleModalClose = useCallback(() => {
    handleInputReset()
    setCachedResults(INITIAL_CACHED_RESULTS)
    closeSearchModal()
  }, [handleInputReset, closeSearchModal])

  const handleInputChange = useCallback(
    e => {
      const { value } = e.target
      if (value === '') {
        handleInputReset()
      }
      setSearchText(value)
    },
    [handleInputReset],
  )

  const context: SearchContextProps = {
    onSearchClose: handleModalClose,
  }

  if (!isSearchModalOpen) return null

  const ModalInputWrapper = (
    <HStack>
      <HStack {...staticProps.inputWrapper}>
        <HStack spacing={3} flexGrow={1}>
          <Flex align="center" w="20px" h="20px">
            {searchLoading && <SearchLoading />}

            {!searchLoading && (
              <Icon
                color="label.secondary"
                boxSize="5"
                as={SearchLineIcon}
              ></Icon>
            )}
          </Flex>

          <Input
            value={searchText}
            placeholder={t('common:search.placeholder', {
              defaultValue: 'Search...',
              network: network ? network.name : 'the app',
            })}
            autoFocus
            onChange={handleInputChange}
            textStyle="regular/large"
            variant="unstyled"
            ref={searchInputRef}
            data-testid="search-input"
            sx={{
              _placeholder: {
                color: 'label.secondary',
                fontSize: 'lg',
              },
              borderRadius: 'none',
            }}
          />
        </HStack>

        {searchText?.length > 0 && (
          <Circle
            onClick={handleInputReset}
            cursor="pointer"
            size="16px"
            data-testid="search-input-reset"
            bg="label.secondary"
            color="bg.base"
          >
            <Icon as={CloseLineIcon} boxSize="4" />
          </Circle>
        )}
      </HStack>
      {isMobile && (
        <Button
          colorScheme="green"
          variant="outline"
          pr={0}
          ml={0}
          borderWidth={0}
          textStyle="medium/large"
          onClick={closeSearchModal}
        >
          <Trans i18nKey="common:cancel" defaults="Cancel" />
        </Button>
      )}
    </HStack>
  )

  return (
    <SearchContext.Provider value={context}>
      <Modal onClose={handleModalClose} isOpen size="xl">
        <ModalOverlay>
          <ModalContent {...staticProps.modalContent}>
            <SearchHeader
              withBorder={
                !isMobile &&
                searchText?.length > 0 &&
                cachedResults?.search?.totalCount >= 0
              }
            >
              {ModalInputWrapper}
            </SearchHeader>

            {searchText?.length > 0 &&
              cachedResults?.search?.totalCount === 0 && <SearchEmpty />}

            {searchText?.length > 0 && cachedResults?.search?.totalCount > 0 && (
              <>
                <ModalBody p={0} overflowY="auto">
                  <SearchBody
                    inputRef={searchInputRef}
                    searchResults={cachedResults?.search}
                  />
                </ModalBody>

                <SearchFooter count={cachedResults?.search?.totalCount} />
              </>
            )}

            {/* Error state is currently showing empty results. Will be changed soon. */}
            {searchError && <SearchEmpty />}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </SearchContext.Provider>
  )
}

export default Search
