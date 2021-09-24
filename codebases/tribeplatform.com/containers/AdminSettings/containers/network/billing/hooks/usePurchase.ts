import { useCallback } from 'react'

import { FetchResult, useApolloClient } from '@apollo/client'

import {
  PURCHASE,
  PurchaseMutation,
  PurchaseMutationVariables,
} from 'tribe-api/graphql'
import { PurchaseInput } from 'tribe-api/interfaces'

export type UsePurchaseResult = {
  purchase: (input: PurchaseInput) => Promise<FetchResult<PurchaseMutation>>
}

export const usePurchase = (): UsePurchaseResult => {
  const apolloClient = useApolloClient()

  const purchase = useCallback(
    async (input: PurchaseInput) => {
      const result = apolloClient.mutate<
        PurchaseMutation,
        PurchaseMutationVariables
      >({
        mutation: PURCHASE,
        variables: {
          input,
        },
      })

      apolloClient.cache.evict({ id: 'Network:{}' })
      return result
    },
    [apolloClient],
  )

  return {
    purchase,
  }
}
