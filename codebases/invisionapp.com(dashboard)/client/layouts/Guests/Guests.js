import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'
import styled from 'styled-components'
import { Alert, Animation, Padded } from '@invisionapp/helios'

import illustration from '@invisionapp/helios/illustrations/scene/no-guests.svg'

import {
  canManageRow,
  changeRole,
  changeSeatType,
  fetchAllMembers,
  isMyself,
  removeUserFromStore,
  selectActiveGuestsCount,
  selectBulkEditableGuests,
  selectBulkEditableDisplayedGuests,
  selectProcessedGuestsCount,
  selectGuestIds,
  selectInactiveGuestsCount,
  selectIsLoaded as selectMembersAreLoaded,
  selectIsLoading as selectMembersAreLoading,
  selectMembersAndGuestsArray,
  selectDisplayedGuests
} from '../../stores/members'
import { selectFilters } from '../../stores/tables'
import { selectBulkIds, toggleBulkItems } from '../../stores/bulkItems'
import { selectUser, selectCanTransferOwnership } from '../../stores/user'
import {
  selectAllowedRoles,
  getRoleNameById,
  selectAllRoles,
  isRoleBulkEditable
} from '../../stores/roles'
import { fetchLastSeen, selectLastSeen, selectIsLastSeenLoading } from '../../stores/lastSeen'
import {
  fetchUserDocumentCounts,
  selectUserDocumentCounts
} from '../../stores/userDocumentCounts'
import {
  fetchBillableUsers,
  selectBillableUserIds,
  selectIsBillableLoading,
  selectIsMultiSeatPlan,
  selectShowStatus
} from '../../stores/billing'
import { selectPermission } from '../../stores/permissions'

import useToast from '../../hooks/useToast'

import ModalPortal from '../../components/Modal/ModalPortal'
import Modal from '../../components/Modal'
import NotFoundCard from '../../components/tables/NotFoundCard'
import DateFilterDropdown from '../../components/tables/DateFilterDropdown'
import LastSeen from '../../components/tables/LastSeen'
import Status from '../../components/tables/Status'
import StatusFilterDropdown from '../../components/tables/StatusFilterDropdown'
import SeatType from '../../components/tables/SeatType'
import SeatTypeFilterDropdown from '../../components/tables/SeatTypeFilterDropdown'
import BulkBar from '../../components/bulk/BulkBar'
import Permission from '../../components/Permission'
import { capitalizeFirstLetter } from '../../helpers/string'
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
import { RowProfileInfo } from '../../components/RowProfileInfo'
import {
  selectMemberSortingFilteringFlag,
  selectShowSeatTypeFlag,
  selectTransferDocsWhenRemovedFlag
} from '../../stores/featureFlags'

