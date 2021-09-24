import { useCallback } from 'react'

import { useQuery, ApolloQueryResult } from '@apollo/client'

import { EmbedQuery, EmbedQueryVariables, EMBED } from 'tribe-api/graphql'

const useEmbed = (): {
  embed: (url: string) => Promise<ApolloQueryResult<EmbedQuery>>
} => {
  const { refetch } = useQuery<EmbedQuery, EmbedQueryVariables>(EMBED, {
    fetchPolicy: 'network-only',
    skip: true,
    variables: {
      url: '',
    },
  })

  const embed = useCallback(
    (url: string) => {
      return refetch({
        options: JSON.stringify({
          iframe: '1',
          omit_script: '1',
        }),
        url,
      })
    },
    [refetch],
  )

  return {
    embed,
  }
}

export default useEmbed
