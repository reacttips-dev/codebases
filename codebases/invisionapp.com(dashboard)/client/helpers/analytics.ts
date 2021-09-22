// Allows global properties to be customized
declare global {
  interface Window {
    measure: any
    com: any
  }
}

const TEAMS_PATH = '/teams/people/'

const EVENTS = {
  PPLM_TAB_VIEWED: 'App.PeopleMgmt.Tab.Viewed',
  PPLM_ROLE_CHANGED: 'App.PeopleMgmt.Role.Changed',
  PPLM_INVITE_BACK: 'App.PeopleMgmt.InviteBack.Selected',
  PPLM_INVITE_FAILED: 'App.PeopleMgmt.Invite.Failed',
  PPLM_INVITE_VIEWED: 'App.PeopleMgmt.Invite.Viewed',
  PPLM_INVITE_CLOSED: 'App.PeopleMgmt.Invite.Closed',
  PPLM_INVITE_SELECTED: 'App.PeopleMgmt.Invite.Selected',
  PPLM_INVITE_CONFIRM_CLOSED: 'App.PeopleMgmt.InviteConfirm.Closed ',
  PPLM_INVITE_CONFIRM_SUBMITTED: 'App.PeopleMgmt.Invite.Submitted',
  PPLM_INVITE_REMOVED: 'App.PeopleMgmt.InviteRemoved.Selected',
  PPLM_INVITE_ROLE_TO_ADMIN: 'App.PeopleMgmt.InviteRoleToAdmin.Selected',
  PPLM_INVITE_ROLE_TO_GUEST: 'App.PeopleMgmt.InviteRoleToGuest.Selected',
  PPLM_INVITE_ROLE_TO_OWNER: 'App.PeopleMgmt.InviteRoleToOwner.Selected',
  PPLM_RESEND_INVITE: 'App.PeopleMgmt.ResendInvite.Selected',
  PPLM_RESEND_INVITE_FAILED: 'App.PeopleMgmt.ResendInvite.Failed',
  PPLM_REMOVE_INVITE: 'App.PeopleMgmt.RemoveInvitedUser.Succeeded',
  PPLM_REMOVE_USER: 'App.PeopleMgmt.UserRemoved.Succeeded',
  PPLM_SEARCH_SELECTED: 'App.PeopleMgmt.PeopleSearch.Selected',
  PPLM_TRANS_PO: 'App.PeopleMgmt.TransferPrimaryOwnership.Succeeded',
  PPLM_TRANS_PO_FAILED: 'App.PeopleMgmt.TransferPrimaryOwnership.Failed',
  PPLM_REMOVED_USER_INVITE: 'App.PeopleMgmt.RemovedUserInvite.Selected',
  PPLM_BILLING_TYPE_CHANGED: 'App.PeopleMgmt.BillingType.Changed',

  PPLM_GUESTS_LAST_SEEN_FILTERED: 'App.PeopleMgmt.Guests.LastSeen.Filter',
  PPLM_GUESTS_LAST_SEEN_SORTED: 'App.PeopleMgmt.Guests.LastSeen.Sort',
  PPLM_GUESTS_SEAT_TYPE_FILTERED: 'App.PeopleMgmt.Guests.SeatType.Filter',
  PPLM_GUESTS_STATUS_FILTERED: 'App.PeopleMgmt.Guests.Status.Filter',

  PPLM_INVITATIONS_DATE_FILTERED: 'App.PeopleMgmt.Invitations.Date.Filter',
  PPLM_INVITATIONS_DATE_SORTED: 'App.PeopleMgmt.Invitations.Date.Sort',
  PPLM_INVITATIONS_SEAT_TYPE_FILTERED: 'App.PeopleMgmt.Invitations.SeatType.Filter',

  PPLM_MEMBERS_LAST_SEEN_FILTERED: 'App.PeopleMgmt.Members.LastSeen.Filter',
  PPLM_MEMBERS_LAST_SEEN_SORTED: 'App.PeopleMgmt.Members.LastSeen.Sort',
  PPLM_MEMBERS_SEAT_TYPE_FILTERED: 'App.PeopleMgmt.Members.SeatType.Filter',

  PPLM_REMOVED_USERS_DATE_SORTED: 'App.PeopleMgmt.RemovedUsers.Date.Sort',
  PPLM_REMOVED_USERS_SEAT_TYPE_FILTERED: 'App.PeopleMgmt.RemovedUsers.SeatType.Filter',
  PPLM_REMOVED_USERS_OWNED_DOCS_SORTED: 'App.PeopleMgmt.RemovedUsers.OwnedDocuments.Sort',

  TEAM_INVITES_SENT: 'App.Team.Invites.Sent',

  TSET_VIEWED: 'App.TeamSettings.Viewed',
  TSET_ENT_DEMO: 'App.TeamSettings.ScheduleEnterpriseDemo.Selected',
  TSET_PRINCIPAL_VIEWED: 'App.TeamSettings.PrincipalSettings.Viewed',
  TSET_PRINCIPAL_CLOSED: 'App.TeamSettings.PrincipalSettings.Closed',
  TSET_PRINCIPAL_FAILED: 'App.TeamSettings.PrincipalSettings.Failed',
  TSET_PRINCIPAL_NAME: 'App.TeamSettings.PrincipalSettingsName.Succeeded',
  TSET_PRINCIPAL_DOMAIN: 'App.TeamSettings.PrincipalSettingsDomain.Succeeded',
  TSET_TEAM_ICON_VIEWED: 'App.TeamSettings.TeamIcon.Viewed',
  TSET_TEAM_ICON_CLOSED: 'App.TeamSettings.TeamIcon.Closed',
  TSET_TEAM_ICON_UPLOADED: 'App.TeamSettings.TeamIconUpload.Succeeded',
  TSET_TEAM_ICON_REPLACED: 'App.TeamSettings.TeamIconReplacement.Succeeded',
  TSET_TEAM_ICON_REMOVED: 'App.TeamSettings.TeamIconRemoved.Succeeded',
  TSET_TEAM_ICON_FAILED: 'App.TeamSettings.TeamIcon.Failed',
  TSET_TIMINGOUT_VIEWED: 'App.TeamSettings.TimingOut.Viewed',
  TSET_TIMINGOUT_CLOSED: 'App.TeamSettings.TimingOut.Closed',
  TSET_TIMINGOUT_FAILED: 'App.TeamSettings.TimingOut.Failed',
  TSET_TIMINGOUT_SUCCESS: 'App.TeamSettings.TimingOut.Succeeded',
  TSET_ENT_TRIAL_SELECTED: 'App.TeamSettings.ScheduleEnterpriseTrial.Selected',

  TSET_OPENENROLL_VIEWED: 'App.TeamSettings.OpenEnrollment.Viewed',
  TSET_OPENENROLL_UPDATED: 'App.TeamSettings.OpenEnrollment.Updated',
  TSET_SSO_VIEWED: 'App.TeamSettings.SSOSetting.Viewed',
  TSET_SSO_CLOSED: 'App.TeamSettings.SSOSetting.Closed',
  TSET_SSO_FAILED: 'App.TeamSettings.SSOSetting.Failed',
  TSET_SSO_UPDATED: 'App.TeamSettings.SSOSetting.Updated',
  TSET_PASSWORDS_VIEWED: 'App.TeamSettings.Passwords.Viewed',
  TSET_PASSWORDS_CLOSED: 'App.TeamSettings.Passwords.Closed',
  TSET_PASSWORDS_FAILED: 'App.TeamSettings.Passwords.Failed',
  TSET_PASSWORDS_UPDATED: 'App.TeamSettings.Passwords.Updated',

  TSSE_CAPTURED: 'App.TeamSharingSettings.Captured',
  TSSE_CLOSED: 'App.TeamSharingSettings.Closed',
  TSSE_CONFIRMATION_MODAL_CANCELED: 'App.TeamSharingSettings.ConfirmationModal.Canceled',
  TSSE_CONFIRMATION_MODAL_CONTINUED: 'App.TeamSharingSettings.ConfirmationModal.Continued',
  TSSE_CONFIRMATION_MODAL_VIEWED: 'App.TeamSharingSettings.ConfirmationModal.Viewed',
  TSSE_UPDATE_SELECTED: 'App.TeamSharingSettings.Update.Selected',
  TSSE_UPGRADE_BLOCKER_SELECTED: 'App.TeamSharingSettings.UpgradeBlocker.Selected',

  NAVI_SECONDARY_SELECTED: 'App.Navigation.SecondaryNav.Selected',

  ACCS_VIEWED: 'App.AccountSettings.Viewed',
  ACCS_CLOSED: 'App.AccountSettings.Closed',
  ACCS_UNSAVED_CLOSED: 'App.AccountSettings.Unsaved.Closed',
  ACCS_NAME_CHANGED: 'App.AccountSettings.NameChange.Succeeded',
  ACCS_AVATAR_UPLOADED: 'App.AccountSettings.UploadAvatar.Succeeded',
  ACCS_AVATAR_REMOVED: 'App.AccountSettings.RemoveAvatar.Succeeded',
  ACCS_PASSWORD_CHANGED: 'App.AccountSettings.PasswordUpdate.Succeeded',
  ACCS_NEW_TEAM: 'App.AccountSettings.NewTeam.Selected',
  ACCS_SWITCH_TEAM: 'App.AccountSettings.SwitchTeams.Selected',
  ACCS_JOIN_TEAM: 'App.AccountSettings.TeamJoin.Selected',
  ACCS_NOTIFICATION_CHANGED: 'App.AccountSettings.NotificationSetting.Changed',
  ACCS_CONFIGURE_2FA: 'App.AccountSettings.2FAConfigure.Selected',

  ALOG_CSV_DOWNLOADED: 'App.AuditLog.CSV.Downloaded',
  ALOG_VIEWED: 'App.AuditLog.Viewed',

  // User Groups
  UG_CREATED: 'App.PeopleMgmt.UserGroup.Created',
  UG_DELETED: 'App.PeopleMgmt.UserGroup.Deleted',
  UG_UPDATED: 'App.PeopleMgmt.UserGroup.Updated',

  // Document transfer
  DC_TEAM_LIST_VIEWED: 'App.DocumentTransfer.TeamList.Viewed',
  DC_TEAM_SELECTED: 'App.DocumentTransfer.Team.Selected',
  DC_TEAM_CONFIRMED: 'App.DocumentTransfer.Team.Confirmed',
  DC_CANCELLED: 'App.DocumentTransfer.Cancelled',
  DC_SUCCEEDED: 'App.DocumentTransfer.Team.Succeeded',
  DC_FAILED: 'App.DocumentTransfer.Team.Failed',

  // Orphaned Docs
  OD_TRANSFER_SELECTED: 'App.PeopleMgmt.RemovedUsers.TransferDocuments.Selected',
  OD_DELETE_SELECTED: 'App.PeopleMgmt.RemovedUsers.DeleteDocuments.Selected',
  OD_TRANSFER_CONFIRMED: 'App.PeopleMgmt.RemovedUsers.TransferDocuments.Confirmed',
  OD_DELETE_CONFIRMED: 'App.PeopleMgmt.RemovedUsers.DeleteDocuments.Confirmed',

  // Delete Team
  DELETE_TEAM_VIEWED: 'App.TeamSettings.TeamDeletion.Viewed',
  DELETE_TEAM_CLOSED: 'App.TeamSettings.TeamDeletion.Closed',
  DELETE_TEAM_FAILED: 'App.TeamSettings.TeamDeletion.Failed',
  DELETE_TEAM_SUCCEEDED: 'App.TeamSettings.TeamDeletion.Succeeded'
}

