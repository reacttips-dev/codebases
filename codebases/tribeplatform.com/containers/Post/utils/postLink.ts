import {
  POST_COMMENTS_SECTION_ID,
  POST_REPLY_SECTION_ID,
} from '../components/PostComments'

export const POST_BACK_LINK_PARAM = 'from'

export const postLinkToPostCommentsLink = (postLink: string): string =>
  `${postLink}#${POST_COMMENTS_SECTION_ID}`

export const postLinkToPostReplyLink = (postLink: string): string =>
  `${postLink}#${POST_REPLY_SECTION_ID}`

export const getPostBackURL = (): string | undefined => {
  // Parse back link param from URL
  const backURL =
    (typeof window !== 'undefined' &&
      new URL(window.location?.href).searchParams.get(POST_BACK_LINK_PARAM)) ||
    undefined

  return backURL
}
