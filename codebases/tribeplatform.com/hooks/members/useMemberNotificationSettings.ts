import { QueryHookOptions, useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  MEMBER_NOTIFICATION_SETTINGS,
  MemberNotificationSettingsQuery,
  MemberNotificationSettingsQueryVariables,
} from 'tribe-api'

export type UseMemberNotificationSettings = QueryResult<
  MemberNotificationSettingsQuery
> & {
  memberNotificationSettings: MemberNotificationSettingsQuery['memberNotificationSettings']
}

export const useMemberNotificationSettings = (
  options: QueryHookOptions<
    MemberNotificationSettingsQuery,
    MemberNotificationSettingsQueryVariables
  >,
): UseMemberNotificationSettings => {
  const { data, error, loading } = useQuery<
    MemberNotificationSettingsQuery,
    MemberNotificationSettingsQueryVariables
  >(MEMBER_NOTIFICATION_SETTINGS, {
    notifyOnNetworkStatusChange: true,
    returnPartialData: true,
    ...options,
  })

  const memberNotificationSettings = data?.memberNotificationSettings as MemberNotificationSettingsQuery['memberNotificationSettings']

  return {
    data,
    error,
    isInitialLoading: loading && data === undefined,
    loading,
    memberNotificationSettings,
  }
}