const track = (...args: any) => {
  try {
    if (window.measure && window.measure.collect) {
      window.measure.collect(...args)
    }
  } catch (e) {
    /* No reason to throw errors for this type of actions */
  }
}

/* --- All Events --- */

// +++ People Management +++
export const trackPeopleViewed = (pathname: string) => {
  if (!pathname) {
    throw new TypeError('pathname should be defined')
  }

  if (pathname.indexOf(TEAMS_PATH) === -1) {
    return
  }
  track(EVENTS.PPLM_TAB_VIEWED, { tab: pathname.slice(TEAMS_PATH.length) })
}
// args: user_id, new_role, old_role
export const trackPeopleRoleChange = (...args: any) => {
  track(EVENTS.PPLM_ROLE_CHANGED, ...args)
}
export const trackPeopleInviteViewed = () => {
  track(EVENTS.PPLM_INVITE_VIEWED)
}
export const trackPeopleInviteClosed = () => {
  track(EVENTS.PPLM_INVITE_CLOSED)
}
export const trackPeopleInviteSelected = () => {
  track(EVENTS.PPLM_INVITE_SELECTED)
}
export const trackPeopleInviteBack = () => {
  track(EVENTS.PPLM_INVITE_BACK)
}
export const trackPeopleInviteFailed = () => {
  track(EVENTS.PPLM_INVITE_FAILED)
}
export const trackPeopleInviteConfirmClosed = () => {
  track(EVENTS.PPLM_INVITE_CONFIRM_CLOSED)
}
export const trackPeopleInviteConfirmSubmitted = () => {
  track(EVENTS.PPLM_INVITE_CONFIRM_SUBMITTED)
}
export const trackPeopleInviteRemoved = () => {
  track(EVENTS.PPLM_INVITE_REMOVED)
}
export const trackPeopleInviteRoleToAdmin = () => {
  track(EVENTS.PPLM_INVITE_ROLE_TO_ADMIN)
}
export const trackPeopleInviteRoleToGuest = () => {
  track(EVENTS.PPLM_INVITE_ROLE_TO_GUEST)
}
export const trackPeopleInviteRoleToOwner = () => {
  track(EVENTS.PPLM_INVITE_ROLE_TO_OWNER)
}
export const trackPeopleResendInvite = () => {
  track(EVENTS.PPLM_RESEND_INVITE)
}
export const trackPeopleResendInviteFailed = () => {
  track(EVENTS.PPLM_RESEND_INVITE_FAILED)
}
export const trackPeopleRemoveInvite = () => {
  track(EVENTS.PPLM_REMOVE_INVITE)
}
export const trackPeopleRemoveUser = () => {
  track(EVENTS.PPLM_REMOVE_USER)
}
export const trackPeopleSearchSelected = (entity: any) => {
  if (!entity) {
    throw new TypeError('entity should be defined')
  }

  track(EVENTS.PPLM_SEARCH_SELECTED, { tab: entity })
}
export const trackPeopleTransferPO = () => {
  track(EVENTS.PPLM_TRANS_PO)
}
export const trackPeopleTransferPOFailed = () => {
  track(EVENTS.PPLM_TRANS_PO_FAILED)
}
export const trackPeopleRemovedUserInvite = () => {
  track(EVENTS.PPLM_REMOVED_USER_INVITE)
}
export const trackPeopleSeatTypeChanged = ({
  action,
  newSeatType,
  oldSeatType,
  userId
}: {
  action: string
  newSeatType: number
  oldSeatType: number
  userId: number
}) => {
  track(EVENTS.PPLM_BILLING_TYPE_CHANGED, {
    action,
    new_seat_type: newSeatType,
    old_seat_type: oldSeatType,
    targeted_userid: userId
  })
}

