import React from 'react'

import { Box } from '@chakra-ui/react'

import { Text, Card, CardDivider } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useGetPost from 'containers/Post/hooks/useGetPost'

import { getPostLink } from '../utils/utils'
import { CommentThread } from './CommentThread'

interface HighlightedCommentProps {
  postId: string
}

export const HighlightedComment = React.memo(
  ({ postId }: HighlightedCommentProps) => {
    const { post, error } = useGetPost({ postId })

    if (!postId || !post?.space || !post?.repliedTo || error) {
      return null
    }

    return (
      <Card>
        <Text color="label.primary" textStyle="medium/medium">
          <Trans
            i18nKey="post:comment.highlight.title"
            defaults="Highlighted from notification"
          />
        </Text>
        <CardDivider />
        <Box position="relative" mt={5}>
          <CommentThread
            post={post}
            rootPostAddress={getPostLink(
              post.space.slug,
              post.repliedTo.slug,
              post.repliedTo.id,
            )}
            showDivider={false}
          />
        </Box>
      </Card>
    )
  },
)
