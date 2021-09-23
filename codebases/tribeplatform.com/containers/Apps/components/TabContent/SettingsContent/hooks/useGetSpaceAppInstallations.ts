import { useCallback } from 'react'

import { useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GetSpaceAppInstallationsQuery,
  GetSpaceAppInstallationsQueryVariables,
  GET_SPACE_APP_INSTALLATIONS,
} from 'tribe-api'
import { AppInstallation } from 'tribe-api/interfaces'

export const DEFAULT_APP_INSTALLATIONS_LIMIT = 10

export type useGetSpaceAppInstallationsResult = PaginatedQueryResult<
  GetSpaceAppInstallationsQuery
> & {
  appInstallations: AppInstallation[]
}

const useGetSpaceAppInstallations = (
  props: GetSpaceAppInstallationsQueryVariables,
): useGetSpaceAppInstallationsResult => {
  const { limit = DEFAULT_APP_INSTALLATIONS_LIMIT, spaceId } = props || {}
  const { data, loading, error, fetchMore } = useQuery<
    GetSpaceAppInstallationsQuery,
    GetSpaceAppInstallationsQueryVariables
  >(GET_SPACE_APP_INSTALLATIONS, {
    variables: {
      limit,
      spaceId,
    },
    fetchPolicy: 'cache-and-network',
    skip: !spaceId,
  })

  const hasNextPage =
    data?.getSpaceAppInstallations?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      fetchMore({
        variables: {
          after: data?.getSpaceAppInstallations?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.getSpaceAppInstallations, fetchMore])

  return {
    data,
    appInstallations:
      data?.getSpaceAppInstallations?.edges?.map(
        edge => edge.node as AppInstallation,
      ) || [],
    loading,
    error,
    totalCount: data?.getSpaceAppInstallations?.totalCount,
    hasNextPage,
    loadMore,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.getSpaceAppInstallations?.totalCount === 0,
  }
}

export default useGetSpaceAppInstallations
