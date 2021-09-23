import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  Basket,
  BASKETS,
  BasketsInput,
  BasketsQuery,
  BasketsQueryVariables,
} from 'tribe-api'

export type UseCalculateBasketResult = QueryResult & {
  basket: Basket[]
}

export const useBaskets = (input: BasketsInput): UseCalculateBasketResult => {
  const { loading, data, error } = useQuery<
    BasketsQuery,
    BasketsQueryVariables
  >(BASKETS, {
    variables: {
      input,
    },
  })

  return {
    data,
    error,
    basket: data?.baskets as Basket[],
    loading,
    isInitialLoading: loading && data?.baskets === undefined,
  }
}
