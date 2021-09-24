import React from 'react'

import { HStack } from '@chakra-ui/react'

import { Features, TribeFeature } from 'tribe-feature-flag'

import LanguageSelector from 'containers/LanguageSelector'

const DrawerFooter = () => {
  return (
    <div>
      <TribeFeature feature={Features.LanguageSelector}>
        <HStack justify="center" pb={6}>
          <LanguageSelector />
        </HStack>
      </TribeFeature>
    </div>
  )
}

export default DrawerFooter
