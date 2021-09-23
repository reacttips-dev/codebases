import { QueryHookOptions, useQuery } from '@apollo/client'

import {
  MemberInvitationStatus,
  MemberInvitationsTotalCountQuery,
  MemberInvitationsTotalCountQueryVariables,
  MEMBER_INVITATIONS_TOTAL_COUNT,
  Network,
  Plan,
  PlanName,
} from 'tribe-api'

import useGetNetwork from 'containers/Network/useGetNetwork'
import { MEMBERS_LIMIT } from 'containers/Space/hooks'

export interface UseMemberCapacity {
  didReachLimit: boolean
  isApproachingLimit: boolean
  isLoading: boolean
  memberCapacity: Network['memberCapacity']
  memberCapacityDeclared: Network['memberCapacityDeclared']
  totalInvitationCount: number
}

export const getLimitTreshold = (plan: Plan): number => {
  if (plan?.trial) {
    return 0.75
  }

  switch (plan?.name) {
    default:
    case PlanName.BASIC:
      return 0.75

    case PlanName.PLUS:
    case PlanName.PREMIUM:
    case PlanName.ENTERPRISE:
      return 0.9
  }
}

export const useMemberCapacity = (
  options?: QueryHookOptions<
    MemberInvitationsTotalCountQuery,
    MemberInvitationsTotalCountQueryVariables
  >,
): UseMemberCapacity => {
  const { network, loading: isNetworkLoading } = useGetNetwork()

  const { loading: areMemberInvitationsLoading, data } = useQuery<
    MemberInvitationsTotalCountQuery,
    MemberInvitationsTotalCountQueryVariables
  >(MEMBER_INVITATIONS_TOTAL_COUNT, {
    variables: {
      limit: MEMBERS_LIMIT,
      status: MemberInvitationStatus.NOTSENT,
    },
    fetchPolicy: 'cache-first',
    ...options,
  })

  const totalInvitationCount = data?.memberInvitations?.totalCount || 0
  const memberCapacity = network?.memberCapacity
  const memberCapacityDeclared = network?.memberCapacityDeclared

  const didReachLimit =
    memberCapacityDeclared + totalInvitationCount >= memberCapacity
  const isApproachingLimit = !!(
    network?.subscriptionPlan &&
    memberCapacityDeclared + totalInvitationCount >=
      getLimitTreshold(network?.subscriptionPlan) * memberCapacity &&
    memberCapacityDeclared + totalInvitationCount < memberCapacity
  )

  const isLoading =
    typeof data?.memberInvitations?.totalCount !== 'number' ||
    isNetworkLoading ||
    areMemberInvitationsLoading

  return {
    didReachLimit,
    isApproachingLimit,
    isLoading,
    memberCapacity: network?.memberCapacity,
    memberCapacityDeclared: network?.memberCapacityDeclared,
    totalInvitationCount,
  }
}

export default useMemberCapacity
