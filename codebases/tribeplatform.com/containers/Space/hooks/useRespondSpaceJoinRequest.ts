import { useCallback, useMemo } from 'react'

import { gql, useApolloClient } from '@apollo/client'

import {
  DECLINE_SPACE_JOIN_REQUEST,
  DeclineSpaceJoinRequestMutation,
  DeclineSpaceJoinRequestMutationVariables,
  ApproveSpaceJoinRequestMutation,
  ApproveSpaceJoinRequestMutationVariables,
  APPROVE_SPACE_JOIN_REQUEST,
} from 'tribe-api/graphql'
import {
  Action,
  ActionStatus,
  SpaceJoinRequest,
  SpaceJoinRequestStatus,
} from 'tribe-api/interfaces'

const useRespondSpaceJoinRequest = (spaceJoinRequest: SpaceJoinRequest) => {
  const apolloClient = useApolloClient()
  const optimisticResponse: Action = useMemo(
    () => ({
      __typename: 'Action',
      status: ActionStatus.SUCCEEDED,
    }),
    [],
  )

  const approve = useCallback(async () => {
    const response = await apolloClient.mutate<
      ApproveSpaceJoinRequestMutation,
      ApproveSpaceJoinRequestMutationVariables
    >({
      mutation: APPROVE_SPACE_JOIN_REQUEST,
      variables: {
        spaceId: spaceJoinRequest?.spaceId,
        spaceJoinRequestId: spaceJoinRequest.id,
      },
      optimisticResponse: {
        approveSpaceJoinRequest: optimisticResponse,
      },
      update: cache => {
        cache.writeFragment({
          id: cache.identify(spaceJoinRequest),
          fragment: gql`
            fragment _ on SpaceJoinRequest {
              status
            }
          `,
          data: {
            status: SpaceJoinRequestStatus.COMPLETED,
          },
        })
      },
    })

    return response
  }, [spaceJoinRequest, apolloClient, optimisticResponse])

  const decline = useCallback(async () => {
    const response = await apolloClient.mutate<
      DeclineSpaceJoinRequestMutation,
      DeclineSpaceJoinRequestMutationVariables
    >({
      mutation: DECLINE_SPACE_JOIN_REQUEST,
      variables: {
        spaceId: spaceJoinRequest?.spaceId,
        spaceJoinRequestId: spaceJoinRequest.id,
      },
      optimisticResponse: {
        declineSpaceJoinRequest: optimisticResponse,
      },
      update: cache => {
        cache.writeFragment({
          id: cache.identify(spaceJoinRequest),
          fragment: gql`
            fragment _ on SpaceJoinRequest {
              status
            }
          `,
          data: {
            status: SpaceJoinRequestStatus.DECLINED,
          },
        })
      },
    })

    return response
  }, [spaceJoinRequest, apolloClient, optimisticResponse])

  return {
    approve,
    decline,
  }
}
export default useRespondSpaceJoinRequest
