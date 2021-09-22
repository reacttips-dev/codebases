import { createSelector } from 'reselect'
import { AppState } from '..'
import { seatTypesDictionary } from '../../components/dialogs/ChangeSeatTypeDialog'
import arrayToObject from '../../helpers/arrayToObj'
import { selectIsMultiSeatPlan, getSeatById, selectSeats } from '../billing'
import { Invitation } from '../invitations'
import { Member } from '../members'
import { RemovedUser } from '../removedUsers'
import { UserGroup } from '../userGroups'
import { formatDate } from './exports.helpers'

export const selectAllUsersExport = (state: AppState) => {
  return state.exports.allUsers
}

export const selectIsAllUsersLoaded = (state: AppState) => {
  return state.exports.allUsers.status === 'loaded'
}

export const selectAllUsersExportData = createSelector(
  selectAllUsersExport,
  selectIsMultiSeatPlan,
  selectIsAllUsersLoaded,
  selectSeats,
  (allUsersExport, isMultiSeatPlan, isLoaded, seats) => {
    if (!isLoaded) {
      return null
    }

    const { data } = allUsersExport
    const { allUsers, loginActivity, documentCounts, userGroups } = data

    if (!allUsers || allUsers.length === 0) {
      return null
    }

    const loginActivityByUser = arrayToObject(loginActivity, 'userId')

    const seatTypeHeading = isMultiSeatPlan ? ',"Seat Type"' : ''
    let seatType = ''

    let csv = `"ID","Name","Email","Role"${seatTypeHeading},"Documents Created","Last IP","Last Seen","User Added","User Groups"\n`
    let documentCount = 'N/A'

    allUsers.forEach((tm: Member) => {
      if (isMultiSeatPlan && tm.seatTypeID) {
        const seatTypeName = getSeatById(seats, tm.seatTypeID)
        seatType = seatTypeName ? `,"${seatTypesDictionary[seatTypeName].label}"` : ','
      }

      if (documentCounts[tm.userID] !== undefined) {
        documentCount = documentCounts[tm.userID]?.toString() || '0'
      }

      let lastIp = ''
      let lastSeenActive = ''

      if (loginActivityByUser && loginActivityByUser[tm.userID] !== undefined) {
        lastIp = loginActivityByUser[tm.userID].lastSeenIp || ''
        lastSeenActive = loginActivityByUser[tm.userID].lastActiveAt || ''
      }

      let userGroupCount = 0
      if (userGroups !== undefined) {
        userGroups.forEach((ug: UserGroup) => {
          if (ug.userIDs.includes(tm.userID)) {
            userGroupCount += 1
          }
        })
      }

      csv += `"${tm.userID}","${tm.name}","${tm.email}",`
      csv += `"${tm.role.name}"${seatType},"${documentCount}","${lastIp}",`
      csv += `"${formatDate(lastSeenActive)}","${formatDate(tm.createdAt)}",`
      csv += `"${userGroupCount}"\n`
    })

    return csv
  }
)

export const selectPendingInvitations = (state: AppState) => {
  return state.exports.pendingInvitations.data
}

export const selectIsPendingInvitationsLoaded = (state: AppState) => {
  return state.exports.pendingInvitations.status === 'loaded'
}

export const selectInvitationsExport = createSelector(
  [
    selectPendingInvitations,
    selectIsPendingInvitationsLoaded,
    selectIsMultiSeatPlan,
    selectSeats
  ],
  (invitations, isLoaded, isMultiSeatPlan, seats) => {
    if (!isLoaded || invitations === undefined) {
      return null
    }

    const seatTypeHeading = isMultiSeatPlan ? ',"Invite Seat Type"' : ''

    let csv = `"Sender","Last sent","Sent to","Invite Role"${seatTypeHeading}\n`

    invitations.forEach((invite: Invitation) => {
      let seatType = ''

      if (isMultiSeatPlan && invite.seatTypeID) {
        const seatTypeName = getSeatById(seats, invite.seatTypeID)
        seatType = seatTypeName ? `,"${seatTypesDictionary[seatTypeName].label}"` : ','
      }

      if (invite.createdBy && invite.createdBy.email) {
        csv += `"${invite.createdBy.email}",`
      } else {
        csv += `"N/A",`
      }

      csv += `"${formatDate(invite.updatedAt)}",`
      csv += `"${invite.email}","${invite.role.name}"${seatType}\n`
    })

    return csv
  }
)

export const selectUsersByUserGroups = (state: AppState) => {
  return state.exports.usersByUserGroups
}