// +++ Team +++
export const trackTeamInvitesSent = (invitesSent: number) => {
  if (!invitesSent || typeof invitesSent !== 'number') {
    throw new TypeError('invitesSent should be a number')
  }
  track(EVENTS.TEAM_INVITES_SENT, { invitesSent })
}

// +++ Team Settings +++
export const trackSettingsViewed = () => {
  track(EVENTS.TSET_VIEWED)
}
export const trackSettingsScheduleEntDemo = () => {
  track(EVENTS.TSET_ENT_DEMO)
}
export const trackSettingsPrincipal = () => {
  track(EVENTS.TSET_PRINCIPAL_VIEWED)
}
export const trackSettingsPrincipalClosed = () => {
  track(EVENTS.TSET_PRINCIPAL_CLOSED)
}
export const trackSettingsPrincipalFailed = () => {
  track(EVENTS.TSET_PRINCIPAL_FAILED)
}
export const trackSettingsPrincipalName = () => {
  track(EVENTS.TSET_PRINCIPAL_NAME)
}
export const trackSettingsPrincipalDomain = () => {
  track(EVENTS.TSET_PRINCIPAL_DOMAIN)
}
export const trackSettingsTeamIcon = () => {
  track(EVENTS.TSET_TEAM_ICON_VIEWED)
}
export const trackSettingsTeamIconClosed = () => {
  track(EVENTS.TSET_TEAM_ICON_CLOSED)
}
export const trackSettingsTeamIconUploaded = () => {
  track(EVENTS.TSET_TEAM_ICON_UPLOADED)
}
export const trackSettingsTeamIconReplaced = () => {
  track(EVENTS.TSET_TEAM_ICON_REPLACED)
}
export const trackSettingsTeamIconRemoved = () => {
  track(EVENTS.TSET_TEAM_ICON_REMOVED)
}
export const trackSettingsTeamIconFailed = () => {
  track(EVENTS.TSET_TEAM_ICON_FAILED)
}
export const trackSettingsTimingout = () => {
  track(EVENTS.TSET_TIMINGOUT_VIEWED)
}
export const trackSettingsTimingoutClosed = () => {
  track(EVENTS.TSET_TIMINGOUT_CLOSED)
}
export const trackSettingsTimingoutFailed = () => {
  track(EVENTS.TSET_TIMINGOUT_FAILED)
}
export const trackSettingsTimingoutSuccess = () => {
  track(EVENTS.TSET_TIMINGOUT_SUCCESS)
}
export const trackSettingsOpenEnrollment = () => {
  track(EVENTS.TSET_OPENENROLL_VIEWED)
}
// args: old_settings, new_settings
export const trackSettingsOpenEnrollmentUpdated = (oldSetting: any, newSetting: any) => {
  if (!oldSetting || !newSetting) {
    throw new TypeError('old and new setting should be defined')
  }
  track(EVENTS.TSET_OPENENROLL_UPDATED, { old_setting: oldSetting, new_setting: newSetting })
}
export const trackSettingsSSO = () => {
  track(EVENTS.TSET_SSO_VIEWED)
}
export const trackSettingsSSOClosed = () => {
  track(EVENTS.TSET_SSO_CLOSED)
}
export const trackSettingsSSOFailed = () => {
  track(EVENTS.TSET_SSO_FAILED)
}
export const trackSettingsSSOUpdated = (oldSetting: any, newSetting: any) => {
  if (!oldSetting || !newSetting) {
    throw new TypeError('old and new setting should be defined')
  }

  if (oldSetting.isActive === newSetting.isActive) {
    return
  }

  const { samlSettings } = oldSetting
  const newSaml = newSetting.samlSettings

  track(EVENTS.TSET_SSO_UPDATED, {
    old_setting: {
      RequireForAllMembers: oldSetting.isActive,
      name: samlSettings.name,
      'sign-inURL': samlSettings.idpLoginURL,
      'sign-outURL': samlSettings.idpLogoutURL,
      SAMLCertificate: samlSettings.certificate,
      NameIDFormat: samlSettings.nameIDFormat,
      HASHAlgorithm: samlSettings.hashAlgorithm,
      SSOButtonLabel: samlSettings.label
    },
    new_setting: {
      RequireForAllMembers: newSetting.isActive,
      name: newSaml.name,
      'sign-inURL': newSaml.idpLoginURL,
      'sign-outURL': newSaml.idpLogoutURL,
      SAMLCertificate: newSaml.certificate,
      NameIDFormat: newSaml.nameIDFormat,
      HASHAlgorithm: newSaml.hashAlgorithm,
      SSOButtonLabel: newSaml.label
    }
  })
}
export const trackSettingsPasswords = () => {
  track(EVENTS.TSET_PASSWORDS_VIEWED)
}
export const trackSettingsPasswordsClosed = () => {
  track(EVENTS.TSET_PASSWORDS_CLOSED)
}
export const trackSettingsPasswordsFailed = () => {
  track(EVENTS.TSET_PASSWORDS_FAILED)
}
export const trackSettingsPasswordsUpdated = (oldSetting: any, newSetting: any) => {
  if (!oldSetting || !newSetting) {
    throw new TypeError('old and new setting should be defined')
  }

  track(EVENTS.TSET_PASSWORDS_UPDATED, {
    old_setting: {
      enablePasswordExpiration: oldSetting.enablePasswordExpiration,
      enforcePasswordComplexity: oldSetting.enablePasswordComplexity,
      minPasswordlength: oldSetting.minimumPasswordLength,
      numberOfDays: oldSetting.passwordExpirationDays,
      numberOfPasswordtoRemember: oldSetting.rememberNumPasswords,
      preventPasswordReuse: oldSetting.enablePreventPasswordReuse
    },
    new_setting: {
      enablePasswordExpiration: newSetting.enablePasswordExpiration,
      enforcePasswordComplexity: newSetting.enablePasswordComplexity,
      minPasswordlength: newSetting.minimumPasswordLength,
      numberOfDays: newSetting.passwordExpirationDays,
      numberOfPasswordtoRemember: newSetting.rememberNumPasswords,
      preventPasswordReuse: newSetting.enablePreventPasswordReuse
    }
  })
}

