import { useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  GetSpaceMembershipRequestsQuery,
  GetSpaceMembershipRequestsQueryVariables,
} from 'tribe-api/graphql'
import { GET_SPACE_MEMBERSHIP_REQUESTS } from 'tribe-api/graphql/spaces.gql'
import { SpaceJoinRequest, SpaceJoinRequestStatus } from 'tribe-api/interfaces'

type UseGetSpaceMembershipRequestsResult = QueryResult<
  GetSpaceMembershipRequestsQuery
> & {
  spaceJoinRequests: SpaceJoinRequest[]
}

export const useGetSpaceMembershipRequests = ({
  spaceId,
}: GetSpaceMembershipRequestsQueryVariables): UseGetSpaceMembershipRequestsResult => {
  const { loading, data, error } = useQuery<
    GetSpaceMembershipRequestsQuery,
    GetSpaceMembershipRequestsQueryVariables
  >(GET_SPACE_MEMBERSHIP_REQUESTS, {
    variables: {
      spaceId,
      status: SpaceJoinRequestStatus.PENDING,
    },
    skip: !spaceId,
  })

  const spaceJoinRequests = useMemo(
    () =>
      (data?.getSpaceMembershipRequests as SpaceJoinRequest[])?.filter(
        joinReq => joinReq?.status === SpaceJoinRequestStatus.PENDING,
      ) || [],
    [data?.getSpaceMembershipRequests],
  )

  return {
    error,
    data,
    loading,
    isInitialLoading: loading && data?.getSpaceMembershipRequests === undefined,
    spaceJoinRequests,
  }
}
