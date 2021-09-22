import React, { lazy, Suspense } from 'react'
import { LoadingTable } from './components/tables/LoadingTable'

/*
  TODO:

  These user groups components need to be put into one User Groups file to only lazy load
  that one file. Due to some errors that react-router gives us, we have to do it one by one
  for now. It's not an issue until this gets to production.
*/

const AuditLogContainerLazy = lazy(() =>
  import(/* webpackChunkName: "AuditLogContainer" */ './components/auditlog/AuditLogContainer')
)

const InvitesLazy = lazy(() => import(/* webpackChunkName: "Invites" */ './layouts/Invites'))

const SettingsLazy = lazy(() =>
  import(/* webpackChunkName: "Settings" */ './containers/Settings')
)

const UserGroupsLazy = lazy(() =>
  import(/* webpackChunkName: "UserGroups" */ './layouts/UserGroups')
)

const UserGroupsNewLazy = lazy(() =>
  import(/* webpackChunkName: "UserGroupsNew" */ './components/userGroups/UserGroupsNew')
)

const UserGroupsEditNameLazy = lazy(() =>
  import(
    /* webpackChunkName: "UserGroupsEditName" */ './components/userGroups/UserGroupsEditName'
  )
)

const UserGroupsManageLazy = lazy(() =>
  import(/* webpackChunkName: "UserGroupsManage" */ './components/userGroups/UserGroupsManage')
)

const AccountManagementModalLazy = lazy(() =>
  import(/* webpackChunkName: "AccountManagementModal" */ './containers/AccountManagement')
)

const DocumentsTransferLazy = lazy(() =>
  import(/* webpackChunkName: "TransferDocument" */ './components/documents/TransferDocuments')
)

const DeleteTeamLazy = lazy(() =>
  import(/* webpackChunkName: "DeleteTeam" */ './layouts/DeleteTeam/DeleteTeam')
)

export const AuditLogContainer = props => {
  return (
    <Suspense fallback={null}>
      <AuditLogContainerLazy {...props} />
    </Suspense>
  )
}

export const Invites = props => {
  return (
    <Suspense fallback={null}>
      <InvitesLazy {...props} />
    </Suspense>
  )
}

export const Settings = props => {
  return (
    <Suspense fallback={null}>
      <SettingsLazy {...props} />
    </Suspense>
  )
}

export const UserGroups = props => {
  return (
    <Suspense fallback={<LoadingTable />}>
      <UserGroupsLazy {...props} />
    </Suspense>
  )
}

export const UserGroupsNew = props => {
  return (
    <Suspense fallback={null}>
      <UserGroupsNewLazy {...props} />
    </Suspense>
  )
}

export const UserGroupsEditNameModal = props => {
  return (
    <Suspense fallback={null}>
      <UserGroupsEditNameLazy {...props} />
    </Suspense>
  )
}

export const UserGroupsManageModal = props => {
  return (
    <Suspense fallback={null}>
      <UserGroupsManageLazy {...props} />
    </Suspense>
  )
}

export const AccountManagementModal = props => {
  return (
    <Suspense fallback={null}>
      <AccountManagementModalLazy {...props} />
    </Suspense>
  )
}

export const DocumentsTransfer = props => {
  return (
    <Suspense fallback={null}>
      <DocumentsTransferLazy {...props} />
    </Suspense>
  )
}

export const DeleteTeam = props => {
  return (
    <Suspense fallback={null}>
      <DeleteTeamLazy {...props} />
    </Suspense>
  )
}
