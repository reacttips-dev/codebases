import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  GET_NOTIFICATION_SETTINGS,
  GetNotificationSettingsQuery,
  GetNotificationSettingsQueryVariables,
} from 'tribe-api/graphql'
import {
  MemberNotificationSettings,
  MemberSpaceNotificationSettings,
  MemberNetworkNotificationSettings,
} from 'tribe-api/interfaces'

export type useGetNotificationSettingsResult = QueryResult<
  GetNotificationSettingsQuery
> & {
  networkSettings: MemberNetworkNotificationSettings[]
  spacesSettings: MemberSpaceNotificationSettings[]
}

export const useGetNotificationSettings = (
  variables?: GetNotificationSettingsQueryVariables,
): useGetNotificationSettingsResult => {
  const { data, loading, error } = useQuery<
    GetNotificationSettingsQuery,
    GetNotificationSettingsQueryVariables
  >(GET_NOTIFICATION_SETTINGS, {
    variables,
    fetchPolicy: 'cache-and-network',
    partialRefetch: true,
    returnPartialData: true,
  })

  const settings = data?.getMemberNotificationSettings as MemberNotificationSettings

  return {
    data,
    networkSettings: settings?.network,
    spacesSettings: settings?.spaces,
    loading,
    error,
    isInitialLoading: loading && data === undefined,
  }
}
