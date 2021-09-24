import { ApolloError, useQuery } from '@apollo/client'

import {
  GetAuthMemberQuery,
  GetAuthMemberQueryVariables,
} from 'tribe-api/graphql'
import { GET_AUTH_MEMBER } from 'tribe-api/graphql/members.gql'
import { AuthUser, RoleType } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'

import useGetNetwork from 'containers/Network/useGetNetwork'

const useAuthMember = (): {
  data: AuthUser
  authUser: AuthUser
  loading: boolean
  error?: ApolloError
  isGuest: boolean
  isNetworkModerator: boolean
  isNetworkAdmin: boolean
} => {
  const { network } = useGetNetwork()
  const { authorized: canGetAuthMember } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'getAuthMember',
  )
  const { loading, error, data } = useQuery<
    GetAuthMemberQuery,
    GetAuthMemberQueryVariables
  >(GET_AUTH_MEMBER, {
    skip: !canGetAuthMember,
  })

  let isGuest = !data?.getAuthMember
  if (data?.getAuthMember) {
    isGuest = data?.getAuthMember?.role?.type === RoleType.GUEST
  }

  return {
    data: data?.getAuthMember as AuthUser,
    loading,
    error,
    isGuest,
    isNetworkModerator: data?.getAuthMember?.role?.type === RoleType.MODERATOR,
    isNetworkAdmin: data?.getAuthMember?.role?.type === RoleType.ADMIN,
    authUser: data?.getAuthMember as AuthUser,
  }
}

export default useAuthMember
