import React from 'react'

import { Role, Space } from 'tribe-api/interfaces'

export type UserImportContextProps = {
  defaultRole?: Role
  defaultSpaces: Space[]
  hasInviteDefaultsPermission: boolean
  loading: boolean
  onSpaceSearch: (query: string) => Promise<Space[]>
  roles: Role[]
  spaces: Space[]
}
export const UserImportContext = React.createContext<
  UserImportContextProps | undefined
>(undefined)

export const useUserImportContext = () => {
  const context = React.useContext(UserImportContext)
  return context
}
