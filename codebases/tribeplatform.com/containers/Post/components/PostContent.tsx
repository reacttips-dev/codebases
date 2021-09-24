import React from 'react'

import { Post, ThemeTokens } from 'tribe-api/interfaces'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import { CommentPostContent } from 'containers/Discussion/components/CommentPostContent'
import { DiscussionPostContent } from 'containers/Discussion/components/DiscussionPostContent'
import { QuestionPostContent } from 'containers/Question/components'
import { AnswerPostContent } from 'containers/Question/components/AnswerPostContent'

type PostContentProps = { post?: Post | null; defaultExpanded?: boolean }

export const PostContent = ({ post, defaultExpanded }: PostContentProps) => {
  const { themeSettings } = useThemeSettings()

  if (!post) {
    return null
  }

  switch (post?.postType?.name?.toLowerCase()) {
    case 'discussion':
      return (
        <DiscussionPostContent
          post={post}
          defaultExpanded={defaultExpanded}
          themeSettings={themeSettings as ThemeTokens}
        />
      )
    case 'comment':
      return (
        <CommentPostContent post={post} defaultExpanded={defaultExpanded} />
      )
    case 'question':
      return (
        <QuestionPostContent post={post} defaultExpanded={defaultExpanded} />
      )
    case 'answer':
      return <AnswerPostContent post={post} defaultExpanded={defaultExpanded} />
    default:
      return null
  }
}
