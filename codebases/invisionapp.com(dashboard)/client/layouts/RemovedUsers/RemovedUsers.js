import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'

import { Alert, Animation, Fullscreen, Padded, Spaced, Text } from '@invisionapp/helios'
import pluralize from 'pluralize'
import { Button } from 'components/Button'
import Search from './Search'

import {
  checkInvitedRemovedUsers,
  deleteUserDocs,
  selectBulkEditableRemovedUsers,
  selectDisplayedRemovedUsers,
  selectInvitedRemovedUsers,
  selectIsLoaded as selectRemovedUsersAreLoaded,
  selectIsLoading as selectRemovedUsersAreLoading,
  selectProcessedRemovesUsersCount,
  selectRemovedUsersErrorMessage,
  setUserDocsCount,
  startReinvitingUser
} from '../../stores/removedUsers/index'
import {
  fetchUserDocumentCounts,
  selectUserDocumentCounts
} from '../../stores/userDocumentCounts'
import { fetchAllInvitations } from '../../stores/invitations'
import { toggleBulkItems, selectBulkIds } from '../../stores/bulkItems'
import { selectFilters } from '../../stores/tables/tables.selectors'
import { selectPermission } from '../../stores/permissions'
import { transferCounts } from '../../stores/bulkTransfer'
import {
  fetchAllMembers,
  selectIsLoading as selectMembersAreLoading
} from '../../stores/members'
import { selectIsMultiSeatPlan } from '../../stores/billing'

import { UserAvatar } from '../../components/tables/Table'
import Avatar from '../../components/ProportionedAvatar'
import NotFoundCard from '../../components/tables/NotFoundCard'
import BulkBar from '../../components/bulk/BulkBar'
import { Searchable, SearchableOption } from '../../components/Searchable'
import { useSelectUserModal } from './useSelectUserModal'
import { DeleteUserDocsConfirmationDialog } from '../../components/dialogs/DeleteUserDocsConfirmationDialog'

import { NewTable } from '../../components/tables/NewTable'
import Pagination from '../../components/tables/Pagination'
import { LoadingUserWithAvatar, LoadingLine } from '../../components/tables/LoadingRow'
import DateFilterDropdown from '../../components/tables/DateFilterDropdown'
import SortDropdown from '../../components/tables/SortDropdown'
import SeatType from '../../components/tables/SeatType'
import SeatTypeFilterDropdown from '../../components/tables/SeatTypeFilterDropdown'

import useToast from '../../hooks/useToast'
import {
  trackOrphanedDocsTransferSelected,
  trackOrphanedDocsDeleteSelected,
  trackOrphanedDocsTransferConfirmed,
  trackOrphanedDocsDeleteConfirmed
} from '../../helpers/analytics'
import { RowProfileInfo } from '../../components/RowProfileInfo'
import { selectRemovedUsersSortingFilteringFlag } from '../../stores/featureFlags'

