import React from 'react'

import { HStack } from '@chakra-ui/react'

import {
  SpaceCardSkeleton,
  useResponsive,
  SpaceCardSkeletonProps,
} from 'tribe-components'

interface EmptyFeedSpacesProps {
  mb?: number | string
  size?: SpaceCardSkeletonProps['size']
}

const EmptyFeedSpaces: React.FC<EmptyFeedSpacesProps> = ({
  mb = 14,
  size = 'lg',
}) => {
  const { isPhone } = useResponsive()

  return (
    <HStack spacing={4} mb={mb}>
      <SpaceCardSkeleton
        isPhone={isPhone}
        space={{
          image: {
            __typename: 'Emoji',
            id: '1',
            text: 'microphone',
          },
          membersCount: 630,
          name: 'Feature requests',
        }}
        size={size}
      />

      <SpaceCardSkeleton
        isPhone={isPhone}
        display={{ base: 'none', sm: 'none', lg: 'flex' }}
        space={{
          image: {
            __typename: 'Emoji',
            id: '1',
            text: 'wave',
          },
          membersCount: 2900,
          name: 'Introduce yourself',
        }}
        size={size}
      />

      <SpaceCardSkeleton
        isPhone={isPhone}
        display={{ base: 'none', sm: 'none', lg: 'none', xl: 'flex' }}
        space={{
          image: {
            __typename: 'Emoji',
            id: '1',
            text: 'earth_americas',
          },
          membersCount: 1600,
          name: 'Announcements',
        }}
        size={size}
      />
    </HStack>
  )
}

export default EmptyFeedSpaces
