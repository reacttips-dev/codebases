import React from 'react'

import { HStack } from '@chakra-ui/react'

import { Text, Divider } from 'tribe-components'
import { Trans } from 'tribe-translation'

export const UserDivider = () => {
  return (
    <HStack
      direction="row"
      spacing={3}
      align="center"
      style={{ padding: '20px 0px 20px 0px' }}
    >
      <Divider color="stroke" width="calc(100% - 3rem)" />
      <div style={{ whiteSpace: 'nowrap' }}>
        <Text textStyle="medium/medium">
          <Trans
            i18nKey="userimport:manual.invite"
            defaults="Or invite manually"
          />
        </Text>
      </div>
      <Divider color="stroke" width="calc(100% - 3rem)" />
    </HStack>
  )
}
