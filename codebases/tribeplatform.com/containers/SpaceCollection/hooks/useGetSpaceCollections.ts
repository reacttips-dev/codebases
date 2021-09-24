import { useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  GET_SPACE_COLLECTIONS,
  GetSpaceCollectionsQuery,
  GetSpaceCollectionsQueryVariables,
} from 'tribe-api'
import { Collection, SpaceCollection } from 'tribe-api/interfaces'

export type UseSpaceCollectionsResult = QueryResult & {
  spaceCollections: SpaceCollection[]
}

export const useGetSpaceCollections = (
  props?: GetSpaceCollectionsQueryVariables,
): UseSpaceCollectionsResult => {
  const { data, loading, error } = useQuery<
    GetSpaceCollectionsQuery,
    GetSpaceCollectionsQueryVariables
  >(GET_SPACE_COLLECTIONS, {
    variables: {
      ...props,
    },
    fetchPolicy: 'cache-first',
    skip: Boolean(typeof window === 'undefined'),
  })

  const spaceCollections = useMemo(
    () => data?.getGroups?.map(it => it as Collection) || [],
    [data?.getGroups],
  )

  return {
    data,
    error,
    loading,
    spaceCollections,
    isInitialLoading: loading && spaceCollections?.length === 0,
  }
}
