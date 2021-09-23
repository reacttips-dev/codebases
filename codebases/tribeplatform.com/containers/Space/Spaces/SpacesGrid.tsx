import React from 'react'

import { Grid } from '@chakra-ui/react'
import NextLink from 'next/link'

import { Space } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  SkeletonProvider,
  Link,
  SpaceCard,
  SpaceCardProps,
} from 'tribe-components'
import { useTribeFeature, Features } from 'tribe-feature-flag'

import useAuthMember from 'hooks/useAuthMember'
import { useResponsive } from 'hooks/useResponsive'

const staticProps = {
  grid: {
    templateColumns: ['100%', 'repeat(auto-fill, 256px)'],
    gap: [0, 4],
    justifyContent: 'start',
    boxShadow: ['low', 'none'],
    mt: [2, 0],
  },
}
export type SpacesGridProps = {
  spaces: Space[]
  loading: boolean
}

const SpaceCardWrapper = ({ space, join, ...rest }: SpaceCardProps) => {
  const { isGuest } = useAuthMember()
  const { authorized: hasJoinSpacePermission } = hasActionPermission(
    space?.authMemberProps?.permissions || [],
    'joinSpace',
  )
  const showJoinButton = join && (hasJoinSpacePermission || isGuest)
  const { isEnabled: isImagePickerDropdownEnabled } = useTribeFeature(
    Features.ImagePickerDropdown,
  )

  return (
    <SpaceCard
      space={space}
      ml="0 !important"
      w="200px"
      h={['auto', 244]}
      showJoinButton={showJoinButton}
      cursor="pointer"
      showImagePickerDropdownOnMobile={isImagePickerDropdownEnabled}
      {...rest}
    />
  )
}

export const SpacesGrid: React.FC<SpacesGridProps> = ({
  loading = false,
  spaces,
}) => {
  const { isPhone } = useResponsive()

  return (
    <SkeletonProvider loading={loading}>
      <Grid {...staticProps.grid}>
        {/* Loading state */}
        {loading &&
          [...Array(3)].map((_, index) => (
            // It's a static array, so we can use indexes as keys
            // eslint-disable-next-line react/no-array-index-key
            <SpaceCard size="sm" key={index} />
          ))}

        {/* Actual cards */}
        {spaces.map(space => (
          /* @TODO - join handler */
          <NextLink
            key={space?.id}
            href="/[space-slug]/[section]"
            as={`/${space.slug}/posts`}
            passHref
          >
            <Link display="inline-block">
              <SpaceCardWrapper
                size="sm"
                isPhone={isPhone}
                key={space.id}
                space={space}
              />
            </Link>
          </NextLink>
        ))}
      </Grid>
    </SkeletonProvider>
  )
}
