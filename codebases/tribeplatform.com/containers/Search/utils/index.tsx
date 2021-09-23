import i18n from 'i18next'
import { NextRouter } from 'next/router'

import {
  SearchEntityType,
  Space,
  Member,
  Scalars,
  SearchEntity,
} from 'tribe-api/interfaces'
import { getTime } from 'tribe-components'

type GetSubtitleProps = {
  entityType: SearchEntityType
  subtitle?: string
  space?: Space | null
  author?: Member | null
  createdAt: string
  content?: Scalars['String'] | null
}
export const getSubTitle = ({
  entityType,
  subtitle,
  space,
  author,
  createdAt,
  content,
}: GetSubtitleProps): string | undefined => {
  switch (entityType) {
    case SearchEntityType.MEMBER:
      if (content && subtitle) {
        return `@${subtitle} • ${content}`
      }
      if (subtitle) {
        return `@${subtitle}`
      }
      if (content) {
        return content
      }
      break

    case SearchEntityType.SPACE:
      return subtitle

    //  Posts.
    default:
      // eslint-disable-next-line no-case-declarations
      const authorName = author?.name || 'Unknown'
      // eslint-disable-next-line no-case-declarations
      const spaceName = space?.name || 'Untitled'
      // eslint-disable-next-line no-case-declarations
      const time = getTime(createdAt)

      // Forced here to use t instead of Trans as i have to return a string.
      return i18n.t('common:search.post.subtitle', {
        defaultValue: 'Posted on {{spaceName}} {{time}} by {{authorName}}',
        authorName,
        spaceName,
        time,
      })
  }
}

export const getSearchItemLink = ({
  entityType,
  entityId,
  in: space,
}: SearchEntity): [string, string] => {
  switch (entityType) {
    case SearchEntityType.MEMBER:
      return ['/member/[memberId]', `/member/${entityId}`]
    case SearchEntityType.SPACE:
      return ['/[space-slug]/[section]', `/${space?.slug}/posts`]
    // Post.
    default:
      return [
        '/[space-slug]/post/[post-address]',
        `/${space?.slug}/post/${entityId}`,
      ]
  }
}

// Get time is defined under notifications.
export const handleSearchClick = (
  router: NextRouter,
  searchEntity: SearchEntity,
): void => {
  router.push(...getSearchItemLink(searchEntity))
}
