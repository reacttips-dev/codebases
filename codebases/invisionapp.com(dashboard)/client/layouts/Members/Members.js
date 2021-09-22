import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'

import styled from 'styled-components'
import { Animation, Padded } from '@invisionapp/helios'

import {
  canManageRow,
  changeRole,
  changeSeatType,
  fetchAllMembers,
  isMyself,
  removeUserFromStore,
  selectBulkEditableMembers,
  selectBulkEditableDisplayedMembers,
  selectDisplayedMembers,
  selectIsLoaded as selectMembersAreLoaded,
  selectIsLoading as selectMembersAreLoading,
  selectMembersAndGuestsArray,
  selectMemberIds,
  selectProcessedMembersCount
} from '../../stores/members'
import { selectIsMultiSeatPlan } from '../../stores/billing'
import { selectBulkIds, toggleBulkItems } from '../../stores/bulkItems'
import { selectPermission } from '../../stores/permissions'
import { selectUser, selectCanTransferOwnership } from '../../stores/user'
import {
  isRoleBulkEditable,
  selectAllRoles,
  getRoleNameById,
  selectAllowedRoles,
  roleTypes
} from '../../stores/roles'
import { fetchLastSeen, selectLastSeen, selectIsLastSeenLoading } from '../../stores/lastSeen'
import {
  fetchUserDocumentCounts,
  selectUserDocumentCounts
} from '../../stores/userDocumentCounts'

import useToast from '../../hooks/useToast'
import { capitalizeFirstLetter } from '../../helpers/string'
import ModalPortal from '../../components/Modal/ModalPortal'
import Modal from '../../components/Modal'
import NotFoundCard from '../../components/tables/NotFoundCard'
import DateFilterDropdown from '../../components/tables/DateFilterDropdown'
import LastSeen from '../../components/tables/LastSeen'
import SeatType from '../../components/tables/SeatType'
import BulkBar from '../../components/bulk/BulkBar'
import Permission from '../../components/Permission'
import { RemoveUserDialog } from './RemoveUserDialog'
import { ChangeRoleDialog } from '../../components/dialogs/ChangeRoleDialog'
import { ChangeSeatTypeDialog } from '../../components/dialogs/ChangeSeatTypeDialog'
import { NewTable } from '../../components/tables/NewTable'
import { LoadingUserWithAvatar, LoadingLine } from '../../components/tables/LoadingRow'
import Search from './Search'
import Pagination from '../../components/tables/Pagination'
import {
  trackPeopleRemoveUser,
  trackPeopleRoleChange,
  trackPeopleSeatTypeChanged
} from '../../helpers/analytics'
import SeatTypeFilterDropdown from '../../components/tables/SeatTypeFilterDropdown'
import { RowProfileInfo } from '../../components/RowProfileInfo'
import {
  selectMemberSortingFilteringFlag,
  selectShowSeatTypeFlag,
  selectTransferDocsWhenRemovedFlag
} from '../../stores/featureFlags'

