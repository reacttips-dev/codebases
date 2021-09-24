import React, { ReactNode, useMemo } from 'react'

import { Box, VStack } from '@chakra-ui/react'
import Head from 'next/head'

import { Post } from 'tribe-api/interfaces'
import {
  Card,
  EmptyCard,
  NonIdealState,
  SkeletonProvider,
  TableStack,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import PostsInfiniteScroll from 'components/PostsInfiniteScroll'

import { DiscussionPostBody } from 'containers/Discussion/components'
import { PostBody, PostLayoutVariant } from 'containers/Post/components'
import { sortPosts } from 'containers/Post/utils'
import { QuestionPostBodyCompact } from 'containers/Question/components'
import { FeedCard } from 'containers/Space/components/FeedCard'
import { TopicsModalProvider } from 'containers/Topic/providers/TopicProvider'

import { FeedLazyLoadBox } from './FeedLazyLoadBox'
import { FeedTopicsModal } from './FeedTopicsModal'

export interface FeedProps {
  loading?: boolean
  pinnedPosts?: Array<Post>
  posts: Array<Post>
  hasNextPage?: boolean
  totalCount?: number
  isLatestFeed?: boolean
  isPreview?: boolean
  onLoadMore?: () => void
  emptyStateComponent?: ReactNode
  variant?: PostLayoutVariant
}

const Feed = ({
  loading = false,
  pinnedPosts = [],
  posts,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onLoadMore = () => {},
  hasNextPage = false,
  totalCount,
  isLatestFeed = false,
  isPreview = false,
  emptyStateComponent,
  variant = PostLayoutVariant.CARDS,
}: FeedProps) => {
  const isEmpty = !loading && totalCount === 0 && pinnedPosts?.length === 0

  const postFeed = useMemo(() => pinnedPosts.concat(posts.sort(sortPosts)), [
    posts,
    pinnedPosts,
  ])

  if (isEmpty)
    return (
      <Box mt={7}>
        {emptyStateComponent || (
          <NonIdealState
            icon={<EmptyCard />}
            title={
              <Trans i18nKey="space:feed.empty.title" defaults="No posts" />
            }
            description={
              <Trans
                i18nKey="space:feed.empty.subtitle"
                defaults="No posts published here yet."
              />
            }
          />
        )}
      </Box>
    )

  return (
    <>
      {/* We will load this conditionally soon. Have to take into account a lot of lifecycle methods. */}
      <Head>
        <script src="//cdn.iframe.ly/embed.js" async></script>
      </Head>
      <TopicsModalProvider>
        <SkeletonProvider loading={loading}>
          <PostsInfiniteScroll
            dataLength={posts.length}
            next={onLoadMore}
            hasMore={hasNextPage}
          >
            {variant === PostLayoutVariant.CARDS ? (
              <VStack
                data-testid="space-feed"
                spacing={[4, 6]}
                align="stretch"
                pointerEvents={isPreview ? 'none' : 'auto'}
              >
                {loading &&
                  [...Array(3)].map((_, index) => {
                    return (
                      // It's a static array, so we can use indexes as keys
                      // eslint-disable-next-line react/no-array-index-key
                      <Card key={index}>
                        <DiscussionPostBody post={null} />
                      </Card>
                    )
                  })}
                {postFeed.map((post, index) => (
                  <FeedLazyLoadBox
                    key={post.id}
                    id={post.id}
                    index={index}
                    minHeight={180}
                  >
                    <FeedCard
                      post={post}
                      comeBack={isLatestFeed}
                      variant={variant}
                    />
                  </FeedLazyLoadBox>
                ))}
              </VStack>
            ) : (
              <TableStack pointerEvents={isPreview ? 'none' : 'auto'}>
                {loading &&
                  [...Array(3)].map((_, index) => {
                    return (
                      // It's a static array, so we can use indexes as keys
                      // eslint-disable-next-line react/no-array-index-key
                      <Box p={6} key={index}>
                        <QuestionPostBodyCompact post={null} />
                      </Box>
                    )
                  })}
                {postFeed.map(post => (
                  <Box
                    py={6}
                    pl={[4, 6]}
                    pr={{
                      base: 4,
                      sm: 10,
                      xl: 20,
                    }}
                    key={post.id}
                  >
                    <PostBody
                      post={post}
                      titleLink
                      comeBack={isLatestFeed}
                      variant={variant}
                    />
                  </Box>
                ))}
              </TableStack>
            )}
          </PostsInfiniteScroll>
        </SkeletonProvider>
        <FeedTopicsModal />
      </TopicsModalProvider>
    </>
  )
}

export default Feed
