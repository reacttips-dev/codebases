import {
  Post,
  PostMappingField,
  PostMappingTypeEnum,
} from 'tribe-api/interfaces'

export const decodePostAddress = (
  postAddress: string,
): { id: string; slug: string } => {
  if (typeof postAddress !== 'string') return { id: '', slug: '' }

  const arr = postAddress.split('-')
  return {
    id: arr.pop() ?? arr[0],
    slug: arr.join('-'),
  }
}

export const sortPosts = (a: Post, b: Post) =>
  new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()

export const getPostLink = (
  spaceSlug: string | undefined | null,
  postSlug: string | undefined | null,
  postId: string,
): string => {
  if (postSlug) {
    return `${spaceSlug}/post/${postSlug}-${postId}`
  }
  return `${spaceSlug}/post/${postId}`
}
/**
 * Returns full Post URL
 */
export const getFullPostLink = (
  spaceSlug: string | undefined | null,
  postSlug: string | undefined | null,
  postId: string,
) => {
  if (typeof window === 'undefined') return ''

  return `${window.location.origin}/${getPostLink(spaceSlug, postSlug, postId)}`
}

export const getPostFields = (
  post: Post,
): Record<string, Record<string, any>> =>
  post?.mappingFields?.reduce((acc, curr) => {
    try {
      return {
        ...acc,
        [curr.key]: { ...curr, value: JSON.parse(curr?.value || '""') },
      }
    } catch (e) {
      return {
        ...acc,
        [curr.key]: curr,
      }
    }
  }, {}) ?? {}

export const getPostFieldValue = (post: Post | null, field: string): string => {
  const value =
    post?.mappingFields?.find?.(f => f?.key === field)?.value ?? '""'
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

export const generateMappingFieldForDiscussion = ({
  title,
  content,
}: {
  title?: string
  content?: string
}): PostMappingField[] => {
  const output: PostMappingField[] = []
  if (typeof title === 'string') {
    output.push({
      __typename: 'PostMappingField',
      key: 'title',
      type: PostMappingTypeEnum.TEXT,
      value: JSON.stringify(title),
    })
  }

  if (typeof content === 'string') {
    output.push({
      __typename: 'PostMappingField',
      key: 'content',
      type: PostMappingTypeEnum.HTML,
      value: JSON.stringify(content),
    })
  }

  return output
}

export const generateMappingFieldForComment = ({
  content,
}: {
  content?: string
}): PostMappingField[] => {
  const output: PostMappingField[] = []

  if (typeof content === 'string') {
    output.push({
      __typename: 'PostMappingField',
      key: 'content',
      type: PostMappingTypeEnum.HTML,
      value: JSON.stringify(content),
    })
  }

  return output
}

export const generateMappingFieldForQuestion = ({
  title,
  content,
}: {
  title?: string
  content?: string
}): PostMappingField[] => {
  const output: PostMappingField[] = []
  if (typeof title === 'string') {
    output.push({
      __typename: 'PostMappingField',
      key: 'question',
      type: PostMappingTypeEnum.TEXT,
      value: JSON.stringify(title),
    })
  }

  if (typeof content === 'string') {
    output.push({
      __typename: 'PostMappingField',
      key: 'description',
      type: PostMappingTypeEnum.HTML,
      value: JSON.stringify(content),
    })
  }

  return output
}

export const generateMappingFieldForAnswer = ({
  content,
}: {
  content?: string
}): PostMappingField[] => {
  const output: PostMappingField[] = []
  if (typeof content === 'string') {
    output.push({
      __typename: 'PostMappingField',
      key: 'answer',
      type: PostMappingTypeEnum.HTML,
      value: JSON.stringify(content),
    })
  }

  return output
}
