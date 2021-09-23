import { useQuery } from '@apollo/client'

import {
  GetTokensQuery,
  GetTokensQueryVariables,
  GET_TOKENS,
} from 'tribe-api/graphql'

const useAuthToken = () => {
  const { data, loading, error } = useQuery<
    GetTokensQuery,
    GetTokensQueryVariables
  >(GET_TOKENS)

  return {
    data,
    authToken: data?.getTokens,
    error,
    loading,
  }
}

export default useAuthToken
