import bffRequest from '../../utils/bffRequest'

export function sendTeamDeleteVerificationCode() {
  return bffRequest.post('/teams/api/team/send-delete-validation')
}

export function validateDeleteVerificationCode(code: string) {
  return bffRequest
    .post('/teams/api/team/delete-validation', {
      code
    })
    .then(() => true)
    .catch(() => false)
}

export function deleteTeamRequest() {
  return bffRequest.delete(`/teams/api/team`)
}

export function logoutTeamUsers() {
  return bffRequest.delete(`/teams/api/team/logout`)
}
