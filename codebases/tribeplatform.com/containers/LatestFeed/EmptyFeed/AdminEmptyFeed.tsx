import React from 'react'

import { Box } from '@chakra-ui/layout'

import { Trans } from 'tribe-translation'

import EmptyFeedAddSpace from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedAddSpace'
import EmptyFeedMakeFirstPost from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedMakeFirstPost'
import EmptyFeedNewCollection from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedNewCollection'
import EmptyFeedPageTitle from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedPageTitle'
import EmptyFeedSubtitle from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedSubtitle'

import useAuthMember from 'hooks/useAuthMember'

const AdminEmptyFeed = () => {
  const { authUser } = useAuthMember()

  return (
    <Box px={{ base: 4, sm: 0 }}>
      <EmptyFeedPageTitle>
        <Trans
          i18nKey="home:feed.emptyFeed.adminTitle"
          defaults="Hi {{name}}"
          values={{ name: authUser?.name }}
        />
      </EmptyFeedPageTitle>

      <EmptyFeedSubtitle mb={14}>
        <Trans
          i18nKey="home:feed.emptyFeed.subtitle"
          defaults="Let’s get started with your Tribe!"
        />
      </EmptyFeedSubtitle>

      <EmptyFeedNewCollection />

      <EmptyFeedAddSpace />

      <EmptyFeedMakeFirstPost />
    </Box>
  )
}

export default AdminEmptyFeed
