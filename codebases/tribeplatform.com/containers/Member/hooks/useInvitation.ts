import { ApolloError, useQuery } from '@apollo/client'

import { GET_INVITATION_LINK } from 'tribe-api/graphql/network.gql'

const useInvitation = (): {
  data: { getMemberInvitationLink: { link } }
  loading: boolean
  error?: ApolloError
} => {
  const { loading, error, data } = useQuery(GET_INVITATION_LINK)

  return {
    data,
    loading,
    error,
  }
}

export default useInvitation