// NOTE: Not listed in the spreadsheet
export const trackSettingsEntTrialSelected = () => {
  track(EVENTS.TSET_ENT_TRIAL_SELECTED)
}
// +++ Team Sharing Settings +++
// args: allowPublicLinkAccess, allowTeamInvitesByMembers,
// allowPrototypeShareLinksWithoutPassword, defaultLinkAccess
export const trackSharingCaptured = (...args: any) => {
  track(EVENTS.TSSE_CAPTURED, ...args)
}

export const trackSharingClosed = () => {
  track(EVENTS.TSSE_CLOSED)
}

export const trackSharingConfirmationModalCanceled = (type: string) => {
  if (!type || typeof type !== 'string') {
    throw new TypeError('type should be a string')
  }
  track(EVENTS.TSSE_CONFIRMATION_MODAL_CANCELED, { type })
}

export const trackSharingConfirmationModalContinued = (type: string) => {
  if (!type || typeof type !== 'string') {
    throw new TypeError('type should be a string')
  }
  track(EVENTS.TSSE_CONFIRMATION_MODAL_CONTINUED, { type })
}

export const trackSharingConfirmationModalViewed = (type: string) => {
  if (!type || typeof type !== 'string') {
    throw new TypeError('type should be a string')
  }
  track(EVENTS.TSSE_CONFIRMATION_MODAL_VIEWED, { type })
}

