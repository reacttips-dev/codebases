import React from 'react'

import { Post, ThemeTokens } from 'tribe-api/interfaces'
import { Link, SkeletonText } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import { ComposerReadonly } from 'containers/Composer/ComposerReadonly'
import { getPostFieldValue } from 'containers/Post/utils'

import { useToggle } from 'hooks/useToggle'

type PostContentProps = { post: Post; defaultExpanded?: boolean }

export const CommentPostContent = ({
  post,
  defaultExpanded,
}: PostContentProps) => {
  const [expanded, toggleExpanded] = useToggle(defaultExpanded)
  const { themeSettings } = useThemeSettings()

  if (post === null) {
    return <SkeletonText noOfLines={4} />
  }

  const { shortContent, embeds, mentions } = post || {}
  const content = getPostFieldValue(post, 'content') || ''

  if (content === '' && !embeds) {
    return null
  }

  if (!expanded) {
    return (
      <>
        <ComposerReadonly
          value={shortContent || ''}
          embeds={embeds}
          mentions={mentions}
          themeSettings={themeSettings as ThemeTokens}
        />
        {post?.hasMoreContent && (
          <Link
            variant="primary"
            alignSelf="flex-start"
            fontSize="md"
            href="#!"
            mt={3}
            onClick={toggleExpanded}
          >
            <Trans i18nKey="post:seeMore" defaults="See more" />
          </Link>
        )}
      </>
    )
  }

  return (
    <>
      <ComposerReadonly
        // eslint-disable-next-line react/no-array-index-key
        key={`post-${post?.id}-content`}
        value={content}
        embeds={embeds}
        mentions={mentions}
        themeSettings={themeSettings as ThemeTokens}
      />
      {post?.hasMoreContent && !defaultExpanded && (
        <Link
          variant="primary"
          alignSelf="flex-start"
          fontSize="md"
          href="#!"
          mt={3}
          onClick={toggleExpanded}
        >
          <Trans i18nKey="post:seeLess" defaults="See less" />
        </Link>
      )}
    </>
  )
}