const Members = props => {
  const { children, portalOpened, handleModalClose, handleModalBack } = props

  const { successToast, errorToast } = useToast()

  // --- Selectors ---
  const bulkItems = useSelector(selectBulkIds)
  const processedMembersCount = useSelector(selectProcessedMembersCount)
  const allMembers = useSelector(selectMembersAndGuestsArray)
  const allMembersIds = useSelector(selectMemberIds)
  const displayedMembers = useSelector(selectDisplayedMembers)
  const user = useSelector(selectUser)
  const lastSeen = useSelector(selectLastSeen)
  const isLastSeenLoading = useSelector(selectIsLastSeenLoading)
  const userDocumentCounts = useSelector(selectUserDocumentCounts)
  const allBulkEditableMembersOnly = useSelector(selectBulkEditableMembers)
  const bulkEditableMembersOnly = useSelector(selectBulkEditableDisplayedMembers)
  const canTransferOwnership = useSelector(selectCanTransferOwnership)
  const allowedRoles = useSelector(selectAllowedRoles)
  const allRoles = useSelector(selectAllRoles)
  const areMembersLoading = useSelector(selectMembersAreLoading)
  const areMembersLoaded = useSelector(selectMembersAreLoaded)
  const isMultiSeatPlan = useSelector(selectIsMultiSeatPlan)

  // --- Hooks ---
  const [removeFlow, setRemoveFlow] = useState({
    member: undefined,
    documentsAreTransferable: false
  })
  const [changeRoleFlow, setChangeRoleFlow] = useState({ member: undefined })
  const [changeSeatTypeFlow, setChangeSeatTypeFlow] = useState({ member: undefined })

  // --- Permissions ---
  // Multi Seat permissions and flag
  const canChangeSeatTypePermission = useSelector(state =>
    selectPermission(state, 'People.ChangeSeatType')
  )

  // --- Feature Flags ---
  const transferDocsWhenRemovedFlag = useSelector(selectTransferDocsWhenRemovedFlag)
  const phase1bFlag = useSelector(selectMemberSortingFilteringFlag)
  const showSeatTypeFlag = useSelector(selectShowSeatTypeFlag)

  // --- Compound Booleans ---
  const showSeatType = showSeatTypeFlag && isMultiSeatPlan
  const canChangeSeatType = canChangeSeatTypePermission && showSeatTypeFlag

  // --- Dispatchers ---
  const dispatch = useDispatch()

  const fetchAllMembersRequest = useCallback(
    options => {
      dispatch(fetchAllMembers(options))
    },
    [dispatch]
  )

  const fetchLastSeenRequest = useCallback(
    userIDs => {
      dispatch(fetchLastSeen(userIDs))
    },
    [dispatch]
  )

  const fetchUserDocumentCountsRequest = useCallback(
    userIDs => {
      dispatch(fetchUserDocumentCounts(userIDs))
    },
    [dispatch]
  )

  const changeRoleRequest = useCallback(
    ({ userId, newRoleId, onDone, onError }) => {
      dispatch(changeRole({ userId, newRoleId, onDone, onError }))
    },
    [dispatch]
  )

  const changeSeatTypeRequest = useCallback(
    ({ userId, seatTypeId, onDone, onError }) => {
      dispatch(changeSeatType({ userId, seatTypeId, onDone, onError }))
    },
    [dispatch]
  )

  const handleRemovedMember = member => {
    dispatch(removeUserFromStore(member.userID))
    trackPeopleRemoveUser({ action: 'single' })
  }
  const toggleBulkItemsRequest = (id, bulkType) => dispatch(toggleBulkItems(id, bulkType))

  useEffect(() => {
    if (displayedMembers.length === 0 || areMembersLoading) {
      return
    }

    const userIDs = displayedMembers.map(user => user.userID)
    fetchUserDocumentCountsRequest(userIDs)
  }, [areMembersLoaded, areMembersLoading, displayedMembers, fetchUserDocumentCountsRequest])

  const onChangeRole = useCallback(
    (member, newRole) => {
      changeRoleRequest({
        userId: member.userID,
        newRoleId: newRole,
        onDone: () => {
          if (newRole === roleTypes.GUEST) {
            fetchAllMembersRequest({ background: true, force: true })
          }
          successToast('The role has been successfully updated')
        },
        onError: () => {
          errorToast('Something went wrong, please try again')
        }
      })

      trackPeopleRoleChange({
        targeted_userid: member.userID,
        old_role: getRoleNameById(allRoles, member.roleID),
        new_role: newRole.role,
        action: 'single'
      })
    },
    [changeRoleRequest, allRoles, successToast, fetchAllMembersRequest, errorToast]
  )

  const onChangeSeatType = useCallback(
    (member, seatTypeId) => {
      changeSeatTypeRequest({
        userId: member.userID,
        seatTypeId,
        onDone: () => {
          successToast('The seat type has been successfully updated')
          trackPeopleSeatTypeChanged({
            userId: member.userID,
            oldSeatType: member.seatTypeID,
            newSeatType: seatTypeId,
            action: 'single'
          })
        },
        onError: () => errorToast('Something went wrong, please try again')
      })
    },
    [changeSeatTypeRequest, successToast, errorToast]
  )

  const handleRowClick = member => {
    if (isMyself(user, member)) {
      return
    }

    toggleBulkItemsRequest(member.userID, 'member')
  }

  const rowDisabledMessage = member => {
    if (!isRoleBulkEditable(member.roleID)) {
      const teamOwnerName = getRoleNameById(allRoles, member.roleID).toLowerCase()
      return `You can't select the team ${capitalizeFirstLetter(teamOwnerName)}`
    }
    if (isMyself(user, member)) {
      return `You can't select yourself`
    }
    return null
  }

  const isRowChecked = member =>
    rowDisabledMessage(member) === null ? bulkItems.includes(member.userID) : false

  const onBulkBarVisible = () => {
    fetchAllMembersRequest({ background: true })
  }

  const startRemovingUser = member => {
    // Only show the transfer documents UI if necessary
    const hasDocs = userDocumentCounts[member.userID]?.documentCount > 0
    const documentsAreTransferable = hasDocs && transferDocsWhenRemovedFlag

    setRemoveFlow({
      member,
      documentsAreTransferable
    })
  }

  const startChangingRole = member => setChangeRoleFlow({ member })

  const startChangingSeatType = member => setChangeSeatTypeFlow({ member })

  const closeDialog = () => {
    setRemoveFlow({
      member: undefined,
      documentsAreTransferable: false
    })
    setChangeRoleFlow({
      member: undefined
    })
    setChangeSeatTypeFlow({
      member: undefined
    })
  }

  const editRowItems = member => {
    // Owner: show transfer ownership only
    if (
      canTransferOwnership &&
      allMembers.length > 1 &&
      member.userID === user?.profile?.userID
    ) {
      return [
        {
          label: 'Transfer team ownership',
          type: 'item',
          onClick: () => browserHistory.push('/teams/people/members/transfer-ownership')
        }
      ]
    }

    if (canManageRow(member, allowedRoles, user)) {
      const items = [
        {
          label: 'Remove from team',
          type: 'item',
          destructive: true,
          onClick: () => startRemovingUser(member),
          element: props => (
            <Permission any={['People.RemoveMember', 'People.RemoveOwner']}>
              <div {...props} />
            </Permission>
          )
        }
      ]
      // unshift because using push would throw an error (Helios)
      items.unshift({
        label: 'Change role',
        type: 'item',
        onClick: () => startChangingRole(member)
      })
      return items
    }

    // Members: show nothing
    return []
  }

  const renderTable = () => {
    const hasNoResults = displayedMembers.length === 0 && areMembersLoaded

    const membersRows = displayedMembers.map(member => {
      const columns = {
        name: <RowProfileInfo item={member} user={user} showRoleBadge showMyself />
      }

      if (showSeatType) {
        columns.seatType = (
          <SeatType
            canChangeSeatType={canChangeSeatType}
            member={member}
            seatTypeId={member.seatTypeID}
            onChange={startChangingSeatType}
          />
        )
      }

      columns.lastSeen = (
        <LastSeen activity={lastSeen[member.userID]} isLoading={isLastSeenLoading} />
      )

      const editRowMenuItems = editRowItems(member)

      return {
        id: member.userID.toString(),
        selected: isRowChecked(member),
        selectionDisabledMessage: rowDisabledMessage(member),
        onSelectedChange() {
          handleRowClick(member)
        },
        showRowMenu: editRowMenuItems.length > 0,
        editRowMenuItems,
        columns
      }
    })

    const columns = [
      {
        id: 'name',
        title: <Search label="" />,
        renderWhenLoading: <LoadingUserWithAvatar />
      }
    ]
    if (showSeatType) {
      columns.push({
        id: 'seatType',
        title: phase1bFlag ? <SeatTypeFilterDropdown tab="members" /> : 'Seat type',
        width: '185px',
        renderWhenLoading: <LoadingLine />
      })
    }

    columns.push({
      id: 'lastSeen',
      title: phase1bFlag ? (
        <DateFilterDropdown
          align="right"
          headingLabel="Last seen"
          filtersLabel="Last seen"
          showSorting
          width={250}
          updateOnClick={() => fetchLastSeenRequest(allMembersIds)}
          tab="members"
        />
      ) : (
        'Last seen'
      ),
      width: '180px',
      renderWhenLoading: <LoadingLine />
    })

    return (
      <>
        <NewTable
          selectable
          rows={membersRows}
          loading={areMembersLoading}
          loadingRowCount={7}
          columns={columns}
        />
        <Pagination
          isTableLoaded={areMembersLoaded}
          label="Members"
          items={displayedMembers}
          totalItems={processedMembersCount}
        />
        {hasNoResults && (
          <Padded top="l">
            <Animation speed="fast" order="drop-in-bottom">
              <NotFoundCard />
            </Animation>
          </Padded>
        )}
      </>
    )
  }

  return (
    <TableAndBulkBarWrapper>
      {children && (
        <ModalPortal
          isOpened={portalOpened}
          onClose={handleModalClose}
          onBack={handleModalBack}
        >
          <Modal backButton>{props.children}</Modal>
        </ModalPortal>
      )}

      {renderTable()}

      <div style={{ flex: '1 0 auto' }} />

      <RemoveUserDialog
        currentUserID={user?.profile?.userID}
        member={removeFlow.member}
        documentCount={userDocumentCounts[removeFlow.member?.userID]?.documentCount}
        withDocumentTransfer={removeFlow.documentsAreTransferable}
        onClose={closeDialog}
        onRemoved={handleRemovedMember}
      />

      <ChangeRoleDialog
        item={changeRoleFlow.member}
        onClose={closeDialog}
        onSubmit={onChangeRole}
      />

      <ChangeSeatTypeDialog
        type="member"
        item={changeSeatTypeFlow.member}
        onClose={closeDialog}
        onSubmit={onChangeSeatType}
      />

      <BulkBar
        page="members"
        chooseId={member => member.id}
        bulkEditableItems={bulkEditableMembersOnly}
        allItems={allBulkEditableMembersOnly}
        totalItems={allBulkEditableMembersOnly.length}
        onVisible={onBulkBarVisible}
      />
    </TableAndBulkBarWrapper>
  )
}

const TableAndBulkBarWrapper = styled.div`
  display: flex;
  flex: 1 0 100%;
  flex-direction: column;
`

export default Members
