import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRedirect, Redirect } from 'react-router'
import { ThemeProvider } from 'styled-components'
import theme from '@invisionapp/helios/css/theme'

import { GlobalHeaderProvider } from '@invisionapp/helios/composites'

import {
  CanAccessTeam,
  CanChangeEnterpriseSettings,
  CanChangeSignUpMode,
  CanChangeTeamName,
  CanChangeTeamURL,
  CanDeleteTeam,
  CanReviewTeamSettings,
  CanTransferTeam,
  CanViewAllTeamMembers,
  BlockGuests,
  CanChangeDocumentsSettings,
  CanViewInvitiations,
  CanInvitePeople,
  CanViewAuditLog,
  CanViewGroups,
  CanManageGroups,
  CanViewRemovedUsers
} from './auth'
import { onChangeHasModals } from './utils/route'

import NoMatch from './components/NoMatch'
import App from './containers/App'
import AppLoadErrorHandler from './AppLoadErrorHandler'

import People from './layouts/People'
import Members from './layouts/Members/Members'
import Guests from './layouts/Guests/Guests'
import Invitations from './layouts/Invitations/Invitations'
import RemovedUsers from './layouts/RemovedUsers/RemovedUsers'

import PrincipalSettingsModal from './components/settings/PrincipalSettingsModal'
import EditIconModal from './components/settings/EditIconModal'
import EditSignUpModeModal from './components/settings/EditSignUpModeModal'
import InviteNamesModal from './components/modals/InviteNamesModal'
import InviteConfirmModal from './components/modals/InviteConfirmModal'
import TransferOwnership from './components/modals/TransferOwnership'
import TransferOwnershipVerify from './containers/TransferOwnershipVerify'
import TransferOwnershipConfirm from './components/modals/TransferOwnershipConfirm'
import EditSSOModal from './components/settings/EditSSOModal'
import PreSSOContainer from './components/settings/PreSSOContainer'
import DocumentsSettingsModal from './components/settings/DocumentsSettingsModal'
import PasswordRequirementsModal from './components/settings/PasswordRequirementsModal'
import SessionTimeoutsModal from './components/settings/SessionTimeoutsModal'
import BillingRedirect from './components/billing/BillingRedirect'
import {
  AuditLogContainer,
  UserGroups,
  UserGroupsNew,
  UserGroupsEditNameModal,
  UserGroupsManageModal,
  AccountManagementModal,
  Invites,
  Settings,
  DocumentsTransfer,
  DeleteTeam
} from './lazyComponents'

export const Routes = ({ store, history }) => {
  // InVision user metrics
  if (window.rum) {
    window.rum.markTime('spaInitialRender', { featureName: 'team-management-web' })
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalHeaderProvider>
          <Router history={history}>
            <Route component={AppLoadErrorHandler}>
              <Route path="/teams/billing*" component={BillingRedirect} />
              <Route path="/teams" component={CanAccessTeam(App)}>
                <IndexRedirect to="/teams/people" />

                <Route path="documents/transfer" component={DocumentsTransfer} />

                <Route path="account" component={AccountManagementModal} />
                <Route path="settings" component={CanReviewTeamSettings(Settings)}>
                  <Route
                    path="documents"
                    component={CanChangeDocumentsSettings(DocumentsSettingsModal)}
                  />
                  <Route
                    path="edit-name"
                    component={CanChangeTeamURL(CanChangeTeamName(PrincipalSettingsModal))}
                  />
                  <Route path="edit-icon" component={EditIconModal} />
                  <Route
                    path="edit-sign-up-mode"
                    component={CanChangeSignUpMode(EditSignUpModeModal)}
                  />
                  <Route path="sso" component={CanChangeEnterpriseSettings(EditSSOModal)} />
                  <Route path="sso-warning" component={PreSSOContainer} />
                  <Route
                    path="password-requirements"
                    component={CanChangeEnterpriseSettings(PasswordRequirementsModal)}
                  />
                  <Route
                    path="session-timeouts"
                    component={CanChangeEnterpriseSettings(SessionTimeoutsModal)}
                  />

                  <Route path="delete-team" component={CanDeleteTeam(DeleteTeam)} />
                </Route>
                <Route path="people" component={BlockGuests(CanViewAllTeamMembers(People))}>
                  <IndexRedirect to="/teams/people/members" />
                  <Route path="members" component={Members} />
                  <Route path="members/add-invite" component={Members} />
                  <Route path="guests" component={Guests} />
                  <Route path="guests/add-invite" component={Guests} />
                  <Route path="invitations" component={CanViewInvitiations(Invitations)} />
                  <Route
                    path="invitations/add-invite"
                    component={CanViewInvitiations(Invitations)}
                  />
                  <Route
                    path="members/transfer-ownership"
                    afterVerify="/teams/people/members/transfer-ownership/verify"
                    closeTo="/teams/people/members"
                    component={CanTransferTeam(TransferOwnership)}
                  />
                  <Route
                    path="members/transfer-ownership/verify"
                    afterVerify="/teams/people/members/transfer-ownership/confirm"
                    backTo="/teams/people/members/transfer-ownership"
                    closeTo="/teams/people/members"
                    component={CanTransferTeam(TransferOwnershipVerify)}
                  />
                  <Route
                    path="members/transfer-ownership/confirm"
                    afterVerify="/teams/people/members"
                    component={TransferOwnershipConfirm}
                  />
                  <Route
                    path="groups"
                    component={CanViewGroups(UserGroups)}
                    onChange={onChangeHasModals}
                  >
                    <Route path="add-invite" component={CanViewGroups(UserGroups)} />
                    <Route path="new" component={CanManageGroups(UserGroupsNew)} modal />
                    <Route
                      path=":groupId/edit"
                      component={CanManageGroups(UserGroupsEditNameModal)}
                      modal
                    />
                    <Route path=":groupId/people" component={UserGroupsManageModal} modal />
                  </Route>
                  <Route path="removed" component={CanViewRemovedUsers(RemovedUsers)} />
                  <Route
                    path="removed/add-invite"
                    component={CanViewRemovedUsers(RemovedUsers)}
                  />
                </Route>

                <Route
                  path="/teams/audit-log"
                  component={CanViewAuditLog(AuditLogContainer)}
                />

                <Route path="invite" component={CanInvitePeople(Invites)}>
                  <IndexRedirect to="/teams/invite/member" />
                  <Redirect from="type" to="member" />
                  <Route path="member" component={InviteNamesModal} />
                  <Route path="confirm" component={InviteConfirmModal} />
                </Route>
              </Route>
              <Route path="*" component={NoMatch} />
            </Route>
          </Router>
        </GlobalHeaderProvider>
      </ThemeProvider>
    </Provider>
  )
}
