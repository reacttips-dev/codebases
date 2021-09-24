import { useCallback } from 'react'

import {
  MutationResult,
  MutationHookOptions,
  useMutation,
  FetchResult,
} from '@apollo/client'

import {
  UPDATE_MEMBER_SPACE_NOTIFICATION_SETTINGS,
  UpdateMemberSpaceNotificationSettingsMutation,
  UpdateMemberSpaceNotificationSettingsMutationVariables,
  MemberNotificationSettingsQuery,
  MemberNotificationSettingsQueryVariables,
  MEMBER_NOTIFICATION_SETTINGS,
} from 'tribe-api'

import useAuthMember from 'hooks/useAuthMember'

import { logger } from 'lib/logger'

export type UseUpdateMemberSpaceNotificationSettings = MutationResult<
  UpdateMemberSpaceNotificationSettingsMutation
> & {
  updateMemberSpaceNotificationSettings: (
    variables: UpdateMemberSpaceNotificationSettingsMutationVariables,
  ) => Promise<
    FetchResult<
      UpdateMemberSpaceNotificationSettingsMutation,
      Record<string, unknown>,
      Record<string, unknown>
    >
  >
}

export const useUpdateMemberSpaceNotificationSettings = (
  options?: MutationHookOptions<
    UpdateMemberSpaceNotificationSettingsMutation,
    UpdateMemberSpaceNotificationSettingsMutationVariables
  >,
): UseUpdateMemberSpaceNotificationSettings => {
  const { authUser } = useAuthMember()

  const [
    updateMemberSpaceNotificationSettingsMutation,
    { called, client, data, error, loading },
  ] = useMutation<
    UpdateMemberSpaceNotificationSettingsMutation,
    UpdateMemberSpaceNotificationSettingsMutationVariables
  >(UPDATE_MEMBER_SPACE_NOTIFICATION_SETTINGS, {
    update: (cache, { data }) => {
      try {
        // Read MemberNotificationSettingsQuery from cache
        const memberNotificationSettingsQuery = cache.readQuery<
          MemberNotificationSettingsQuery,
          MemberNotificationSettingsQueryVariables
        >({
          query: MEMBER_NOTIFICATION_SETTINGS,
          variables: {
            id: authUser?.id,
          },
        })

        const { memberNotificationSettings } =
          memberNotificationSettingsQuery || {}

        if (memberNotificationSettings?.spaces) {
          // Create a copy of MemberNotificationSettingsQuery
          const updatedMemberNotificationSpaces = [
            ...memberNotificationSettings?.spaces,
          ]

          // Find a space to update
          const spaceIndex = updatedMemberNotificationSpaces?.findIndex(
            ({ channel, space }) =>
              space?.id ===
                data?.updateMemberSpaceNotificationSettings?.space?.id &&
              channel === data?.updateMemberSpaceNotificationSettings?.channel,
          )

          // Overwrite space with new data from mutation
          if (spaceIndex && data?.updateMemberSpaceNotificationSettings) {
            updatedMemberNotificationSpaces[spaceIndex] =
              data?.updateMemberSpaceNotificationSettings
          }

          // Write updated query to cache
          cache.writeQuery<MemberNotificationSettingsQuery>({
            query: MEMBER_NOTIFICATION_SETTINGS,
            variables: {
              id: authUser?.id,
            },
            data: {
              memberNotificationSettings: {
                ...memberNotificationSettings,
                spaces: updatedMemberNotificationSpaces,
              },
            },
          })
        }
      } catch (error) {
        logger.warn(
          'UpdateMemberSpaceNotificationSettingsMutation cache update warn => ',
          error,
        )
      }
    },
    ...options,
  })

  const updateMemberSpaceNotificationSettings = useCallback(
    (variables: UpdateMemberSpaceNotificationSettingsMutationVariables) =>
      updateMemberSpaceNotificationSettingsMutation({
        variables,
      }),
    [updateMemberSpaceNotificationSettingsMutation],
  )

  return {
    called,
    client,
    data,
    error,
    loading,
    updateMemberSpaceNotificationSettings,
  }
}
