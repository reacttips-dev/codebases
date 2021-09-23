import { useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  GetRolesQuery,
  GetRolesQueryVariables,
  GET_ROLES,
} from 'tribe-api/graphql'
import { Role, RoleType } from 'tribe-api/interfaces'

export type UseRolesResult = QueryResult<GetRolesQuery> & {
  roles: Role[]
  admin?: Role
  member?: Role
}

export const useGetRoles = (): UseRolesResult => {
  const { data, error, loading } = useQuery<
    GetRolesQuery,
    GetRolesQueryVariables
  >(GET_ROLES)

  const roles = useMemo(
    () =>
      ((data?.getRoles as Role[]) || []).filter(
        role => role.type !== RoleType.GUEST,
      ),
    [data?.getRoles],
  )

  const admin = roles.find(it => it.type === RoleType.ADMIN)
  const member = roles.find(it => it.type === RoleType.MEMBER)

  return {
    data,
    error,
    loading,
    isInitialLoading: loading && data === undefined,
    roles,
    admin,
    member,
  }
}
