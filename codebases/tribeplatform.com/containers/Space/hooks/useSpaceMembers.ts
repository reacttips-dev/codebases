import { useCallback, useMemo } from 'react'

import { ApolloError, ApolloQueryResult, useQuery } from '@apollo/client'

import {
  GET_SPACE_MEMBERS,
  GetSpaceMembersQuery,
  GetSpaceMembersQueryVariables,
} from 'tribe-api/graphql'
import { SpaceMember, MemberStatus } from 'tribe-api/interfaces'

type UseSpaceMembersResult = {
  data?: GetSpaceMembersQuery
  loading: boolean
  error?: ApolloError
  hasNextPage: boolean
  totalCount: number
  spaceMembers: SpaceMember[]
  refetch: () => void
  fetchMore: () => Promise<ApolloQueryResult<unknown>> | undefined
  query?: (
    variables?: Partial<GetSpaceMembersQueryVariables>,
  ) => Promise<ApolloQueryResult<GetSpaceMembersQuery>>
}

type UseSpaceMembers = GetSpaceMembersQueryVariables & {
  skip?: boolean
}

export const MEMBERS_LIMIT = 20

export const useSpaceMembers = ({
  spaceId,
  limit = MEMBERS_LIMIT,
  roleIds,
  skip = false,
}: UseSpaceMembers): UseSpaceMembersResult => {
  const { loading, error, data, fetchMore, refetch: _refetch } = useQuery(
    GET_SPACE_MEMBERS,
    {
      variables: {
        spaceId,
        limit,
        roleIds,
      },
      returnPartialData: true,
      partialRefetch: true,
      skip: skip || !spaceId,
    },
  )

  const hasNextPage = data?.getSpaceMembers?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage) {
      return fetchMore({
        variables: {
          after: data?.getSpaceMembers?.pageInfo?.endCursor,
        },
      })
    }
  }, [data?.getSpaceMembers?.pageInfo?.endCursor, fetchMore, hasNextPage])

  const refetch = useCallback(() => {
    _refetch({
      spaceId,
      limit,
      roleIds,
    })
  }, [_refetch, limit, roleIds, spaceId])

  const spaceMembers: Array<SpaceMember> = useMemo(
    () =>
      data?.getSpaceMembers?.edges
        ?.map(edge => edge.node)
        .filter(
          it =>
            it?.member !== null && it.member.status !== MemberStatus.DELETED,
        ) || [],
    [data?.getSpaceMembers],
  )

  return {
    data,
    error,
    fetchMore: loadMore,
    hasNextPage,
    loading,
    refetch,
    spaceMembers,
    totalCount: data?.getSpaceMembers?.totalCount,
  }
}
