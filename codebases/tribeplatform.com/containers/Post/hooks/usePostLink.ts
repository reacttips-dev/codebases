import { useRouter } from 'next/router'

import { Post } from 'tribe-api/interfaces'

import { getPostLink } from '../utils'
import { POST_BACK_LINK_PARAM } from '../utils/postLink'

export const usePostLink = (post?: Post | null, comeBack?: boolean): string => {
  const router = useRouter()
  if (!post?.space) return '/404'
  const link = getPostLink(post?.space?.slug, post?.slug, post?.id)
  return `/${link}${
    comeBack ? `?${POST_BACK_LINK_PARAM}=${router.asPath}` : ''
  }`
}
