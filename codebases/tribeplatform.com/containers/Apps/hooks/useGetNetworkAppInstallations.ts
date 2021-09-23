import { useCallback } from 'react'

import { useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GetNetworkAppInstallationsQuery,
  GetNetworkAppInstallationsQueryVariables,
  GET_NETWORK_APP_INSTALLATIONS,
} from 'tribe-api/graphql'
import { AppInstallation } from 'tribe-api/interfaces'
import { useDeepMemo } from 'tribe-components'

export const DEFAULT_APP_INSTALLATIONS_LIMIT = 10

export type useGetNetworkAppInstallationsResult = PaginatedQueryResult<
  GetNetworkAppInstallationsQuery
> & {
  appInstallations: AppInstallation[]
}

const useGetNetworkAppInstallations = (
  props?: GetNetworkAppInstallationsQueryVariables,
): useGetNetworkAppInstallationsResult => {
  const { limit = DEFAULT_APP_INSTALLATIONS_LIMIT } = props || {}
  const { data, loading = true, error, fetchMore } = useQuery<
    GetNetworkAppInstallationsQuery,
    GetNetworkAppInstallationsQueryVariables
  >(GET_NETWORK_APP_INSTALLATIONS, {
    variables: {
      limit,
      ...props,
    },
    fetchPolicy: 'cache-and-network',
    // https://github.com/apollographql/apollo-client/issues/7436
    nextFetchPolicy: 'cache-first',
  })

  const hasNextPage =
    data?.getNetworkAppInstallations?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      fetchMore({
        variables: {
          after: data?.getNetworkAppInstallations?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.getNetworkAppInstallations, fetchMore])

  const appInstallations = useDeepMemo(
    () =>
      data?.getNetworkAppInstallations?.edges
        ?.map(edge => edge.node as AppInstallation)
        .filter(Boolean) || [],
    [data],
  )

  return {
    data,
    appInstallations,
    loading,
    error,
    totalCount: data?.getNetworkAppInstallations?.totalCount,
    hasNextPage,
    loadMore,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.getNetworkAppInstallations?.totalCount === 0,
  }
}

export default useGetNetworkAppInstallations
