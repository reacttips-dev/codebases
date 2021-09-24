import { QueryHookOptions, useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import { AppQuery, AppQueryVariables, APP } from 'tribe-api'
import { App } from 'tribe-api/interfaces'
import { useDeepMemo } from 'tribe-components'

export type useAppBySlugResult = QueryResult<AppQuery> & {
  app: App
}

export const useAppBySlug = (
  {
    slug = '',
  }: {
    slug?: string
  },
  options?: QueryHookOptions<AppQuery, AppQueryVariables>,
): useAppBySlugResult => {
  const { data, error, loading } = useQuery<AppQuery, AppQueryVariables>(APP, {
    variables: {
      slug,
    },
    skip: !slug,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    partialRefetch: true,
    returnPartialData: true,
    ...options,
  })

  const app = useDeepMemo(() => data?.app as App, [data])

  return {
    data,
    error,
    loading,
    app,
    isInitialLoading: loading && data === undefined,
  }
}
