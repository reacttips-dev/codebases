import { useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  GET_SPACE_COLLECTION,
  GetSpaceCollectionQuery,
  GetSpaceCollectionQueryVariables,
} from 'tribe-api/graphql'
import { Space, SpaceCollection } from 'tribe-api/interfaces'

export type UseGetSpaceCollectionResult = QueryResult & {
  spaceCollection: SpaceCollection | undefined
  spaces: Space[]
  isEmpty?: boolean
}

export const useGetSpaceCollection = (
  spaceCollectionId: string,
): UseGetSpaceCollectionResult => {
  const { loading, error, data } = useQuery<
    GetSpaceCollectionQuery,
    GetSpaceCollectionQueryVariables
  >(GET_SPACE_COLLECTION, {
    variables: {
      groupId: spaceCollectionId,
    },
    skip: !spaceCollectionId,
    fetchPolicy: 'cache-and-network',
    partialRefetch: true,
    returnPartialData: true,
  })

  const group = data?.getGroup as SpaceCollection

  const spaces = useMemo(
    () => group?.spaces?.edges?.map(it => it.node as Space) || [],
    [group],
  )

  return {
    data: null,
    spaceCollection: group,
    spaces,
    loading,
    error,
    isInitialLoading: loading && data?.getGroup === undefined,
    isEmpty: !loading && group?.spaces?.totalCount === 0,
  }
}
