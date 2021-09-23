import { useCallback } from 'react'

import { useMutation } from '@apollo/client'

import {
  GET_NOTIFICATIONS,
  READ_ALL_NOTIFICATIONS,
} from 'tribe-api/graphql/notifications.gql'
import { GetNotificationsQuery } from 'tribe-api/graphql/notifications.gql.generated'
import { ActionStatus } from 'tribe-api/interfaces'

import { logger } from '../../../lib/logger'

export const useReadAllNotifications = () => {
  const [readNotifications] = useMutation(READ_ALL_NOTIFICATIONS)

  const update = useCallback(() => {
    readNotifications({
      variables: {
        ids: [],
      },
      update: (cache, { data }) => {
        try {
          const cachedNotifications = cache.readQuery<GetNotificationsQuery>({
            query: GET_NOTIFICATIONS,
          })
          if (cachedNotifications) {
            const actionResponse = data?.readNotifications?.status
            const hasActionSucceeded = actionResponse === ActionStatus.SUCCEEDED
            const { edges = [] } = cachedNotifications.getNotifications
            const updatedEdges = edges?.map(notificationEdge => {
              // Marks all the notifications as read.
              return {
                ...notificationEdge,
                node: {
                  ...notificationEdge.node,
                  read: hasActionSucceeded ? true : notificationEdge.node.read,
                },
              }
            })
            cache.writeQuery<GetNotificationsQuery>({
              query: GET_NOTIFICATIONS,
              data: {
                ...cachedNotifications,
                getNotifications: {
                  ...cachedNotifications.getNotifications,
                  edges: updatedEdges,
                },
              },
            })
          }
        } catch (err) {
          logger.error(err)
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        readNotifications: {
          __typename: 'Action',
          status: ActionStatus.SUCCEEDED,
        },
      },
    })
  }, [readNotifications])

  return update
}
