import React, { FC } from 'react'

import { HStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon'
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon'
import TimeLineIcon from 'remixicon-react/TimeLineIcon'

import { Post, PostStatus } from 'tribe-api/interfaces'
import { Icon, Link, Text, UserBar } from 'tribe-components'
import { Trans } from 'tribe-translation'

import MemberBadge from 'containers/Member/components/MemberBadge'
import useDisplayMember from 'containers/Member/hooks/useDisplayMember'

import { useResponsive } from 'hooks/useResponsive'

import { getPostUserInfo } from 'utils/user'

import { usePostLink } from '../hooks/usePostLink'
import { PostHeaderTopics } from './PostHeaderTopics'
import PostOptions from './PostOptions'
import { PostPin } from './PostPin'

dayjs.extend(relativeTime)

interface PostHeaderProps {
  post: Post | null
  comeBack?: boolean
  showSpaceOnUserBar?: boolean
  showPostOptions?: boolean
  showSubtitleLink?: boolean
}

export const PostHeader: FC<PostHeaderProps> = ({
  post,
  comeBack,
  showSpaceOnUserBar,
  showPostOptions = true,
  showSubtitleLink = true,
}) => {
  const authorId = post?.owner?.member?.id || ''
  const router = useRouter()
  const postLink = usePostLink(post, comeBack)
  const topics = post?.tags || []
  const { isMobile } = useResponsive()

  const { userLink } = useDisplayMember(authorId, post?.owner?.role)

  const { owner, createdAt } = post || {}
  const user = owner?.member
  const isSpace = router?.query['space-slug'] != null

  const isPostBlocked = post?.status === PostStatus.BLOCKED
  const isPostDeleted = post?.status === PostStatus.DELETED

  const subtitleItems: (string | JSX.Element)[] = []
  if (
    owner?.member?.tagline &&
    owner.member.tagline.length > 0 &&
    !isPostBlocked
  ) {
    subtitleItems.push(owner?.member?.tagline)
  }
  if (createdAt) {
    if (subtitleItems.length) {
      subtitleItems.push(' • ')
    }

    subtitleItems.push(dayjs(createdAt).fromNow())
    if (isPostBlocked) {
      subtitleItems.push(' • ')
      subtitleItems.push(
        <HStack display="inline-block" spacing={1}>
          <Text color="warning.base" textStyle="medium/small" display="inline">
            <Trans
              i18nKey="post:feedback.pending.title"
              defaults="Pending Review"
            />
          </Text>
          <Icon as={TimeLineIcon} size={16} color="warning.base" />
        </HStack>,
      )
    }
  }

  if (isPostDeleted) {
    subtitleItems.push(' • ')
    subtitleItems.push(
      <HStack display="inline-block" spacing={1}>
        <Text color="danger.base" textStyle="medium/small" display="inline">
          <Trans i18nKey="post:feedback.deleted.title" defaults="Deleted" />
        </Text>
        <Icon as={DeleteBinLineIcon} size={16} color="danger.base" />
      </HStack>,
    )
  }

  const breadcrumbs = [
    <MemberBadge key={user?.id} ml={1} memberRole={user?.role} />,
  ]
  if (showSpaceOnUserBar && post?.space?.name && !post.isAnonymous) {
    breadcrumbs.push(
      <>
        <ArrowRightSLineIcon
          size="16px"
          style={{
            marginTop: 3,
            flexShrink: 0,
          }}
        />
        <NextLink
          passHref
          href={`/${post?.space?.slug}/posts?from=${router.asPath}`}
        >
          <Text as={Link} textStyle="medium/medium" ellipsis>
            {post?.space?.name}
          </Text>
        </NextLink>
      </>,
    )
  }

  const userInfo = post ? getPostUserInfo(user, post?.isAnonymous) : user

  return (
    <HStack justify="space-between" maxW="full">
      <UserBar
        picture={userInfo?.profilePicture}
        title={userInfo?.name}
        customBreadcrumbSplitter={null}
        breadcrumbs={post?.isAnonymous ? null : breadcrumbs}
        subtitle={subtitleItems}
        subtitleLink={showSubtitleLink ? { href: postLink } : null}
        link={post?.isAnonymous ? null : userLink}
      />

      {!isMobile && topics?.length > 0 && post?.space?.slug && (
        <PostHeaderTopics spaceSlug={post?.space?.slug} topics={topics} />
      )}

      {post?.id && (
        <>
          {isSpace && <PostPin post={post} size={6} />}
          {showPostOptions && <PostOptions post={post} />}
        </>
      )}
    </HStack>
  )
}
