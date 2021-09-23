import React, { useEffect } from 'react'

import { Box, Flex, Spacer } from '@chakra-ui/react'

import { Post, SpaceQuery } from 'tribe-api'
import { Heading, NonIdealState, Text } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { QuestionComposerButton } from 'containers/Question/components/QuestionComposerButton'
import Feed from 'containers/Space/components/Feed'
import useGetPosts, {
  DEFAULT_POSTS_LIMIT,
} from 'containers/Space/hooks/useGetPosts'
import useLazyGetTopicPosts from 'containers/Space/hooks/useLazyGetTopicPosts'
import useSpaceQnASettings from 'containers/Space/hooks/useSpaceQnASettings'

export interface QuestionFeedProps {
  space?: SpaceQuery['space']
  filteredTopicId: string | null
}

export const QuestionFeed = ({ space, filteredTopicId }: QuestionFeedProps) => {
  const {
    posts,
    hasNextPage,
    loadMore,
    totalCount,
    isInitialLoading,
    isEmpty,
  } = useGetPosts({
    spaceIds: space?.id ? [space?.id] : [],
    limit: DEFAULT_POSTS_LIMIT,
    excludePins: true,
  })

  const {
    posts: filteredPosts,
    hasNextPage: filteredHasNextPage,
    loadMore: filteredLoadMore,
    getTopicPosts,
    totalCount: filteredTotalCount,
    isInitialLoading: filteredIsInitialLoading,
  } = useLazyGetTopicPosts({
    spaceId: space?.id || '',
    limit: DEFAULT_POSTS_LIMIT,
    topicId: '',
  })

  useEffect(() => {
    if (filteredTopicId) {
      getTopicPosts(filteredTopicId)
    }
  }, [filteredTopicId])

  const { t } = useTranslation()
  const { qnaLayout } = useSpaceQnASettings(space)

  if (isEmpty)
    return (
      <NonIdealState
        title={t('space:questions.empty.title', 'No questions here')}
        description={t(
          'space:questions.empty.subtitle',
          'Ask a question or search for answers across all Triberians.',
        )}
        minHeight="30vh"
      >
        <QuestionComposerButton space={space} />
      </NonIdealState>
    )

  return (
    <>
      <Flex pb={5}>
        {/* TODO - Add filter dropdowns */}
        <Spacer />
        <QuestionComposerButton space={space} />
      </Flex>

      {!filteredTopicId && (
        <Feed
          onLoadMore={loadMore}
          loading={isInitialLoading}
          pinnedPosts={(space?.pinnedPosts as Post[]) || []}
          posts={posts}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          variant={qnaLayout}
        />
      )}

      {filteredTopicId && (
        <Feed
          onLoadMore={filteredLoadMore}
          loading={filteredIsInitialLoading}
          posts={filteredPosts || []}
          totalCount={filteredTotalCount}
          hasNextPage={filteredHasNextPage}
          variant={qnaLayout}
        />
      )}

      {filteredTopicId &&
        !filteredIsInitialLoading &&
        filteredPosts?.length === 0 && (
          <Box textAlign="center">
            <Heading as="h3" size="lg" mb="2">
              <Trans
                i18nKey="space:highlightedTags.empty.title"
                defaults="No discussions found."
              />
            </Heading>
            <Text textStyle="regular/medium">
              <Trans
                i18nKey="space:highlightedTags.empty.description"
                defaults="There were no discussions found with this tag."
              />
            </Text>
          </Box>
        )}
    </>
  )
}
