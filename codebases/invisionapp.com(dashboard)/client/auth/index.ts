import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'
import { routerActions } from 'react-router-redux'
import NotAuthorized from '../components/modals/NotAuthorized'
import { AppState as State } from '../stores/index'
import { isGuest } from '../stores/roles'

const authenticatingSelector = (state: State) => {
  return state.user.isLoading || state.team.isLoading || state.permissions.isLoading
}
// Because we use InVisionEdgeContext, the checks here simply need to verify when
// the data has been completely loaded.
export const CanAccessTeam = connectedRouterRedirect({
  authenticatedSelector: state => {
    return (
      state.user.isLoaded,
      !state.user.isLoading && !state.team.isLoading && !state.permissions.isLoading
    )
  },
  authenticatingSelector,
  wrapperDisplayName: 'CanAccessTeam',
  redirectPath: '/auth/sign-in'
})

export const CanReviewTeamSettings = connectedRouterRedirect({
  authenticatedSelector: state => state.permissions['Team.ChangeSettings'],
  authenticatingSelector,
  wrapperDisplayName: 'CanReviewTeamSettings',
  redirectPath: '/teams'
})

export const CanDeleteTeam = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['Team.Delete'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanDeleteTeam'
})

export const CanChangeTeamName = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['Team.ChangeName'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanChangeTeamName'
})

export const CanChangeTeamURL = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['Team.ChangeName'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanChangeTeamURL'
})

export const CanViewAllTeamMembers = connectedRouterRedirect({
  authenticatedSelector: state => state.permissions['Team.ViewMembers'],
  authenticatingSelector,
  redirectPath: '/teams/account',
  wrapperDisplayName: 'CanViewAllTeamMembers'
})

export const BlockGuests = connectedRouterRedirect({
  authenticatedSelector: state => {
    return !isGuest(state.user.member?.roleID)
  },
  authenticatingSelector,
  redirectPath: '/teams/account',
  wrapperDisplayName: 'BlockGuests'
})

export const CanChangeDocumentsSettings = connectedRouterRedirect({
  authenticatedSelector: state => state.permissions['Team.ChangeSettings'],
  authenticatingSelector,
  redirectPath: '/teams/settings',
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'CanChangeDocumentsSettings'
})

export const CanChangeSignUpMode = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['Team.ChangeSettings'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanChangeSignUpMode'
})

export const CanTransferTeam = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['Team.ChangeOwnership'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanTransferTeam'
})

export const CanChangeEnterpriseSettings = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['Team.ChangeEnterpriseSettings'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanChangeEnterpriseSettings'
})

export const CanInvitePeople = connectedAuthWrapper({
  authenticatedSelector: state =>
    state.permissions['People.InviteGuest'] || state.permissions['People.InviteMember'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanInvitePeople'
})

export const CanViewInvitiations = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['People.ViewInvites'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanViewInvitiations'
})

export const CanViewAuditLog = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['Team.ViewAuditLog'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanViewAuditLog'
})

export const CanViewGroups = connectedAuthWrapper({
  authenticatedSelector: state => {
    return state.permissions['People.ViewGroups']
  },
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanViewGroups'
})

export const CanManageGroups = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['People.ManageGroups'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanManageGroups'
})

export const CanViewRemovedUsers = connectedAuthWrapper({
  authenticatedSelector: state => state.permissions['People.RemoveMember'],
  authenticatingSelector,
  FailureComponent: NotAuthorized,
  wrapperDisplayName: 'CanViewRemovedUsers'
})
