import bffRequest from '../../utils/bffRequest'

type BulkChangeSeatTypeArgs = {
  userID: number
  seatTypeID: number
}[]

export const bulkChangeSeatType = (members: BulkChangeSeatTypeArgs) => {
  return bffRequest.put(`/teams/api/members/bulk-change-seat-type`, {
    members
  })
}

export type BulkChangeRoleArgs = { roleID: number; userID: number }[]

export const bulkChangeRole = (members: BulkChangeRoleArgs) => {
  return bffRequest.put('/teams/api/members/bulk-change-role', {
    members
  })
}

export const deleteMember = (memberId: number) =>
  bffRequest.delete(`/teams/api/members/${memberId}`)

export const getAllMembersForDocTransfers = () => {
  return bffRequest.get('/teams/api/members/for-doc-transfer')
}
