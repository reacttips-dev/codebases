import { useCallback, useState } from 'react'

import { Member, Post } from 'tribe-api/interfaces'

import {
  DEFAULT_COMMENT_LIMIT,
  LOAD_MORE_COMMENT_LIMIT,
  useGetPostComments,
  UseGetPostCommentsResult,
} from 'containers/Post/hooks/useGetPostComments'

import Truthy from 'utils/truthy'

type UsePreloadedPostCommentsResult = UseGetPostCommentsResult & {
  preloadedComments: Post[]
  preloadedAuthors: Member[]
  previousCommentCount: number
}

export type UsePreloadedPostCommentsProps = {
  postId: string
}

export const usePreloadedPostComments = ({
  postId,
}: UsePreloadedPostCommentsProps): UsePreloadedPostCommentsResult => {
  const result = useGetPostComments({ postId })

  const [displayedCommentCount, setDisplayedCommentCount] = useState(
    DEFAULT_COMMENT_LIMIT,
  )

  const resultTotalCount = result?.totalCount ? result.totalCount : 0
  const hasNextPage =
    result?.hasNextPage || resultTotalCount > displayedCommentCount

  const loadMore = useCallback(() => {
    if (result?.hasNextPage) {
      result?.loadMore()
      setDisplayedCommentCount(displayedCommentCount + LOAD_MORE_COMMENT_LIMIT)
    } else {
      setDisplayedCommentCount(resultTotalCount)
    }
  }, [result?.hasNextPage, result?.loadMore])

  const orderedComments = result?.comments.slice().reverse()
  const displayedComments = orderedComments.splice(-displayedCommentCount)
  const preloadedComments = orderedComments.slice()

  return {
    ...result,
    comments: displayedComments,
    preloadedComments,
    preloadedAuthors: Array.from(
      new Set(preloadedComments.map(comment => comment.owner?.member)),
    ).filter(Truthy),
    previousCommentCount:
      Math.min(
        resultTotalCount - displayedCommentCount,
        LOAD_MORE_COMMENT_LIMIT,
      ) || 0,
    hasNextPage,
    loadMore,
  }
}