export const trackSharingUpdateSelected = () => {
  track(EVENTS.TSSE_UPDATE_SELECTED)
}

export const trackSharingUpgradeBlockerSelected = (plan: any) => {
  if (!plan) {
    throw new TypeError('plan should be defined')
  }
  track(EVENTS.TSSE_UPGRADE_BLOCKER_SELECTED, { plan })
}

// +++ Navigation +++
export const trackNavigationSecondarySelected = (secondaryNavClick?: any) => {
  if (!secondaryNavClick) {
    throw new TypeError('secondaryNavClick should be defined')
  }
  track(EVENTS.NAVI_SECONDARY_SELECTED, { secondaryNavClick })
}

// +++ Account Settings +++
export const trackAccountsViewed = () => {
  track(EVENTS.ACCS_VIEWED)
}
export const trackAccountsClosed = () => {
  track(EVENTS.ACCS_CLOSED)
}
export const trackAccountsUnsavedClosed = () => {
  track(EVENTS.ACCS_UNSAVED_CLOSED)
}
export const trackAccountsNameChanged = () => {
  track(EVENTS.ACCS_NAME_CHANGED)
}
export const trackAccountsAvatarUploaded = () => {
  track(EVENTS.ACCS_AVATAR_UPLOADED)
}
export const trackAccountsAvatarRemoved = () => {
  track(EVENTS.ACCS_AVATAR_REMOVED)
}
export const trackAccountsPasswordChanged = () => {
  track(EVENTS.ACCS_PASSWORD_CHANGED)
}
export const trackAccountsNewTeam = () => {
  track(EVENTS.ACCS_NEW_TEAM)
}
export const trackAccountsSwitchTeam = () => {
  track(EVENTS.ACCS_SWITCH_TEAM)
}
export const trackAccountsJoinTeam = () => {
  track(EVENTS.ACCS_JOIN_TEAM)
}
export const trackAccountsNotificationChanged = (oldSetting: any, newSetting: any) => {
  if (typeof oldSetting !== 'number' || typeof newSetting !== 'number') {
    throw new TypeError('old and new setting should be defined and type number')
  }
  track(EVENTS.ACCS_NOTIFICATION_CHANGED, { old_setting: oldSetting, new_setting: newSetting })
}
export const trackAccountsConfigure2FA = (status: string) => {
  if (typeof status !== 'string') {
    throw new TypeError('status should be defined and type string')
  }
  track(EVENTS.ACCS_CONFIGURE_2FA, { status })
}

