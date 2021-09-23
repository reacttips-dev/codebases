import { useCallback } from 'react'

import { useMutation } from '@apollo/client'

import {
  ReadNotificationMutation,
  ReadNotificationMutationVariables,
} from 'tribe-api'
import { READ_NOTIFICATION } from 'tribe-api/graphql/notifications.gql'
import { ActionStatus, Notification } from 'tribe-api/interfaces'

import { logger } from 'lib/logger'

export const useReadNotification = () => {
  const [readNotification] = useMutation<
    ReadNotificationMutation,
    ReadNotificationMutationVariables
  >(READ_NOTIFICATION)

  const updateCache = (cache, notificationEntity: Notification) => {
    cache.modify({
      id: cache.identify(notificationEntity),
      fields: {
        read() {
          return true
        },
      },
      optimistic: true,
    })
  }

  const update = useCallback(
    (notificationEntity: Notification, notificationId: string) => {
      readNotification({
        variables: {
          notificationId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          readNotification: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
        update: cache => {
          try {
            updateCache(cache, notificationEntity)
          } catch (e) {
            logger.error(e)
          }
        },
      })
    },
    [readNotification],
  )

  return update
}
