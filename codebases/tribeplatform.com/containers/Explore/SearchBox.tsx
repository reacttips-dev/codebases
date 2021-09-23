import React from 'react'

import { HStack, useToken, VStack } from '@chakra-ui/react'
import SearchLineIcon from 'remixicon-react/SearchLineIcon'

import { Card, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { useSearch } from 'containers/Search/hooks/useSearchModal'

import { useResponsive } from 'hooks/useResponsive'

const SearchSection = () => {
  const [labelSecondary] = useToken('colors', ['label.secondary'])
  const { openSearchModal } = useSearch()
  const { isPhone } = useResponsive()

  return (
    <Card>
      <VStack spacing={5}>
        <Text
          textStyle="semibold/xlarge"
          color="label.primary"
          alignSelf="flex-start"
        >
          <Trans
            i18nKey="explore:search.title"
            defaults="Looking for something?"
          />
        </Text>
        <HStack
          p={3}
          border="1px solid"
          borderColor="border.base"
          borderRadius="base"
          cursor="pointer"
          onClick={openSearchModal}
          data-testid="explore-search-box"
          w="full"
        >
          <SearchLineIcon color={labelSecondary} size="20px" />
          <Text textStyle="regular/medium" color="label.secondary">
            {isPhone ? (
              <Trans
                i18nKey="explore:search.inputText--short"
                defaults="Search the community"
              />
            ) : (
              <Trans
                i18nKey="explore:search.inputText"
                defaults="Search the community to find answers and inspiration"
              />
            )}
          </Text>
        </HStack>
      </VStack>
    </Card>
  )
}

export default SearchSection
