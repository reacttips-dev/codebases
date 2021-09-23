import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  GetAppSpaceSettingsQuery,
  GetAppSpaceSettingsQueryVariables,
  GET_APP_SPACE_SETTINGS,
} from 'tribe-api'

export const DEFAULT_APP_INSTALLATIONS_LIMIT = 10

export type useGetAppSpaceSettingsResult = QueryResult<
  GetAppSpaceSettingsQuery
> & {
  settings?: string | null
}

const useGetAppSpaceSettings = (
  props: GetAppSpaceSettingsQueryVariables,
): useGetAppSpaceSettingsResult => {
  const { data, loading, error } = useQuery<
    GetAppSpaceSettingsQuery,
    GetAppSpaceSettingsQueryVariables
  >(GET_APP_SPACE_SETTINGS, {
    variables: {
      ...props,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: !props.appId || !props.spaceId,
  })

  return {
    data,
    settings: data?.getAppSpaceSettings,
    loading,
    error,
    isInitialLoading: loading && data === undefined,
  }
}

export default useGetAppSpaceSettings
