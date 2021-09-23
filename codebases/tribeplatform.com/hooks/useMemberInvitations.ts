import { useCallback, useMemo, useState } from 'react'

import { ApolloQueryResult, useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GetMemberInvitationsQuery,
  GetMemberInvitationsQueryVariables,
} from 'tribe-api/graphql'
import { GET_MEMBER_INVITATIONS } from 'tribe-api/graphql/members.gql'
import { MemberInvitation, MemberInvitationStatus } from 'tribe-api/interfaces'

import { MEMBERS_LIMIT } from 'containers/Space/hooks/useSpaceMembers'

type UseInvitationMembersProps = {
  limit?: number
}

type UseMemberInvitationsResult = PaginatedQueryResult<
  GetMemberInvitationsQuery
> & {
  members: Array<MemberInvitation>
  query?: (
    variables?: Partial<GetMemberInvitationsQueryVariables>,
  ) => Promise<ApolloQueryResult<GetMemberInvitationsQuery>>
  searchResult: boolean
}

export const useMemberInvitations = ({
  limit = MEMBERS_LIMIT,
}: UseInvitationMembersProps = {}): UseMemberInvitationsResult => {
  const { loading, error, data, refetch, fetchMore } = useQuery<
    GetMemberInvitationsQuery,
    GetMemberInvitationsQueryVariables
  >(GET_MEMBER_INVITATIONS, {
    variables: {
      limit,
      status: MemberInvitationStatus.NOTSENT,
    },
    fetchPolicy: 'cache-and-network',
  })
  const [searchResult, setSearchResult] = useState(false)

  const { hasNextPage, endCursor } = data?.memberInvitations?.pageInfo || {
    hasNextPage: false,
  }
  const query = useCallback(
    variables => {
      setSearchResult(!!variables?.query)
      return refetch({
        limit: variables?.limit || limit,
        query: variables?.query,
      })
    },
    [refetch, limit],
  )

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: endCursor,
        },
      })
    }
  }, [hasNextPage, endCursor, fetchMore])

  const members: Array<MemberInvitation> = useMemo(
    () =>
      data?.memberInvitations?.edges?.map(
        edge => edge?.node as MemberInvitation,
      ) || [],
    [data?.memberInvitations],
  )

  return {
    data,
    members,
    loading,
    error,
    hasNextPage,
    totalCount: data?.memberInvitations?.totalCount,
    query,
    loadMore,
    searchResult,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.memberInvitations?.totalCount === 0,
  }
}

export default useMemberInvitations
