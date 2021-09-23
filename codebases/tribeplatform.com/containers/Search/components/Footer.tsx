import React from 'react'

import { HStack } from '@chakra-ui/react'

import { ModalFooter, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

interface SearchFooterProps {
  count: number
}
const SearchFooter = ({ count }: SearchFooterProps) => {
  return (
    <ModalFooter
      p={0}
      justify="space-between"
      align="center"
      borderWidth={1}
      borderX="none"
      borderBottom="none"
    >
      <HStack py={3} px={5} width="100%" justify="space-between">
        <Text color="label.secondary" fontStyle="medium/small">
          <Trans
            i18nKey="common:search.result"
            defaults="{{ count, ifNumAbbr }} results"
            count={count}
          />
        </Text>
      </HStack>
    </ModalFooter>
  )
}

export default SearchFooter
