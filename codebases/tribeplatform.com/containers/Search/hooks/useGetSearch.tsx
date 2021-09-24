import { useCallback, useEffect, useState } from 'react'

import { useLazyQuery, ApolloError } from '@apollo/client'

import { GET_SEARCH } from 'tribe-api/graphql'
import {
  SearchQuery,
  SearchQueryVariables,
} from 'tribe-api/graphql/search.gql.generated'
import { useDeepMemo } from 'tribe-components'

export interface SearchResponse {
  searchError?: ApolloError
  searchLoading: boolean
  searchResults?: SearchQuery
  getSearchResults: (query: string) => void
  searchCount: number
  query: string
}

export const useGetSearch = (): SearchResponse => {
  // Skip is handled by parent.
  const [
    getResults,
    { loading: searchLoading, data, error: searchError, variables },
  ] = useLazyQuery<SearchQuery, SearchQueryVariables>(GET_SEARCH, {
    fetchPolicy: 'network-only',
  })

  const query = variables?.input?.query || ''

  const [searchResults, setSearchResults] = useState<SearchQuery>()

  const searchResultsMemo = useDeepMemo(() => data, [data])

  useEffect(() => {
    if (!searchLoading) {
      setSearchResults(searchResultsMemo)
    }
  }, [searchLoading, searchResultsMemo])

  const getSearchResults = useCallback(
    (query: string) => {
      getResults({
        variables: {
          input: {
            query,
          },
        },
      })
    },
    [getResults],
  )

  return {
    getSearchResults,
    searchCount: searchResults?.search?.totalCount || 0,
    searchError,
    searchLoading,
    searchResults,
    query,
  }
}
