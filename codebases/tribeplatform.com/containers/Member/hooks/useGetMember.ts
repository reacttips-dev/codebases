import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import { GetMemberByIdQuery } from 'tribe-api/graphql'
import { GET_MEMBER_BY_ID } from 'tribe-api/graphql/members.gql'
import { Member } from 'tribe-api/interfaces'

export type UseGetMemberResult = QueryResult<GetMemberByIdQuery> & {
  member: Member | undefined
}

const useGetMember = (memberId: string): UseGetMemberResult => {
  const { loading, error, data } = useQuery(GET_MEMBER_BY_ID, {
    variables: {
      memberId,
    },
    skip: !memberId,
    fetchPolicy: 'cache-and-network',
    partialRefetch: true,
    returnPartialData: true,
  })

  return {
    data,
    member: data?.getMember,
    loading,
    error,
    isInitialLoading: loading && data === undefined,
  }
}

export default useGetMember
