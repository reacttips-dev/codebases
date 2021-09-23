import { QueryHookOptions, useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import { SPACE, SpaceQuery, SpaceQueryVariables } from 'tribe-api/graphql'

export type UseSpace = QueryResult<SpaceQuery> & {
  space: SpaceQuery['space']
}

export const useSpace = (
  options: QueryHookOptions<SpaceQuery, SpaceQueryVariables>,
): UseSpace => {
  const { data, error, loading } = useQuery<SpaceQuery, SpaceQueryVariables>(
    SPACE,
    {
      fetchPolicy: 'cache-first',
      returnPartialData: true,
      ...options,
    },
  )

  const space = data?.space as SpaceQuery['space']

  return {
    data,
    error,
    isInitialLoading: loading && data === undefined,
    loading,
    space,
  }
}
