import React, { FC } from 'react'

import NextLink from 'next/link'

import { Post } from 'tribe-api/interfaces'
import { Skeleton, Text } from 'tribe-components'

import { usePostLink } from '../hooks/usePostLink'

interface PostTitleProps {
  post: Post | null
  titleLink?: boolean
  comeBack?: boolean
}

const testId = 'post-title'
export const PostTitle: FC<PostTitleProps> = ({
  post,
  titleLink,
  comeBack,
  children,
}) => {
  const postLink = usePostLink(post, comeBack)

  return (
    <Skeleton>
      {!titleLink && (
        <Text
          data-testid={testId}
          textStyle="semantic/h3"
          lineHeight="32px"
          color="label.primary"
        >
          {children}
        </Text>
      )}
      {titleLink && (
        <NextLink href={postLink} passHref>
          <Text
            data-testid={testId}
            as="a"
            textStyle="semantic/h3"
            lineHeight="32px"
            color="label.primary"
          >
            {children}
          </Text>
        </NextLink>
      )}
    </Skeleton>
  )
}
