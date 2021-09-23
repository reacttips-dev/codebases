import { useCallback, useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import { GET_NOTIFICATIONS } from 'tribe-api/graphql/notifications.gql'
import {
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
} from 'tribe-api/graphql/notifications.gql.generated'
import { Notification } from 'tribe-api/interfaces'

export const DEFAULT_NOTIFICATIONS_LIMIT = 20

export type UseGetNotificationsResult = PaginatedQueryResult<
  GetNotificationsQuery
> & {
  notifications: Notification[]
}

export const useGetNotifications = ({
  limit,
  after,
}: GetNotificationsQueryVariables): UseGetNotificationsResult => {
  const { data, loading, error, fetchMore } = useQuery<
    GetNotificationsQuery,
    GetNotificationsQueryVariables
  >(GET_NOTIFICATIONS, {
    variables: {
      limit,
      after,
    },
    fetchPolicy: 'cache-and-network',
  })

  const hasNextPage = data?.getNotifications?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: data?.getNotifications?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.getNotifications, fetchMore])

  const notifications = useMemo(
    () =>
      data?.getNotifications?.edges?.map(edge => edge.node as Notification) ||
      [],
    [data?.getNotifications],
  )

  return {
    loading,
    error,
    data,
    notifications,
    totalCount: data?.getNotifications?.totalCount,
    hasNextPage,
    loadMore,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.getNotifications?.totalCount === 0,
  }
}
