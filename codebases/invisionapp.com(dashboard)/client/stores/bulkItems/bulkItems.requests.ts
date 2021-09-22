import { requestWithPartialFailures } from '../../utils/bffRequest'
import { BulkType, DeleteBulkType } from './bulkItems.types'

const requestBulkType = ['members', 'invitations', 'user-groups']

export const resendBulkInvites = (data: { userID: number }[]) =>
  requestWithPartialFailures(`/teams/api/invitations/bulk-resend`, 'patch', data)

export const deleteBulkItems = (data: DeleteBulkType, type: BulkType) => {
  if (requestBulkType.indexOf(type) === -1) {
    throw Error('Error: Type not present or not supported')
  }

  return requestWithPartialFailures(`/teams/api/${type}/bulk-delete`, 'patch', data)
}
