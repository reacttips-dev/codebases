import React, { useEffect } from 'react'

import { Box } from '@chakra-ui/react'

import { Trans, withTranslation } from 'tribe-translation'

import { FeedLayout, FeedLayoutMain } from 'components/Layout'

import AdminEmptyFeed from 'containers/LatestFeed/EmptyFeed/AdminEmptyFeed'
import GuestEmptyFeed from 'containers/LatestFeed/EmptyFeed/GuestEmptyFeed'
import { useSearch } from 'containers/Search/hooks/useSearchModal'
import Feed from 'containers/Space/components/Feed'
import { DEFAULT_POSTS_LIMIT } from 'containers/Space/hooks/useGetPosts'

import useAuthMember from 'hooks/useAuthMember'
import { useResponsive } from 'hooks/useResponsive'

import useFeed from '../Explore/hooks/useFeed'

const LatestFeed = () => {
  const { isSidebarOpen, mobileHeader } = useResponsive()
  const { isGuest, isNetworkAdmin } = useAuthMember()

  const {
    posts,
    hasNextPage,
    totalCount,
    loadMore,
    isEmpty,
    isInitialLoading,
  } = useFeed(
    {
      limit: DEFAULT_POSTS_LIMIT,
      onlyMemberSpaces: !isGuest,
    },
    // disabling feed on ssr for now
    {
      skip: Boolean(typeof window === 'undefined'),
      fetchPolicy: 'cache-and-network',
    },
  )
  const { isSearchModalOpen } = useSearch()

  useEffect(() => {
    if (isSidebarOpen || isSearchModalOpen) return

    mobileHeader.setRight(null)
  }, [isSearchModalOpen, isSidebarOpen, mobileHeader])

  return (
    <FeedLayout>
      <FeedLayoutMain size={isEmpty ? 'lg' : undefined}>
        {/* eslint-disable-next-line no-nested-ternary */
        isEmpty ? (
          isNetworkAdmin ? (
            <AdminEmptyFeed />
          ) : (
            <GuestEmptyFeed />
          )
        ) : (
          <>
            <Box
              textStyle="bold/2xlarge"
              as="h2"
              color="label.primary"
              data-testid="header-feed"
              mb={2}
              pl={[5, 0]}
            >
              <Trans i18nKey="home:feed.header" defaults="Feed" />
            </Box>

            <Feed
              isLatestFeed
              loading={isInitialLoading}
              posts={posts}
              hasNextPage={hasNextPage}
              onLoadMore={loadMore}
              totalCount={totalCount}
            />
          </>
        )}
      </FeedLayoutMain>
    </FeedLayout>
  )
}

export default withTranslation('home')(LatestFeed)
