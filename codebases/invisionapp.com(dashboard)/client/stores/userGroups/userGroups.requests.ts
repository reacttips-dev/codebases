import bffRequest from '../../utils/bffRequest'

export const validateGroupName = (name: string) => {
  return bffRequest.post('/teams/api/user-groups/validate-name', { name })
}

export const createUserGroup = ({
  name,
  userIds
}: {
  name: string
  userIds: Array<number>
}) => {
  return bffRequest.post('/teams/api/user-groups', {
    name,
    userIds
  })
}
