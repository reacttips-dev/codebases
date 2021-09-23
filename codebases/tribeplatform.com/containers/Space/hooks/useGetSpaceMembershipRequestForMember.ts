import { useCallback, useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  GET_SPACE_MEMBERSHIP_REQUEST_FOR_MEMBER,
  GetSpaceMembershipRequestForMemberQuery,
  GetSpaceMembershipRequestForMemberQueryVariables,
} from 'tribe-api/graphql'
import {
  Space,
  SpaceJoinRequest,
  SpaceJoinRequestStatus,
} from 'tribe-api/interfaces'

type UseGetSpaceMembershipRequestForMemberResult = QueryResult<
  GetSpaceMembershipRequestForMemberQuery
> & {
  requests: SpaceJoinRequest[]
  isSpacePending: (spaceId: string) => boolean
}

export const useGetSpaceMembershipRequestForMember = (): UseGetSpaceMembershipRequestForMemberResult => {
  const { data, error, loading } = useQuery<
    GetSpaceMembershipRequestForMemberQuery,
    GetSpaceMembershipRequestForMemberQueryVariables
  >(GET_SPACE_MEMBERSHIP_REQUEST_FOR_MEMBER, {
    variables: {
      status: SpaceJoinRequestStatus.PENDING,
    },
  })

  const requests = useMemo(
    () =>
      (data?.getSpaceMembershipRequestForMember as SpaceJoinRequest[]) || [],
    [data?.getSpaceMembershipRequestForMember],
  )

  const isSpacePending = useCallback(
    (spaceId: Space['id']): boolean => {
      const spaceRequest = requests.find(
        spaceJoinRequest => spaceJoinRequest.spaceId === spaceId,
      )

      return spaceRequest?.status === SpaceJoinRequestStatus.PENDING
    },
    [requests],
  )

  return {
    isSpacePending,
    requests,
    data,
    error,
    loading,
    isInitialLoading:
      loading && data?.getSpaceMembershipRequestForMember === undefined,
  }
}
