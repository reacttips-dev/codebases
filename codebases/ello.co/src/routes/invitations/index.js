import InvitationsContainer from '../../containers//InvitationsContainer'

export default [
  {
    path: 'invitations',
    getComponents(location, cb) {
      cb(null, InvitationsContainer)
    },
  },
]

