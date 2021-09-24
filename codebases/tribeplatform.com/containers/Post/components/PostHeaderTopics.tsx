import React, { useContext } from 'react'

import { Box, Flex } from '@chakra-ui/layout'
import NextLink from 'next/link'

import { Space, Tag } from 'tribe-api/interfaces'
import { Tag as TribeTag, TagLabel } from 'tribe-components'
import { formatNumberWithCommas } from 'tribe-translation'

import { TopicsStore } from 'containers/Topic/providers/TopicProvider'

export interface PostHeaderTopics {
  topics: Tag[]
  spaceSlug: Space['slug']
}

export const PostHeaderTopics = ({ topics, spaceSlug }: PostHeaderTopics) => {
  const { showTopicsModal } = useContext(TopicsStore)
  const topicsLength = topics?.length
  if (!topicsLength || topicsLength === 0) return null

  const showModal = () => {
    showTopicsModal(topics, spaceSlug)
  }

  const firstTopic = topics[0]
  return (
    <Flex flex="1" justify="flex-end">
      <NextLink href={`/${spaceSlug}/topics/${firstTopic.id}`}>
        <Box mr="0.5rem">
          <TribeTag maxW="150px" cursor="pointer" variant="solid" size="md">
            <TagLabel isTruncated color="label.secondary">
              {firstTopic.title}
            </TagLabel>
          </TribeTag>
        </Box>
      </NextLink>

      {topicsLength > 1 && (
        <TribeTag
          onClick={showModal}
          cursor="pointer"
          variant="solid"
          size="md"
        >
          <TagLabel color="label.secondary">
            {' '}
            +{formatNumberWithCommas(topicsLength - 1)}
          </TagLabel>
        </TribeTag>
      )}
    </Flex>
  )
}
