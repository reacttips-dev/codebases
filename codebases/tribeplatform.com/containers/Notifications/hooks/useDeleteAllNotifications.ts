import { useCallback } from 'react'

import { useMutation } from '@apollo/client'

import { DELETE_ALL_NOTIFICATIONS } from 'tribe-api/graphql/notifications.gql'

import { logger } from '../../../lib/logger'

export const useDeleteAllNotifications = () => {
  const [deleteNotifications] = useMutation(DELETE_ALL_NOTIFICATIONS, {
    update: cache => {
      try {
        cache.modify({
          fields: {
            getNotifications(existingNotifications) {
              return {
                ...existingNotifications,
                edges: [],
              }
            },
          },
        })
      } catch (err) {
        logger.error(err)
      }
    },
  })

  const update = useCallback(() => {
    return deleteNotifications({
      variables: {
        ids: [],
      },
    })
  }, [deleteNotifications])

  return update
}
