import { useCallback } from 'react'

import { ApolloCache, useApolloClient } from '@apollo/client'
import { produce } from 'immer'

import {
  GET_NOTIFICATION_SETTINGS,
  GetNotificationSettingsQuery,
  UPDATE_SPACE_NOTIFICATION_SETTINGS,
  UpdateSpaceNotificationSettingsMutation,
  UpdateSpaceNotificationSettingsMutationVariables,
  SpaceQuery,
} from 'tribe-api/graphql'
import {
  MemberSpaceNotificationSettings,
  NotificationChannel,
  UpdateMemberSpaceNotificationSettingsInput,
} from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

type UseUpdateSpaceNotificationSettingsResult = {
  update: (
    channel: NotificationChannel,
    input: UpdateMemberSpaceNotificationSettingsInput,
  ) => void
}

export type UseUpdateSpaceNotificationSettingsProps = {
  memberId?: string
  space: SpaceQuery['space']
}

export const useUpdateSpaceNotificationSettings = ({
  memberId,
  space,
}: UseUpdateSpaceNotificationSettingsProps): UseUpdateSpaceNotificationSettingsResult => {
  const apolloClient = useApolloClient()
  const toast = useToast()
  const { t } = useTranslation()

  const updateSpaceNotificationSettingsCache = (
    cache: ApolloCache<UpdateSpaceNotificationSettingsMutation>,
    data: MemberSpaceNotificationSettings,
  ) => {
    const cachedNotifications = cache.readQuery<GetNotificationSettingsQuery>({
      query: GET_NOTIFICATION_SETTINGS,
    })
    const { network, spaces = [] } =
      cachedNotifications?.getMemberNotificationSettings || {}

    const newSpaceSettings = produce(spaces, draft => {
      const index = draft.findIndex(
        edge =>
          edge.channel === data.channel && edge.space?.id === data.space?.id,
      )
      if (index !== -1) {
        draft[index] = data
      }
    })

    if (network) {
      cache.writeQuery<GetNotificationSettingsQuery>({
        query: GET_NOTIFICATION_SETTINGS,
        data: {
          getMemberNotificationSettings: {
            __typename: 'MemberNotificationSettings',
            network,
            spaces: newSpaceSettings,
          },
        },
      })
    }
  }

  const update = useCallback(
    async (
      channel: NotificationChannel,
      input: UpdateMemberSpaceNotificationSettingsInput,
    ) => {
      const mutateResult = await apolloClient.mutate<
        UpdateSpaceNotificationSettingsMutation,
        UpdateSpaceNotificationSettingsMutationVariables
      >({
        mutation: UPDATE_SPACE_NOTIFICATION_SETTINGS,
        variables: {
          channel,
          input,
          memberId,
          spaceId: space?.id,
        },
        optimisticResponse: {
          updateMemberSpaceNotificationSettings: {
            __typename: 'MemberSpaceNotificationSettings',
            channel,
            isDefault: true,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error - return data type is Maybe<boolean> whereas the response is boolean
            sameAsDefault: true,
            space,
            ...input,
          },
        },
        update: (
          cache: ApolloCache<UpdateSpaceNotificationSettingsMutation>,
          { data },
        ) => {
          try {
            updateSpaceNotificationSettingsCache(
              cache,
              data?.updateMemberSpaceNotificationSettings as MemberSpaceNotificationSettings,
            )
          } catch (e) {
            logger.error(
              'updating GET_NOTIFICATION_SETTINGS for useUpdateSpaceNotificationSettings',
              e,
            )
          }
        },
      })

      if (!mutateResult.errors) {
        toast({
          title: t(
            'settings:account.notifications.saved.title',
            'Your notifications settings is saved.',
          ),
          status: 'success',
        })
      }
    },
    [apolloClient, memberId, space, toast, t],
  )

  return {
    update,
  }
}