const RemovedUsers = () => {
  const dispatch = useDispatch()

  const {
    selectUserModalOpen,
    closeSelectUserModal,
    openSelectUserModal,
    setUserIdToTransferTo,
    transferToUserStatus,
    startTransforUser,
    selectedDocumentCount,
    possibleDocOwners,
    userIdToTransferTo
  } = useSelectUserModal()

  const canManageTeam = useSelector(state => selectPermission(state, 'People.ManageTeam'))

  const [deleteDocsDialog, setDeleteDocsDialog] = useState({
    status: 'closed',
    userId: null,
    userDocumentCount: 0
  })

  const { successToast, errorToast } = useToast()

  // --- Selectors ---
  const { searchQuery = '', dateFilter } = useSelector(selectFilters)
  const bulkItems = useSelector(selectBulkIds)
  const removedUsersErrorMessage = useSelector(selectRemovedUsersErrorMessage)
  const invitedRemovedUsers = useSelector(selectInvitedRemovedUsers)
  const bulkEditableUsers = useSelector(selectBulkEditableRemovedUsers)
  const areMembersLoading = useSelector(selectMembersAreLoading)
  const userDocumentCounts = useSelector(selectUserDocumentCounts)
  const areRemovedUsersLoaded = useSelector(selectRemovedUsersAreLoaded)
  const areRemovedUsersLoading = useSelector(selectRemovedUsersAreLoading)
  const displayedRemovedUsers = useSelector(selectDisplayedRemovedUsers)
  const processedRemovedUsersCount = useSelector(selectProcessedRemovesUsersCount)

  const isMultiSeatPlan = useSelector(selectIsMultiSeatPlan)
  const isPhase1b = useSelector(selectRemovedUsersSortingFilteringFlag)

  const numberofTransferableMembers = possibleDocOwners.members.length

  // --- Dispatchers ---
  const dispatchStartReinvitingUser = ({ email, roleKey }) =>
    dispatch(startReinvitingUser({ email, roleKey }))
  const fetchAllInvitationsRequest = () => dispatch(fetchAllInvitations())
  const fetchUserDocumentCountsRequest = userIDs => dispatch(fetchUserDocumentCounts(userIDs))
  const handleRowClick = member => dispatch(toggleBulkItems(member.userID, 'removed user'))
  const rowDisabledMessage = user =>
    checkInvitedRemovedUsers(user.userID, invitedRemovedUsers)
      ? 'This user has already been invited.'
      : null

  const isRowChecked = user =>
    rowDisabledMessage(user) === null ? bulkItems.includes(user.userID) : false

  useEffect(() => {
    if (displayedRemovedUsers.length === 0 || areRemovedUsersLoading) {
      return
    }
    // Need to fetch invitations to know if removed users have been invited
    // TODO: fetch only passed userIDs
    fetchAllInvitationsRequest()

    const userIDs = displayedRemovedUsers.map(user => user.userID)
    fetchUserDocumentCountsRequest(userIDs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areRemovedUsersLoaded, searchQuery])

  const handleDeleteUserDocs = userId => {
    deleteUserDocs(userId)
      .then(response => {
        const body = response.data

        switch (body.status) {
          case 'Failed': {
            const { failed, succeeded } = transferCounts(body)

            errorToast(
              <>
                {succeeded.length} {pluralize('documents', succeeded.length)} were successfully
                deleted, however {failed.length} {pluralize('documents', failed.length)} were
                not deleted.
                <br />
                Please try again later or contact support.
              </>
            )

            break
          }
          // Succeeded
          default: {
            successToast(
              `${deleteDocsDialog.userDocumentCount} ${pluralize(
                'document',
                deleteDocsDialog.userDocumentCount
              )} ${pluralize(
                'has',
                deleteDocsDialog.userDocumentCount
              )} been successfully deleted`
            )

            setDeleteDocsDialog({
              ...deleteDocsDialog,
              status: 'closed',
              userDocumentCount: 0
            })

            dispatch(
              setUserDocsCount({
                userId,
                count: 0
              })
            )
          }
        }
      })
      .catch(() => {
        setDeleteDocsDialog({
          ...deleteDocsDialog,
          status: 'open'
        })

        errorToast(
          'There was a problem trying to delete these documents, please try again later'
        )
      })
  }

  const hasNoResults = areRemovedUsersLoaded && displayedRemovedUsers.length === 0
  let isEmpty = hasNoResults && !!searchQuery === false
  if (isEmpty && isPhase1b) {
    isEmpty = !!dateFilter === false
  }

  // ---- Table -----
  const renderTable = () => {
    const usersRows = displayedRemovedUsers.map(user => {
      const isInvited = checkInvitedRemovedUsers(user.userID, invitedRemovedUsers)
      const docCounts = userDocumentCounts[user.userID]?.documentCount
      const dateRemoved = moment(user.endedAt).format('MMM DD, YYYY')

      const showDocManagementItems = canManageTeam && docCounts > 0
      const openDeleteDocsModal = () => {
        setDeleteDocsDialog({
          ...deleteDocsDialog,
          status: 'open',
          userId: user.userID,
          userDocumentCount: docCounts
        })
      }

      const dataColumns = {
        name: <RowProfileInfo item={user} showRoleBadge />
      }

      if (isPhase1b && isMultiSeatPlan) {
        dataColumns.seatType = (
          <SeatType canChangeSeatType={false} member={user} seatTypeId={user.seatTypeID} />
        )
      }

      dataColumns.ownedDocuments = (
        <Text order="body" color="text-lightest">
          {userDocumentCounts[user.userID]?.documentCount}
        </Text>
      )

      if (isPhase1b) {
        dataColumns.dateRemoved = (
          <Text order="body" color="text-lightest">
            {dateRemoved}
          </Text>
        )

        dataColumns.removedBy = (
          <Text order="body" color="text-lightest">
            {user.removedByUser ? user.removedByUser.email : 'N/A'}
          </Text>
        )
      }

      return {
        id: user.userID.toString(),
        selected: isRowChecked(user),
        selectionDisabledMessage: rowDisabledMessage(user),
        onSelectedChange() {
          handleRowClick(user)
        },
        showRowMenu: true,
        editRowMenuItems: [
          {
            label: isInvited ? 'Invited to team' : 'Invite to team',
            type: 'item',
            destructive: false,
            onClick() {
              // already invited, nothing to do
              if (isInvited) {
                return
              }

              dispatchStartReinvitingUser({
                email: user.email,
                roleKey: user.roleName
              })
            },
            disabled: isInvited
          }
        ].concat(
          showDocManagementItems
            ? [
                {
                  label: 'Transfer documents',
                  type: 'item',
                  destructive: false,
                  onClick: () => {
                    dispatch(fetchAllMembers())
                    openSelectUserModal(
                      user.userID,
                      userDocumentCounts[user.userID]?.documentCount
                    )
                    trackOrphanedDocsTransferSelected()
                  }
                },
                {
                  label: 'Delete documents',
                  type: 'item',
                  destructive: true,
                  onClick: () => {
                    openDeleteDocsModal()
                    trackOrphanedDocsDeleteSelected()
                  }
                }
              ]
            : []
        ),
        columns: dataColumns
      }
    })

    const columns = []
    columns.push({
      id: 'name',
      title: <Search label="" />,
      renderWhenLoading: <LoadingUserWithAvatar />
    })

    if (isPhase1b) {
      if (isMultiSeatPlan) {
        columns.push({
          id: 'seatType',
          title: <SeatTypeFilterDropdown tab="removed-users" />
        })
      }

      columns.push({
        id: 'removedBy',
        title: 'Removed by'
      })

      columns.push({
        id: 'dateRemoved',
        title: (
          <DateFilterDropdown
            showFilters={false}
            tab="removed-users"
            clearName="docCountSort"
          />
        ),
        renderWhenLoading: <LoadingLine />
      })
    }

    columns.push({
      id: 'ownedDocuments',
      title: isPhase1b ? (
        <SortDropdown
          label="Owned documents"
          sortName="docCountSort"
          clearName="dateSort"
          tab="removed-users"
        />
      ) : (
        <>Owned documents</>
      ),
      width: isPhase1b ? '170px' : '150px',
      renderWhenLoading: <LoadingLine style={{ width: '30px' }} />
    })

    return (
      <>
        <NewTable
          selectable
          rows={usersRows}
          columns={columns}
          loading={areRemovedUsersLoading}
          loadingRowCount={3}
          hideHeaders={isEmpty}
        />
        <Pagination
          isTableLoaded={areRemovedUsersLoaded}
          label="Removed Users"
          items={usersRows}
          totalItems={processedRemovedUsersCount}
        />
      </>
    )
  }

  // removed users is not visible when there are no items
  // that's why we only need `hasNoResults`
  return (
    <>
      <Wrapper>
        {removedUsersErrorMessage && (
          <Spaced bottom="l">
            <Alert status="danger">{removedUsersErrorMessage}</Alert>
          </Spaced>
        )}

        {renderTable()}

        {hasNoResults && (
          <Padded top="l">
            <Animation speed="fast" order="drop-in-bottom">
              <NotFoundCard />
            </Animation>
          </Padded>
        )}
      </Wrapper>

      <BulkBar
        page="removedUsers"
        chooseId={user => user.userID}
        bulkEditableItems={bulkEditableUsers}
      />

      <StyledFullscreen
        open={selectUserModalOpen}
        fullWidth
        onRequestClose={closeSelectUserModal}
      >
        <SelectUserModalWrapper>
          <Padded bottom="m">
            <Text order="title">Select a user and transfer document ownership</Text>
            <Text order="body" size="larger">
              {selectedDocumentCount > 1
                ? 'The new document owner will be able to delete them or manage their permissions'
                : 'The new document owner will be able to delete it or manage its permissions'}
            </Text>
          </Padded>

          <form
            onSubmit={e => {
              e.preventDefault()
              startTransforUser()

              const targetUser = possibleDocOwners.members.find(
                member => member.userID === userIdToTransferTo
              )

              trackOrphanedDocsTransferConfirmed({
                documentCount: selectedDocumentCount,
                targetUserId: targetUser.userID,
                targetUserRole: targetUser.role.role ?? targetUser.role.name
              })
            }}
          >
            {/* Only rendering this when it's open properly resets the selected value */}
            {selectUserModalOpen && (
              <Searchable
                loading={
                  possibleDocOwners.status === 'loading' ||
                  possibleDocOwners.status === 'initial'
                }
                options={possibleDocOwners.members}
                getKey={option => option.id.toString()}
                onSelect={option => setUserIdToTransferTo(option?.userID ?? null)}
                renderInputValue={option => option?.name}
                renderPrepend={member => {
                  return (
                    <Avatar
                      color="dark"
                      name={member?.name}
                      order="user"
                      src={member?.avatarURL}
                      size="smaller"
                    />
                  )
                }}
                renderOption={member => {
                  return (
                    <SearchableOption>
                      <UserAvatar
                        color="dark"
                        name={member.name}
                        order="user"
                        src={member.avatarURL}
                      />
                      <div>
                        <Text order="body">
                          <strong>
                            {member.name}
                            {member.userID === member.user?.id ? ' (you)' : ''}
                          </strong>
                        </Text>
                        <Text order="body" size="smaller" color="text-lightest">
                          {/* TODO: these roles won't always existon the members once they are removed in teams-api */}
                          {member.role.role ?? member.role.name}
                        </Text>
                      </div>
                    </SearchableOption>
                  )
                }}
                id="select-user"
                placeholder={
                  areMembersLoading
                    ? ''
                    : `Search ${numberofTransferableMembers} ${pluralize(
                        'teammate',
                        numberofTransferableMembers
                      )}`
                }
              />
            )}

            <Spaced top="xl">
              <Button size="larger" status={transferToUserStatus}>
                Transfer
              </Button>
            </Spaced>
          </form>
        </SelectUserModalWrapper>
      </StyledFullscreen>

      <DeleteUserDocsConfirmationDialog
        open={deleteDocsDialog.status !== 'closed'}
        documentCount={deleteDocsDialog.userDocumentCount}
        onCancel={() =>
          setDeleteDocsDialog({
            ...deleteDocsDialog,
            status: 'closed',
            userId: null
          })
        }
        onDelete={() => {
          setDeleteDocsDialog({
            ...deleteDocsDialog,
            status: 'loading'
          })
          handleDeleteUserDocs(deleteDocsDialog.userId)

          trackOrphanedDocsDeleteConfirmed({
            documentCount: selectedDocumentCount
          })
        }}
        loading={deleteDocsDialog.status === 'loading'}
      />
    </>
  )
}

// margin botton b/c I need space for the bulkbar (62px height)
// Note, when we add the pagination in the footer, we can decrease this margin
const Wrapper = styled.div`
  position: relative;
  margin-bottom: 100px;
`

const StyledFullscreen = styled(Fullscreen)`
  z-index: 20;
  & [role='presentation'] {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
`

const SelectUserModalWrapper = styled.div`
  padding: 0 48px;
  margin: 0 auto;
`

export default RemovedUsers
