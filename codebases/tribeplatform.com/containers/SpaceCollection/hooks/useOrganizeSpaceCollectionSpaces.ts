import { useCallback } from 'react'

import { useMutation } from '@apollo/client'

import {
  ActionStatus,
  ORGANIZE_SPACE_COLLECTION_SPACES,
  OrganizeSpaceCollectionSpacesMutation,
  OrganizeSpaceCollectionSpacesMutationVariables,
  SpaceCollection,
} from 'tribe-api'

type UseOrganizeSpaceCollectionSpacesResult = {
  organize: (spaceIds: string[]) => void
}

export type UseOrganizeSpaceCollectionSpacesProps = {
  spaceCollection?: SpaceCollection
}

export const useOrganizeSpaceCollectionSpaces = ({
  spaceCollection,
}: UseOrganizeSpaceCollectionSpacesProps): UseOrganizeSpaceCollectionSpacesResult => {
  const [callUpdate] = useMutation<
    OrganizeSpaceCollectionSpacesMutation,
    OrganizeSpaceCollectionSpacesMutationVariables
  >(ORGANIZE_SPACE_COLLECTION_SPACES)

  const organize = useCallback(
    (spaceIds: string[]) =>
      callUpdate({
        variables: {
          spaceIds,
          groupId: spaceCollection?.id || '',
        },
        optimisticResponse: {
          __typename: 'Mutation',
          organizeGroupSpaces: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
      }),
    [callUpdate, spaceCollection],
  )

  return {
    organize,
  }
}
