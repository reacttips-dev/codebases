import { useMutation } from '@apollo/client'

import {
  SPACE_JOIN_REQUEST_FRAGMENT,
  REQUEST_SPACE_MEMBERSHIP,
  RequestSpaceMembershipMutation,
  RequestSpaceMembershipMutationVariables,
  GET_SPACE_MEMBERSHIP_REQUEST_FOR_MEMBER,
  SpaceQuery,
} from 'tribe-api/graphql'
import { SpaceJoinRequestStatus } from 'tribe-api/interfaces'

const useRequestSpaceMembership = (space: SpaceQuery['space']) => {
  const [requestSpaceMembership, { loading, error, data }] = useMutation<
    RequestSpaceMembershipMutation,
    RequestSpaceMembershipMutationVariables
  >(REQUEST_SPACE_MEMBERSHIP, {
    variables: {
      spaceId: space?.id,
    },
    refetchQueries: [
      {
        query: GET_SPACE_MEMBERSHIP_REQUEST_FOR_MEMBER,
        variables: {
          status: SpaceJoinRequestStatus.PENDING,
        },
      },
    ],
    optimisticResponse: {
      requestSpaceMembership: {
        __typename: 'SpaceJoinRequest',
        id: 'abc123',
        status: SpaceJoinRequestStatus.PENDING,
        spaceId: space?.id,
        member: null,
      },
    },
    update: (cache, { data: fetchedData }) => {
      cache.modify({
        fields: {
          getSpaceMembershipRequestForMember(
            existingJoinRequestsRefs = [],
            { readField },
          ) {
            const newSpaceJoinRequestRef = cache.writeFragment({
              data: fetchedData?.requestSpaceMembership,
              fragment: SPACE_JOIN_REQUEST_FRAGMENT,
            })

            // Quick safety check - if the new comment is already
            // present in the cache, we don't need to add it again.
            if (
              existingJoinRequestsRefs.some(
                ref =>
                  readField('id', ref) ===
                  fetchedData?.requestSpaceMembership.id,
              )
            ) {
              return existingJoinRequestsRefs
            }

            return [...existingJoinRequestsRefs, newSpaceJoinRequestRef]
          },
        },
      })
    },
  })

  return {
    requestSpaceMembership,
    loading,
    error,
    data,
  }
}

export default useRequestSpaceMembership
