import React from 'react'

import { HStack } from '@chakra-ui/react'

import { Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

export const LoadMoreCommentsLink = (props: {
  loadMore: () => void
  previousCommentCount: number
  totalCount: number
  type: 'comment' | 'reply'
}) => (
  <>
    {props.totalCount > 0 && props.previousCommentCount > 0 && (
      <HStack height={6}>
        <Text textStyle="medium/small" color="tertiary">
          <Link color="label.primary" as="span" onClick={props.loadMore}>
            {props.type === 'comment' && (
              <Trans
                i18nKey="post:comments.viewPrevious"
                defaults="View {{ count }} previous comments"
                values={{ count: props.previousCommentCount }}
              />
            )}
            {props.type === 'reply' && (
              <Trans
                i18nKey="post:replies.viewPrevious"
                defaults="View {{ count }} previous replies"
                count={props.previousCommentCount}
              />
            )}
          </Link>{' '}
          of {props.totalCount}
        </Text>
      </HStack>
    )}
  </>
)