export const trackAuditLogViewed = () => {
  track(EVENTS.ALOG_VIEWED)
}

export const trackAuditLogCSVDownloaded = (source: any) => {
  track(EVENTS.ALOG_CSV_DOWNLOADED, { source })
}

// +++ User Groups +++
export const trackUserGroupCreated = (...args: any) => {
  track(EVENTS.UG_CREATED, ...args)
}

export const trackUserGroupDeleted = (...args: any) => {
  track(EVENTS.UG_DELETED, ...args)
}

export const trackUserGroupUpdated = (...args: any) => {
  track(EVENTS.UG_UPDATED, ...args)
}

// +++ Document transfer +++
export const trackDocumentTransferTeamListViewed = (...args: any) => {
  track(EVENTS.DC_TEAM_LIST_VIEWED, ...args)
}

export const trackDocumentTransferTeamSelected = (...args: any) => {
  track(EVENTS.DC_TEAM_SELECTED, ...args)
}

export const trackDocumentTransferTeamConfirmed = (...args: any) => {
  track(EVENTS.DC_TEAM_CONFIRMED, ...args)
}

export const trackDocumentTransferCancelled = (...args: any) => {
  track(EVENTS.DC_CANCELLED, ...args)
}

export const trackDocumentTransferSucceeded = (...args: any) => {
  track(EVENTS.DC_SUCCEEDED, ...args)
}

