import React from 'react'

import { MemberFeedEmpty } from 'containers/Member/components/MemberFeedEmpty'
import { useMemberFeed } from 'containers/Member/hooks'
import Feed from 'containers/Space/components/Feed'
import { DEFAULT_POSTS_LIMIT } from 'containers/Space/hooks/useGetPosts'

interface MemberFeedProps {
  memberId: string
}

export const MemberFeed = ({ memberId }: MemberFeedProps) => {
  const {
    posts,
    hasNextPage,
    totalCount,
    loadMore,
    isInitialLoading,
    isEmpty,
  } = useMemberFeed({
    memberId,
    limit: DEFAULT_POSTS_LIMIT,
  })

  if (isEmpty) {
    return <MemberFeedEmpty memberId={memberId} />
  }

  return (
    <Feed
      isLatestFeed
      loading={isInitialLoading}
      posts={posts}
      hasNextPage={hasNextPage}
      onLoadMore={loadMore}
      totalCount={totalCount}
    />
  )
}
