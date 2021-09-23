import { useCallback } from 'react'

import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client'
import { produce } from 'immer'

import {
  GET_NOTIFICATION_SETTINGS,
  GetNotificationSettingsQuery,
  UPDATE_NETWORK_NOTIFICATION_SETTINGS,
  UpdateNetworkNotificationSettingsMutation,
  UpdateNetworkNotificationSettingsMutationVariables,
} from 'tribe-api/graphql'
import {
  NotificationChannel,
  UpdateMemberNetworkNotificationSettingsInput,
  MemberNetworkNotificationSettings,
} from 'tribe-api/interfaces'

import { logger } from 'lib/logger'

type UseUpdateNetworkNotificationSettingsResult = {
  loading: boolean
  update: (
    channel: NotificationChannel,
    input: UpdateMemberNetworkNotificationSettingsInput,
  ) => void
}

export type UseUpdateNetworkNotificationSettingsProps = {
  memberId?: string
  mutationOptions?: MutationHookOptions<
    UpdateNetworkNotificationSettingsMutation,
    UpdateNetworkNotificationSettingsMutationVariables
  >
}

export const useUpdateNetworkNotificationSettings = ({
  memberId,
  mutationOptions,
}: UseUpdateNetworkNotificationSettingsProps = {}): UseUpdateNetworkNotificationSettingsResult => {
  const [callUpdate, { loading }] = useMutation<
    UpdateNetworkNotificationSettingsMutation,
    UpdateNetworkNotificationSettingsMutationVariables
  >(UPDATE_NETWORK_NOTIFICATION_SETTINGS, {
    ...mutationOptions,
  })

  const updateNetworkNotificationSettingsCache = (
    cache: ApolloCache<UpdateNetworkNotificationSettingsMutation>,
    data: MemberNetworkNotificationSettings,
  ) => {
    const cachedNotifications = cache.readQuery<GetNotificationSettingsQuery>({
      query: GET_NOTIFICATION_SETTINGS,
    })
    if (cachedNotifications) {
      const {
        network = [],
        spaces,
      } = cachedNotifications.getMemberNotificationSettings

      const newNetworkSettings = produce(network, draft => {
        const index = draft.findIndex(edge => edge.channel === data.channel)
        if (index !== -1) {
          draft[index] = data
        }
      })

      cache.writeQuery<GetNotificationSettingsQuery>({
        query: GET_NOTIFICATION_SETTINGS,
        data: {
          getMemberNotificationSettings: {
            __typename: 'MemberNotificationSettings',
            network: newNetworkSettings,
            spaces,
          },
        },
      })
    }
  }

  const update = useCallback(
    (
      channel: NotificationChannel,
      input: UpdateMemberNetworkNotificationSettingsInput,
    ) => {
      callUpdate({
        variables: {
          channel,
          input,
          memberId,
        },
        optimisticResponse: {
          updateMemberNetworkNotificationSettings: {
            __typename: 'MemberNetworkNotificationSettings',
            channel,
            isDefault: false,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error - return data type is Maybe<boolean> whereas the response is boolean
            sameAsDefault: false,
            enabled: true,
            mention: null,
            reaction: null,
            ...input,
          },
        },
        update: (
          cache: ApolloCache<UpdateNetworkNotificationSettingsMutation>,
          { data },
        ) => {
          try {
            updateNetworkNotificationSettingsCache(
              cache,
              data?.updateMemberNetworkNotificationSettings as MemberNetworkNotificationSettings,
            )
          } catch (e) {
            logger.error(
              'updating GET_NOTIFICATION_SETTINGS for useUpdateNetworkNotificationSettings',
              e,
            )
          }
        },
      })
    },
    [callUpdate, memberId],
  )

  return {
    loading,
    update,
  }
}
