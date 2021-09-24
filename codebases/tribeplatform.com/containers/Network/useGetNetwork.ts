import { QueryHookOptions, useQuery } from '@apollo/client'

import {
  GetNetworkQuery,
  GetNetworkQueryVariables,
  GetRolesQuery,
  GET_NETWORK_INFO,
  GET_ROLES,
} from 'tribe-api/graphql'
import { Network } from 'tribe-api/interfaces'

import { QueryResult } from '../../@types'

export type UseGetNetworkResult = QueryResult<GetNetworkQuery> & {
  network: Network
}
const useGetNetwork = (
  variables: GetNetworkQueryVariables = {
    withDefaultSpaces: false,
    withRoles: true,
    anonymize: false,
  },
  options?: QueryHookOptions,
): UseGetNetworkResult => {
  const { data, error, loading, client } = useQuery<
    GetNetworkQuery,
    GetNetworkQueryVariables
  >(GET_NETWORK_INFO, {
    variables,
    ...options,
  })

  const network = data?.getNetwork as Network
  if (network?.roles && network.roles.length > 0) {
    client.writeQuery<GetRolesQuery>({
      query: GET_ROLES,
      data: { getRoles: network?.roles },
    })
  }

  return {
    data,
    network,
    error,
    loading,
    isInitialLoading: loading && data === undefined,
  }
}

export default useGetNetwork