export const trackDocumentTransferFailed = (...args: any) => {
  track(EVENTS.DC_FAILED, ...args)
}

// +++ Orphaned Docs +++
export const trackOrphanedDocsTransferSelected = () => {
  track(EVENTS.OD_TRANSFER_SELECTED)
}

export const trackOrphanedDocsDeleteSelected = () => {
  track(EVENTS.OD_DELETE_SELECTED)
}

export const trackOrphanedDocsTransferConfirmed = (data: {
  documentCount: number
  targetUserId: string
  targetUserRole: string
}) => {
  track(EVENTS.OD_TRANSFER_CONFIRMED, data)
}

export const trackOrphanedDocsDeleteConfirmed = (data: { documentCount: number }) => {
  track(EVENTS.OD_DELETE_CONFIRMED, data)
}

// +++ Delete Team +++
export const deleteTeamViewed = (billingPlan: string) => {
  track(EVENTS.DELETE_TEAM_VIEWED, {
    billing_plan: billingPlan
  })
}
export const deleteTeamClosed = (billingPlan: string) => {
  track(EVENTS.DELETE_TEAM_CLOSED, {
    billing_plan: billingPlan
  })
}
export const deleteTeamFailed = (billingPlan: string, failureReason: string) => {
  track(EVENTS.DELETE_TEAM_FAILED, {
    billing_plan: billingPlan,
    failure_reason: failureReason
  })
}
export const deleteTeamSucceeded = (
  billingPlan: string,
  exitSurveyRadioOption?: string,
  exitSurveyOpeText?: string
) => {
  track(EVENTS.DELETE_TEAM_SUCCEEDED, {
    billing_plan: billingPlan,
    exit_survey_radio_option: exitSurveyRadioOption,
    exit_survey_open_text: exitSurveyOpeText
  })
}

