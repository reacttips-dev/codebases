import { useCallback } from 'react'

import { MutationHookOptions, useMutation } from '@apollo/client'
import merge from 'lodash.merge'

import {
  GetTokensQuery,
  GET_TOKENS,
  GET_NETWORK_INFO,
  UPDATE_NETWORK_INFO,
  UpdateNetworkMutation,
  UpdateNetworkMutationVariables,
} from 'tribe-api'

import useGetNetwork from 'containers/Network/useGetNetwork'

export default function useUpdateNetwork(props?: {
  mutationOptions?: MutationHookOptions<
    UpdateNetworkMutation,
    UpdateNetworkMutationVariables
  >
}) {
  const { mutationOptions } = props || {}
  const { network } = useGetNetwork()
  const [updateNetworkInfo, { loading, error }] = useMutation<
    UpdateNetworkMutation,
    UpdateNetworkMutationVariables
  >(UPDATE_NETWORK_INFO, {
    update: (cache, { data }) => {
      // Update cache after the mutation
      cache.writeQuery({
        query: GET_NETWORK_INFO,
        data: { getNetwork: { ...data?.updateNetwork } },
      })

      // Extract everything from data
      const { id, logo, name, status, membership, domain, visibility } =
        data?.updateNetwork || {}

      // Read community's old query result
      const oldGetTokensQuery = cache.readQuery({
        query: GET_TOKENS,
      }) as GetTokensQuery

      // Update it with new data
      cache.writeQuery({
        query: GET_TOKENS,
        data: {
          getTokens: {
            ...oldGetTokensQuery.getTokens,
            network: {
              ...oldGetTokensQuery.getTokens.network,
              ...data?.updateNetwork,
            },
            networkPublicInfo: {
              ...oldGetTokensQuery.getTokens.networkPublicInfo,
              domain,
              id,
              logo,
              name,
              status,
              membership,
              visibility,
            },
          },
        },
      })

      return null
    },
    ...mutationOptions,
  })

  const updateNetwork = useCallback(
    (NetworkEntity: UpdateNetworkMutationVariables['input']) =>
      updateNetworkInfo({
        variables: {
          input: NetworkEntity,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateNetwork: merge(network, NetworkEntity),
        },
      }),
    [network, updateNetworkInfo],
  )

  return { updateNetwork, loading, error }
}
