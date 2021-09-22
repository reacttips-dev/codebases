import { InviteModalRole, Role, RoleId, RoleName } from './roles.types'

export const roleTypes = {
  OWNER: 1,
  ADMIN: 2,
  MANAGER: 3,
  MEMBER: 4,
  GUEST: 5
}

// InviteModalRoles should only be used for inviteModal.ts until a better way can be written
export const InviteModalRoles: InviteModalRole = {
  Owner: {
    id: 1,
    key: 'Owner',
    role: 'Owner'
  },
  Admin: {
    id: 2,
    key: 'admin',
    role: 'Admin'
  },
  Manager: {
    id: 3,
    key: 'manager',
    role: 'Manager'
  },
  Member: {
    id: 4,
    key: 'member',
    role: 'Member'
  },
  Guest: {
    id: 5,
    key: 'guest',
    role: 'Guest'
  }
}

export function canManageRole(id: number, roles: Role[]): boolean {
  return !!roles.find(role => role.id === id)
}

export function getRoleNameById(roles: Array<Role>, id: number): RoleName | '' {
  const role = roles.find(role => role.id === id)

  if (role && role.name) {
    return role.name
  }

  return ''
}

export function isRoleBulkEditable(roleId: RoleId) {
  return !isOwner(roleId)
}

export function isOwner(id: RoleId | undefined): boolean {
  return id === roleTypes.OWNER
}

export function isAdmin(id: RoleId | undefined): boolean {
  return id === roleTypes.ADMIN
}

export function isManager(id: RoleId | undefined): boolean {
  return id === roleTypes.MANAGER
}

export function isMember(id: RoleId | undefined): boolean {
  return id === roleTypes.MEMBER
}

export function isGuest(id: RoleId | undefined): boolean {
  return id === roleTypes.GUEST
}
