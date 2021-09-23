import { useCallback, useRef } from 'react'

import { useMutation } from '@apollo/client'

import {
  ActionStatus,
  HighlightedTagType,
  UPDATE_SPACE_HIGHLIGHTED_TAGS,
  UpdateSpaceHighlightedTagsMutation,
  UpdateSpaceHighlightedTagsMutationVariables,
  UpdateHighlightedTags,
  SPACE,
  SpaceQuery,
  Space,
} from 'tribe-api'

import { logger } from 'lib/logger'

type UseUpdateSpaceHighlightedTopicsResult = {
  updateSpaceHighlightedTopics: (input: UpdateHighlightedTags) => void
  loading: boolean
}

export type UseUpdateSpaceHighlightedTopicsProps = {
  spaceId: Space['id']
  spaceSlug: Space['slug']
}

export type MappedTopic = {
  type: HighlightedTagType
  text: string
  topicId: string
}

export const useUpdateSpaceHighlightedTopics = ({
  spaceId,
  spaceSlug,
}: UseUpdateSpaceHighlightedTopicsProps): UseUpdateSpaceHighlightedTopicsResult => {
  const inputRef = useRef<UpdateHighlightedTags>({
    highlightedTags: [],
  })
  const [callUpdateSpaceHighlightedTopics, { loading }] = useMutation<
    UpdateSpaceHighlightedTagsMutation,
    UpdateSpaceHighlightedTagsMutationVariables
  >(UPDATE_SPACE_HIGHLIGHTED_TAGS, {
    optimisticResponse: {
      __typename: 'Mutation',
      updateSpaceHighlightedTags: {
        __typename: 'Action',
        status: ActionStatus.SUCCEEDED,
      },
    },
    update: cache => {
      try {
        const data = cache.readQuery<SpaceQuery>({
          query: SPACE,
          variables: {
            id: spaceId,
            slug: spaceSlug,
          },
        })

        if (data?.space) {
          cache.modify({
            id: cache.identify(data.space),
            fields: {
              highlightedTags() {
                const updatedTags = inputRef.current?.highlightedTags?.map(
                  highlightedTag => ({
                    type: 'TOPIC',
                    __typename: 'HighlightedTag',
                    text: highlightedTag.text,
                    tag: {
                      __typename: 'Tag',
                      id: highlightedTag.tagId,
                      title: highlightedTag.text,
                    },
                  }),
                )

                return updatedTags
              },
            },
            optimistic: true,
          })
        }
      } catch (e) {
        logger.error(e)
      }
    },
  })

  const updateSpaceHighlightedTopics = useCallback(
    (input: UpdateHighlightedTags) => {
      inputRef.current = input
      callUpdateSpaceHighlightedTopics({
        variables: {
          input,
          spaceId,
        },
      })
    },
    [callUpdateSpaceHighlightedTopics, spaceId],
  )

  return {
    updateSpaceHighlightedTopics,
    loading,
  }
}
