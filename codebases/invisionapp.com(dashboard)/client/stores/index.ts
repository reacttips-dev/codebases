import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import auditLog, { AuditLogState } from './auditLog'
import banner, { BannerState } from './banner'
import billing, { BillingState } from './billing'
import bulkItems, { BulkItemsState } from './bulkItems'
import team, { TeamState } from './team'
import user, { UserState } from './user'
import { appReducer, AppStoreState } from './app'
import permissions, { PermissionsState } from './permissions'
import flash, { FlashState } from './flash'
import undoReducer, { UndoState } from './undo'
import restrictions, { RestrictionsState } from './restrictions'
import removedUsers, { RemovedUsersState } from './removedUsers'
import inviteModal, { InviteModalState } from './inviteModal'
import roles, { RolesState } from './roles'
import exportsReducer from './exports'
import { ExportState } from './exports/exports.types'
import members, {
  FETCH as MEMBER_FETCH,
  FETCH_AND_REPLACE as MEMBER_FETCH_AND_REPLACE,
  MembersState
} from './members'
import paginate, { Pagination, AllPagination } from './pagination'
import invitations, {
  FETCH as INVITATIONS_FETCH,
  FETCH_AND_REPLACE as INVITATIONS_FETCH_AND_REPLACE,
  InvitationsState
} from './invitations'
import notification, { NotificationsState } from './notifications'
import logo, { LogoState } from './logo'
import userGroups, { UserGroupsState } from './userGroups'
import location, { State as LocationState } from './location'
import featureFlagReducer, { FeatureFlagState } from './featureFlags'
import lastSeen, { LastSeenState } from './lastSeen'
import userDocumentCounts, { UserDocumentCountsState } from './userDocumentCounts'

export type AppState = {
  allPagination: AllPagination
  app: AppStoreState
  auditLog: AuditLogState
  banner: BannerState
  billing: BillingState
  bulkItems: BulkItemsState
  exports: ExportState
  featureFlags: FeatureFlagState
  flash: FlashState
  guests: MembersState
  invitations: InvitationsState
  inviteModal: InviteModalState
  lastSeen: LastSeenState
  location: LocationState
  logo: LogoState
  members: MembersState
  membersOnly: MembersState
  notification: NotificationsState
  pagination: Pagination
  permissions: PermissionsState
  removedUsers: RemovedUsersState
  restrictions: RestrictionsState
  roles: RolesState
  team: TeamState
  undo: UndoState
  user: UserState
  userDocumentCounts: UserDocumentCountsState
  userGroups: UserGroupsState
}

// Updates the pagination data for different actions.
const allPaginationReducer = combineReducers({
  members: paginate({
    types: {
      request: MEMBER_FETCH.REQUEST,
      success: MEMBER_FETCH.SUCCESS,
      failure: MEMBER_FETCH.FAILURE,
      bulkSuccess: MEMBER_FETCH_AND_REPLACE.SUCCESS
    },
    key: 'members'
  }),
  membersOnly: paginate({
    types: {
      request: MEMBER_FETCH.REQUEST,
      success: MEMBER_FETCH.SUCCESS,
      failure: MEMBER_FETCH.FAILURE,
      bulkSuccess: MEMBER_FETCH_AND_REPLACE.SUCCESS
    },
    key: 'membersOnly'
  }),
  guests: paginate({
    types: {
      request: MEMBER_FETCH.REQUEST,
      success: MEMBER_FETCH.SUCCESS,
      failure: MEMBER_FETCH.FAILURE,
      bulkSuccess: MEMBER_FETCH_AND_REPLACE.SUCCESS
    },
    key: 'guests'
  }),
  invitations: paginate({
    types: {
      request: INVITATIONS_FETCH.REQUEST,
      success: INVITATIONS_FETCH.SUCCESS,
      failure: INVITATIONS_FETCH.FAILURE,
      bulkSuccess: INVITATIONS_FETCH_AND_REPLACE.SUCCESS
    },
    key: 'invitations'
  })
})

export default combineReducers({
  app: appReducer,
  auditLog,
  banner,
  billing,
  bulkItems,
  exports: exportsReducer,
  featureFlags: featureFlagReducer,
  flash,
  form,
  invitations,
  inviteModal,
  lastSeen,
  location,
  logo,
  members,
  notification,
  allPagination: allPaginationReducer,
  permissions,
  removedUsers,
  restrictions,
  roles,
  routing,
  team,
  undo: undoReducer,
  user,
  userDocumentCounts,
  userGroups
})
