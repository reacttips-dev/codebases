import React from 'react'

import { useStyleConfig } from '@chakra-ui/react'

import { Post } from 'tribe-api/interfaces'
import { Card, CardDivider } from 'tribe-components'

import { ErrorBoundary } from 'components/common'

import {
  PostBody,
  PostLayoutVariant,
  PostCommentsTeaser,
} from 'containers/Post/components'

export interface FeedCardProps {
  post: Post
  comeBack: boolean
  variant?: PostLayoutVariant
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  comeBack,
  variant,
}) => {
  const cardStyles = useStyleConfig('Card')

  return (
    <Card>
      <ErrorBoundary>
        <PostBody
          post={post}
          titleLink
          comeBack={comeBack}
          showSpaceOnUserBar={comeBack}
          variant={variant}
        />

        {variant === PostLayoutVariant.CARDS && post.repliesCount > 0 && (
          <>
            <CardDivider mb={0} />
            <PostCommentsTeaser
              post={post}
              comeBack={comeBack}
              containerCardPadding={Number(cardStyles?.padding)}
            />
          </>
        )}
      </ErrorBoundary>
    </Card>
  )
}
