import React from 'react'

import { Box } from '@chakra-ui/react'

import { Heading, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

const SearchEmpty = () => {
  return (
    <Box align="center" mx="auto" my={10}>
      <Heading mb={2} as="h6" size="sm" color="label.primary">
        <Trans i18nKey="common:search.empty.title" defaults="No Results" />
      </Heading>
      <Text color="label.secondary">
        <Trans
          i18nKey="common:search.empty.subtext"
          defaults="You may want to try searching for something else."
        />
      </Text>
    </Box>
  )
}

export default SearchEmpty