export const selectIsUsersByUserGroupsLoaded = (state: AppState) => {
  return state.exports.usersByUserGroups.status === 'loaded'
}

export const selectUsersByUserGroupsExport = createSelector(
  [
    selectUsersByUserGroups,
    selectIsUsersByUserGroupsLoaded,
    selectIsMultiSeatPlan,
    selectSeats
  ],
  (usersByUserGroupsData, isLoaded, isMultiSeatPlan, seats) => {
    if (!isLoaded || usersByUserGroupsData === undefined) {
      return null
    }

    const { data } = usersByUserGroupsData
    const { allUsers, loginActivity, documentCounts, userGroups } = data

    if (!allUsers || allUsers.length === 0) {
      return null
    }

    const loginActivityByUser = arrayToObject(loginActivity, 'userId')
    const allUsersByUserId = arrayToObject(allUsers, 'userID')

    const seatTypeHeading = isMultiSeatPlan ? ',"Seat Type"' : ''
    let seatType = ''

    let csv = `"User group","ID","Name","Email","Role"${seatTypeHeading},"Documents created",`
    csv += `"Last IP","Last Seen","User Added"\n`

    let documentCount = 'N/A'

    userGroups.forEach((userGroup: UserGroup) => {
      userGroup.userIDs.forEach((userID: number) => {
        const user = allUsersByUserId[userID]
        const docs = documentCounts[userID]
        const activity = loginActivityByUser[userID]

        if (isMultiSeatPlan && user.seatTypeID) {
          const seatTypeName = getSeatById(seats, user.seatTypeID)
          seatType = seatTypeName ? `,"${seatTypesDictionary[seatTypeName].label}"` : ','
        }

        if (docs !== undefined) {
          documentCount = docs.toString() ?? '0'
        }

        let lastIp = ''
        let lastSeenActive = ''

        if (loginActivityByUser && activity !== undefined) {
          lastIp = activity.lastSeenIp || ''
          lastSeenActive = activity.lastActiveAt || ''
        }

        csv += `"${userGroup.name}","${userGroup.userGroupID}","${user.name}",`
        csv += `"${user.email}","${user.role.name}"${seatType},"${documentCount}",`
        csv += `"${lastIp}","${formatDate(lastSeenActive)}","${formatDate(user.createdAt)}"\n`
      })
    })
    return csv
  }
)

export const selectRemovedUsers = (state: AppState) => {
  return state.exports.removedUsers
}

export const selectIsRemovedUsersLoaded = (state: AppState) => {
  return state.exports.removedUsers.status === 'loaded'
}

export const selectRemovedUsersExport = createSelector(
  [selectRemovedUsers, selectIsRemovedUsersLoaded, selectIsMultiSeatPlan, selectSeats],
  (removedUsersData, isLoaded, isMultiSeatPlan, seats) => {
    if (!isLoaded || removedUsersData === undefined) {
      return null
    }

    const { data } = removedUsersData
    const { removedUsers, loginActivity } = data
    // N.B:
    // loginActivity is empty for users removed before the
    // introduction of the last seen column

    if (!removedUsers || removedUsers.length === 0) {
      return null
    }

    const loginActivityByUser = arrayToObject(loginActivity, 'userId')

    const seatTypeHeading = isMultiSeatPlan ? ',"Seat Type"' : ''

    let csv = `"ID","Name","Email","Role"${seatTypeHeading},"Date","Admin","Last IP","Last Seen","User Added"\n`

    removedUsers.forEach((removedUser: RemovedUser) => {
      let seatType = ''

      if (isMultiSeatPlan && removedUser.seatTypeID) {
        const seatTypeName = getSeatById(seats, removedUser.seatTypeID)
        seatType = seatTypeName ? `,"${seatTypesDictionary[seatTypeName].label}"` : ','
      }
      const admin = removedUser.removedByUser ? removedUser.removedByUser.email : 'N/A'

      let lastIp = ''
      let lastSeenActive = ''

      if (loginActivityByUser && loginActivityByUser[removedUser.userID] !== undefined) {
        lastIp = loginActivityByUser[removedUser.userID].lastSeenIp || ''
        lastSeenActive = loginActivityByUser[removedUser.userID].lastActiveAt || ''
      }

      csv += `"${removedUser.userID}","${removedUser.name}","${removedUser.email}",`
      csv += `"${removedUser.roleName}"${seatType},`
      csv += `"${formatDate(removedUser.endedAt)}","${admin}",`
      csv += `"${lastIp}","${formatDate(lastSeenActive)}",`
      csv += `"${formatDate(removedUser.startedAt)}"\n`
    })

    return csv
  }
)
