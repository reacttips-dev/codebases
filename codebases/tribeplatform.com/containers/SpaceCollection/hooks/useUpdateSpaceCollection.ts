import { useCallback } from 'react'

import { gql, useMutation } from '@apollo/client'

import {
  ActionStatus,
  SpaceCollection,
  UPDATE_SPACE_COLLECTION,
  UpdateCollectionInput,
  UpdateSpaceCollectionMutation,
  UpdateSpaceCollectionMutationVariables,
} from 'tribe-api'

import { logger } from 'lib/logger'

type UseUpdateSpaceCollectionResult = {
  update: (variables: UpdateCollectionInput) => void
}

export type UseUpdateSpaceCollectionProps = {
  spaceCollection?: SpaceCollection
}

export const useUpdateSpaceCollection = ({
  spaceCollection,
}: UseUpdateSpaceCollectionProps): UseUpdateSpaceCollectionResult => {
  const [callUpdate] = useMutation<
    UpdateSpaceCollectionMutation,
    UpdateSpaceCollectionMutationVariables
  >(UPDATE_SPACE_COLLECTION)

  const onUpdate = (input, spaceCollection?: SpaceCollection) => cache => {
    try {
      cache.writeFragment({
        id: cache.identify(spaceCollection),
        fragment: gql`
          fragment _ on Collection {
            name
            description
          }
        `,
        data: {
          ...spaceCollection,
          ...input,
        },
      })
    } catch (e) {
      logger.error('error updating cache for useUpdateSpaceCollection', e)
    }
  }

  const update = useCallback(
    (input: UpdateCollectionInput) =>
      callUpdate({
        variables: {
          input,
          groupId: spaceCollection?.id || '',
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateGroup: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
        update: onUpdate(input, spaceCollection),
      }),
    [callUpdate, spaceCollection],
  )

  return {
    update,
  }
}
