import React from 'react'

import { VStack, Box } from '@chakra-ui/react'

import { SpaceQuery } from 'tribe-api'
import { Skeleton, Text } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

export interface AboutWidgetProps {
  space: SpaceQuery['space']
}

export const AboutWidget: React.FC<AboutWidgetProps> = ({ space }) => {
  const { t } = useTranslation()

  if (!space?.description) return null

  return (
    <Box>
      <VStack spacing="3" align="left">
        <Text textStyle="medium/medium">
          {t('space.widgets.about.title', 'About this space')}
        </Text>
        <Skeleton>
          <Text color="label.secondary">{space?.description}</Text>
        </Skeleton>
      </VStack>
    </Box>
  )
}
