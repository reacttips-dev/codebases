import React from 'react'

import { Box, HStack, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

import {
  Card,
  CardDivider,
  Divider,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonProvider,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { PostBody, PostLayoutVariant } from 'containers/Post/components'
import { usePostLink } from 'containers/Post/hooks'

import useTrendingPosts from './hooks/useTrendingPosts'
import TrendingPostsEmptyState from './TrendingPostsEmptyState'

const TrendingPostWrapper = ({ post }) => {
  const postLink = usePostLink(post, true)
  return (
    <NextLink href={postLink} passHref>
      <Link width="100%">
        <PostBody post={post} variant={PostLayoutVariant.LIST} />
      </Link>
    </NextLink>
  )
}

const TrendingPosts = () => {
  const { posts, loading, skip, isEmpty, isInitialLoading } = useTrendingPosts()
  if (skip) return null

  return (
    <SkeletonProvider loading={isInitialLoading}>
      <Card>
        <Box>
          <Text
            data-testid="trending-title"
            textStyle="medium/large"
            color="label.primary"
          >
            <Trans
              i18nKey="explore:trendingPosts.title"
              defaults="Trending posts"
            />
          </Text>
          <Text
            data-testid="trending-description"
            mt={1}
            textStyle="regular/small"
            color="label.secondary"
          >
            <Trans
              i18nKey="explore:trendingPosts.description"
              defaults="Active discussions inside the community"
            />
          </Text>
        </Box>
        <CardDivider my={6} />
        {isEmpty ? (
          <TrendingPostsEmptyState />
        ) : (
          <VStack
            alignItems="flex-start"
            data-testid="trending-posts"
            divider={<Divider />}
            spacing={4}
          >
            {loading &&
              [...new Array(4)].map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Box key={index} width="full">
                  <Skeleton height="20px" width="50%" />
                  <HStack mt="3">
                    <SkeletonCircle size="25px" />
                    <Skeleton height="10px" w="100%" />
                  </HStack>
                  <Skeleton mt="3" height="5px" w="30%" />
                </Box>
              ))}
            {posts.map(post => (
              <TrendingPostWrapper key={post.id} post={post} />
            ))}
          </VStack>
        )}
      </Card>
    </SkeletonProvider>
  )
}

export default TrendingPosts
