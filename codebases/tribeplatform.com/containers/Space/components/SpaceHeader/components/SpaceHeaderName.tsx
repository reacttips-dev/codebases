import React from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import Lock2FillIcon from 'remixicon-react/Lock2FillIcon'

import { SpaceQuery } from 'tribe-api'
import { Text, Icon } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { useSpace } from 'hooks/space/useSpace'

import { SpaceImagePicker } from '../../SpaceImagePicker'

interface SpaceHeaderNameProps {
  spaceSlug: SpaceQuery['space']['slug'] | undefined
}

export const SpaceHeaderName: React.FC<SpaceHeaderNameProps> = ({
  spaceSlug,
}) => {
  const { space } = useSpace({
    skip: spaceSlug === undefined,
    variables: {
      slug: spaceSlug,
    },
  })

  return (
    <HStack spacing="3" zIndex="second">
      <SpaceImagePicker space={space} />

      <VStack align="left" spacing="1">
        <Text textStyle="semibold/xlarge" lineHeight={6} color="label.primary">
          {space?.name}
        </Text>

        {!space?.name && (
          <Text textStyle="semibold/xlarge" lineHeight={6} color="placeholder">
            <Trans i18nKey="space:header.space" defaults="Space Name" />
          </Text>
        )}

        <HStack>
          <Text
            display="flex"
            alignItems="center"
            textStyle="regular/small"
            color="label.secondary"
          >
            {space?.private && <Icon as={Lock2FillIcon} mr={1} />}
            <Trans i18nKey="space.type.name" defaults="Space" />
          </Text>

          <Text textStyle="regular/small" color="label.secondary">
            {' · '}
          </Text>

          <Text textStyle="regular/small" color="label.secondary">
            <Trans
              i18nKey="space:header.members"
              defaults="{{ membersCount, ifNumAbbr }} members"
              values={{
                membersCount: space?.membersCount || 0,
              }}
            />
          </Text>
        </HStack>
      </VStack>
    </HStack>
  )
}
