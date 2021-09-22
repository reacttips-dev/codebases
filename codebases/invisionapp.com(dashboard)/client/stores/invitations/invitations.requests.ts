import bffRequest, { requestWithPartialFailures } from '../../utils/bffRequest'

export const deleteInvitationBffRequest = (id: string) => {
  return bffRequest.delete(`/teams/api/invitations/${id}`)
}

type BulkChangeRoleArgs = {
  userID: number
  roleID: number
}[]

export const bulkChangeInvitationsRole = (invitations: BulkChangeRoleArgs) => {
  return requestWithPartialFailures(`/teams/api/invitations/bulk-change-role`, 'put', {
    invitations
  })
}

type BulkChangeSeatTypeArgs = {
  userID: number
  seatTypeID: number
}[]

export const bulkChangeInvitationsSeatType = (invitations: BulkChangeSeatTypeArgs) => {
  return requestWithPartialFailures(`/teams/api/invitations/bulk-change-seat-type`, 'put', {
    invitations
  })
}
