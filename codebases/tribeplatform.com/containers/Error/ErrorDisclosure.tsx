import React from 'react'

import { VStack } from '@chakra-ui/react'

import { Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

export interface ErrorDisclosureProps {
  title?: string
  subtitle?: string
}
export const ErrorDisclosure: React.FC<ErrorDisclosureProps> = ({
  title,
  subtitle,
}) => {
  return (
    <VStack spacing="4" pb="2">
      <Text textStyle="semantic/h1" textAlign="center" maxW="md">
        {title || (
          <Trans i18nKey="error:title" defaults="It’s not you, it’s us." />
        )}
      </Text>
      <Text color="tertiary" textAlign="center" maxW="xs">
        {subtitle || (
          <Trans
            i18nKey="error:subtitle"
            defaults="Something’s not working properly. Please try again in few minutes."
          />
        )}
      </Text>
    </VStack>
  )
}
