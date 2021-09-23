import { useCallback } from 'react'

import { useMutation } from '@apollo/client'

import {
  CLEAR_NOTIFICATIONS_COUNT,
  ClearNotificationsCountMutation,
  ClearNotificationsCountMutationVariables,
  GET_NOTIFICATIONS_COUNT,
} from 'tribe-api/graphql'

import { logger } from 'lib/logger'

export const useClearNotificationsCount = () => {
  const [clearNotificationCount] = useMutation<
    ClearNotificationsCountMutation,
    ClearNotificationsCountMutationVariables
  >(CLEAR_NOTIFICATIONS_COUNT)

  const updateCache = cache => {
    cache.writeQuery({
      query: GET_NOTIFICATIONS_COUNT,
      data: {
        getNotificationsCount: {
          new: 0,
        },
      },
    })
  }

  const update = useCallback(() => {
    clearNotificationCount({
      update: cache => {
        try {
          updateCache(cache)
        } catch (e) {
          logger.error(e)
        }
      },
    })
  }, [clearNotificationCount])

  return update
}