const Guests = props => {
  const { children, portalOpened, handleModalClose, handleModalBack } = props

  const dispatch = useDispatch()
  const { successToast, errorToast } = useToast()

  // --- Selectors ---
  const { page, searchQuery, statusType, dateFilter, seatType } = useSelector(selectFilters)
  const bulkItems = useSelector(selectBulkIds)
  const displayedGuests = useSelector(selectDisplayedGuests)
  const processedGuestsCount = useSelector(selectProcessedGuestsCount)
  const activeGuestsCount = useSelector(selectActiveGuestsCount)
  const inactiveGuestsCount = useSelector(selectInactiveGuestsCount)
  const membersAndGuests = useSelector(selectMembersAndGuestsArray)
  const guestIds = useSelector(selectGuestIds)
  const user = useSelector(selectUser)
  const lastSeen = useSelector(selectLastSeen)
  const isLastSeenLoading = useSelector(selectIsLastSeenLoading)
  const userDocumentCounts = useSelector(selectUserDocumentCounts)
  const allBulkEditableGuests = useSelector(selectBulkEditableGuests)
  const bulkEditableDisplayedGuests = useSelector(selectBulkEditableDisplayedGuests)
  const canTransferOwnership = useSelector(selectCanTransferOwnership)
  const allowedRoles = useSelector(selectAllowedRoles)
  const allRoles = useSelector(selectAllRoles)
  const areMembersLoading = useSelector(selectMembersAreLoading)
  const areMembersLoaded = useSelector(selectMembersAreLoaded)
  const isMultiSeatPlan = useSelector(selectIsMultiSeatPlan)
  const isBillableLoading = useSelector(selectIsBillableLoading)
  const billableUserIds = useSelector(selectBillableUserIds)
  const showStatusFlag = useSelector(selectShowStatus)

  const [removeFlow, setRemoveFlow] = useState({
    member: undefined,
    documentsAreTransferable: false
  })

  // --- Hooks ---
  const [changeRoleFlow, setChangeRoleFlow] = useState({ member: undefined })
  const [changeSeatTypeFlow, setChangeSeatTypeFlow] = useState({ member: undefined })
  const [isSearching, setIsSearching] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [showGuestBillingAlert, setShowGuestBillingAlert] = useState(false)

  // --- Permissions ---
  // Multi Seat permissions and flag
  const canChangeSeatTypePermission = useSelector(state =>
    selectPermission(state, 'People.ChangeSeatType')
  )

  // --- Feature Flags ---
  const transferDocsWhenRemovedFlag = useSelector(selectTransferDocsWhenRemovedFlag)
  const showSeatTypeFlag = useSelector(selectShowSeatTypeFlag)
  const showSeatType = showSeatTypeFlag && isMultiSeatPlan
  const canChangeSeatType = canChangeSeatTypePermission && showSeatTypeFlag
  const phase1bFlag = useSelector(selectMemberSortingFilteringFlag)

  // Dispatchers
  const fetchAllMembersRequest = options => dispatch(fetchAllMembers(options))
  const fetchLastSeenRequest = userIDs => dispatch(fetchLastSeen(userIDs))
  const fetchUserDocumentCountsRequest = useCallback(
    userIDs => {
      dispatch(fetchUserDocumentCounts(userIDs))
    },
    [dispatch]
  )

  const fetchBillableUsersRequest = useCallback(() => {
    dispatch(fetchBillableUsers())
  }, [dispatch])

  const changeRoleRequest = ({ userId, newRoleId, onDone, onError }) =>
    dispatch(changeRole({ userId, newRoleId, onDone, onError }))

  const changeSeatTypeRequest = useCallback(
    ({ userId, seatTypeId, onDone, onError }) => {
      dispatch(changeSeatType({ userId, seatTypeId, onDone, onError }))
    },
    [dispatch]
  )
  const toggleBulkItemsRequest = (id, bulkType) => dispatch(toggleBulkItems(id, bulkType))

  // ----------

  useEffect(() => {
    if (displayedGuests.length === 0 || areMembersLoading) {
      return
    }

    const userIDs = displayedGuests.map(user => user.userID)
    fetchUserDocumentCountsRequest(userIDs)

    if (showStatusFlag) {
      fetchBillableUsersRequest()
    }
  }, [
    areMembersLoaded,
    areMembersLoading,
    fetchBillableUsersRequest,
    fetchUserDocumentCountsRequest,
    displayedGuests,
    page,
    searchQuery,
    showStatusFlag
  ])

  useEffect(() => {
    const hasSearchQuery = searchQuery && searchQuery.length > 0
    setIsSearching(!!hasSearchQuery)
  }, [searchQuery])

  useEffect(() => {
    setIsFiltering(!!(statusType || dateFilter || seatType))
  }, [statusType, dateFilter, seatType])

  useEffect(() => {
    const hasDismissedGuestBillingAlert = !!window.localStorage.getItem('guest-billing-alert')

    if (showStatusFlag && !hasDismissedGuestBillingAlert) {
      setShowGuestBillingAlert(true)
    }
  }, [showStatusFlag])

  const handleRemovedMember = member => {
    dispatch(removeUserFromStore(member.userID))
    // analytics
    trackPeopleRemoveUser({ action: 'single' })
  }

  const onChangeRole = (member, newRole) => {
    changeRoleRequest({
      userId: member.userID,
      newRoleId: newRole,
      onDone: () => {
        fetchAllMembersRequest({ background: true, force: true })
        successToast('The role has been successfully updated')
      },
      onError: () => {
        errorToast('Something went wrong, please try again')
      }
    })

    trackPeopleRoleChange({
      targeted_userid: member.userID,
      old_role: getRoleNameById(allRoles, member.roleID),
      new_role: newRole,
      action: 'single'
    })
  }

  const onChangeSeatType = useCallback(
    (member, seatTypeId) => {
      changeSeatTypeRequest({
        userId: member.userID,
        seatTypeId,
        onDone: () => {
          successToast('The seat type has been successfully updated')
          // analytics
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

  const handleRowClick = member => toggleBulkItemsRequest(member.userID, 'member')

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
      membersAndGuests.length > 1 &&
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
      return [
        {
          label: 'Change role',
          type: 'item',
          onClick: () => startChangingRole(member)
        },
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
    }

    // Members: show nothing
    return []
  }

  const handleAlertDismiss = () => {
    setShowGuestBillingAlert(false)
    window.localStorage.setItem('guest-billing-alert', true)
  }

  const renderBlockers = () => {
    const hasNoResults = displayedGuests.length === 0 && areMembersLoaded

    if (hasNoResults === false) {
      return null
    }

    if (isSearching || isFiltering) {
      return (
        <Padded top="l">
          <Animation speed="fast" order="drop-in-bottom">
            <NotFoundCard />
          </Animation>
        </Padded>
      )
    }

    if (isSearching === false && isFiltering === false) {
      return (
        <Padded top="l">
          <Animation speed="fast" order="drop-in-bottom">
            <NotFoundCard
              heading="External guests can only access documents and spaces they are invited to, intended for third-party contractors, clients, and stakeholders that require limited team visibility. <a href='https://support.invisionapp.com/hc/en-us/articles/360027856891-InVision-V7-Roles#guests' target='_blank'>Learn more</a>."
              imageSrc={illustration}
              title="Add external guests to your team"
            />
          </Animation>
        </Padded>
      )
    }

    return null
  }

  const renderTable = () => {
    const guestsRows = displayedGuests.map(member => {
      const columns = {
        name: <RowProfileInfo item={member} />
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

      if (showStatusFlag) {
        columns.status = (
          <Status
            billableUserIds={billableUserIds}
            userId={member.userID}
            isLoading={isBillableLoading}
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
        title: phase1bFlag ? <SeatTypeFilterDropdown tab="guests" /> : 'Seat type',
        width: '185px',
        renderWhenLoading: <LoadingLine />
      })
    }

    if (showStatusFlag) {
      columns.push({
        id: 'status',
        title: (
          <StatusFilterDropdown
            activeGuestsCount={activeGuestsCount}
            inactiveGuestsCount={inactiveGuestsCount}
          />
        ),
        width: '150px',
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
          updateOnClick={() => fetchLastSeenRequest(guestIds)}
          tab="guests"
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
          rows={guestsRows}
          loading={areMembersLoading}
          hideHeaders={isSearching === false && isFiltering === false}
          loadingRowCount={7}
          columns={columns}
        />
        <Pagination
          isTableLoaded={areMembersLoaded}
          label="Guests"
          items={displayedGuests}
          totalItems={processedGuestsCount}
        />
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

      {showGuestBillingAlert && (
        <Alert dismissable onDismiss={handleAlertDismiss}>
          Any guests who open two or more team documents become activated (billable).{' '}
          <a
            href="https://support.invisionapp.com/hc/en-us/articles/360051727892"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </Alert>
      )}

      {renderTable()}
      {renderBlockers()}

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
        isGuest
      />

      <ChangeSeatTypeDialog
        type="guest"
        item={changeSeatTypeFlow.member}
        onClose={closeDialog}
        onSubmit={onChangeSeatType}
      />

      <BulkBar
        page="guests"
        chooseId={member => member.id}
        bulkEditableItems={bulkEditableDisplayedGuests}
        allItems={allBulkEditableGuests}
        totalItems={allBulkEditableGuests.length}
        onVisible={onBulkBarVisible}
      />
    </TableAndBulkBarWrapper>
  )
}

const TableAndBulkBarWrapper = styled.div`
  display: flex;
  flex: 1 0 100%;
  flex-direction: column;

  // helios overrides to control the status dropdown tooltip
  #status-heading {
    position: relative;

    // override to left align the status label
    & > div > div,
    & > div {
      align-items: flex-start;
    }

    & > div > span > div {
      display: inline-block;
    }

    [role='tooltip'] {
      width: 217px;

      div {
        width: 217px;
        text-align: center;
        white-space: normal;
      }
    }
  }
`

export default Guests