// +++ Sorting and filtering +++
export const trackGuestsLastSeenFiltered = (value: string) => {
  track(EVENTS.PPLM_GUESTS_LAST_SEEN_FILTERED, { value })
}

export const trackGuestsLastSeenSorted = (value: string) => {
  track(EVENTS.PPLM_GUESTS_LAST_SEEN_SORTED, { value })
}

export const trackGuestsSeatTypeFiltered = (value: string) => {
  track(EVENTS.PPLM_GUESTS_SEAT_TYPE_FILTERED, { value })
}

export const trackGuestsStatusFiltered = (value: string) => {
  track(EVENTS.PPLM_GUESTS_STATUS_FILTERED, { value })
}

export const trackInvitationsDateFiltered = (value: string) => {
  track(EVENTS.PPLM_INVITATIONS_DATE_FILTERED, { value })
}

export const trackInvitationsDateSorted = (value: string) => {
  track(EVENTS.PPLM_INVITATIONS_DATE_SORTED, { value })
}

export const trackInvitationsSeatTypeFiltered = (value: string) => {
  track(EVENTS.PPLM_INVITATIONS_SEAT_TYPE_FILTERED, { value })
}

export const trackMembersLastSeenFiltered = (value: string) => {
  track(EVENTS.PPLM_MEMBERS_LAST_SEEN_FILTERED, { value })
}

export const trackMembersLastSeenSorted = (value: string) => {
  track(EVENTS.PPLM_MEMBERS_LAST_SEEN_SORTED, { value })
}

export const trackMembersSeatTypeFiltered = (value: string) => {
  track(EVENTS.PPLM_MEMBERS_SEAT_TYPE_FILTERED, { value })
}

export const trackRemovedUsersDateSorted = (value: string) => {
  track(EVENTS.PPLM_REMOVED_USERS_DATE_SORTED, { value })
}

export const trackRemovedUsersSeatTypeFiltered = (value: string) => {
  track(EVENTS.PPLM_REMOVED_USERS_SEAT_TYPE_FILTERED, { value })
}

export const trackRemovedUsersOwnedDocumentsSorted = (value: string) => {
  track(EVENTS.PPLM_REMOVED_USERS_OWNED_DOCS_SORTED, { value })
}

/* ----------------- */

const hasRequiredMethods = () => {
  const requiredAnalyticsMethods = ['initializeSegment', 'collect', 'page', 'identifyUser']
  return requiredAnalyticsMethods.every(methodName => {
    return typeof window.measure[methodName] === 'function'
  })
}

if (!window.measure || !hasRequiredMethods()) {
  console.error('Measure unavailable on window.') // eslint-disable-line no-console
}

try {
  window.measure.initializeSegment()
  window.measure.identifyUser()
} catch (e) {
  /* No reason to throw errors for this type of actions */
}
