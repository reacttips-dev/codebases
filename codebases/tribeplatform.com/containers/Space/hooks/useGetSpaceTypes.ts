import { useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import { GET_SPACE_TYPES, GetSpaceTypesQuery } from 'tribe-api/graphql'
import { SpaceType } from 'tribe-api/interfaces'

type UseGetSpaceTypesResult = QueryResult<GetSpaceTypesQuery> & {
  spaceTypes: SpaceType[]
}

export const useGetSpaceTypes = (limit = 10): UseGetSpaceTypesResult => {
  const { loading, error, data } = useQuery(GET_SPACE_TYPES, {
    variables: {
      limit,
    },
  })

  const spaceTypes = useMemo(
    () => data?.getSpaceTypes?.edges?.map(edge => edge.node) || [],
    [data?.getSpaceTypes],
  )

  return {
    data,
    spaceTypes,
    loading,
    error,
    isInitialLoading: loading && data?.getSpaceTypes === undefined,
  }
}
