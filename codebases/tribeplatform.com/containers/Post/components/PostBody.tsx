import React, { FC } from 'react'

import { Post } from 'tribe-api/interfaces'

import {
  DiscussionPostBody,
  DiscussionPostBodyCompact,
} from 'containers/Discussion/components'
import {
  QuestionPostBody,
  QuestionPostBodyCompact,
} from 'containers/Question/components'

export enum PostLayoutVariant {
  CARDS = 'CARDS',
  LIST = 'LIST',
}
export interface PostBodyProps {
  post: Post | null
  comeBack?: boolean
  titleLink?: boolean
  showSpaceOnUserBar?: boolean
  defaultExpanded?: boolean
  variant?: PostLayoutVariant
  onReply?: () => void
}

export const PostBody: FC<PostBodyProps> = ({
  post,
  titleLink,
  comeBack,
  showSpaceOnUserBar,
  defaultExpanded = false,
  variant = PostLayoutVariant.CARDS,
  onReply,
}) => {
  if (!post) {
    return null
  }

  if (post?.postType?.name === 'Discussion') {
    if (variant === PostLayoutVariant.LIST) {
      return <DiscussionPostBodyCompact post={post} />
    }

    return (
      <DiscussionPostBody
        post={post}
        titleLink={titleLink}
        comeBack={comeBack}
        showSpaceOnUserBar={showSpaceOnUserBar}
        defaultExpanded={defaultExpanded}
        onReply={onReply}
      />
    )
  }

  if (post?.postType?.name === 'Question') {
    if (variant === PostLayoutVariant.LIST) {
      return <QuestionPostBodyCompact post={post} comeBack={comeBack} />
    }

    return (
      <QuestionPostBody
        post={post}
        titleLink={titleLink}
        comeBack={comeBack}
        defaultExpanded={defaultExpanded}
        onReply={onReply}
      />
    )
  }

  return null
}
