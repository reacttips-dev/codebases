import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment'
import withProps from 'recompose/withProps'
import { Animation, Padded, Text } from '@invisionapp/helios'

import deleteImage from '@invisionapp/helios/illustrations/spot/delete-user-group.svg'
import noInvitesImage from '@invisionapp/helios/illustrations/scene/no-pending-invoices.svg'
import {
  changeInvitationRole,
  changeInvitationSeatType,
  deleteInvitationBffRequest,
  fetchAllInvitations,
  removeInviteFromStore,
  resendInvitation,
  selectProcessedInvitationsCount,
  selectInvitationsLoading,
  selectProcessedInvitations,
  selectInvitationsPagination,
  selectDisplayedInvitations
} from '../../stores/invitations'
import { selectIsMultiSeatPlan } from '../../stores/billing'
import {
  canManageRole,
  selectAllowedRoles,
  selectAllRoles,
  getRoleNameById
} from '../../stores/roles'
import { selectFilters } from '../../stores/tables'
import { selectBulkIds, toggleBulkItems } from '../../stores/bulkItems'

import useToast from '../../hooks/useToast'

import SeatType from '../../components/tables/SeatType'
import SeatTypeFilterDropdown from '../../components/tables/SeatTypeFilterDropdown'
import BlockerCard from '../../components/BlockerCard'
import NotFoundCard from '../../components/tables/NotFoundCard'
import {
  trackPeopleRemoveInvite,
  trackPeopleResendInvite,
  trackPeopleResendInviteFailed,
  trackPeopleRoleChange,
  trackPeopleSeatTypeChanged
} from '../../helpers/analytics'
import BulkBar from '../../components/bulk/BulkBar'

import { selectPermission } from '../../stores/permissions'
import { DeleteConfirmationDialog } from '../../components/dialogs/DeleteConfirmationDialog'
import { NewTable } from '../../components/tables/NewTable'

import { LoadingUserWithAvatar, LoadingLine } from '../../components/tables/LoadingRow'
import Search from './Search'
import Pagination from '../../components/tables/Pagination'
import { ChangeSeatTypeDialog } from '../../components/dialogs/ChangeSeatTypeDialog'
import { ChangeRoleDialog } from '../../components/dialogs/ChangeRoleDialog'
import DateFilterDropdown from '../../components/tables/DateFilterDropdown'
import { RowProfileInfo } from '../../components/RowProfileInfo'
import {
  selectInvitationSortingFilteringFlag,
  selectShowSeatTypeFlag
} from '../../stores/featureFlags'

const Image = withProps({
  src: noInvitesImage,
  alt: 'Your team currently does not have any pending invitations.'
})(styled.img`
  max-width: 320px;
  height: auto;
  margin-right: auto;
  margin-left: auto;
`)

const Invitations = () => {
  const dispatch = useDispatch()

  // --- Hooks ---
  const [deletingStatus, setDeletingStatus] = useState('closed') // closed | open | deleting
  const [removeFlow, setRemoveFlow] = useState({ invite: undefined })
  const [changeRoleFlow, setChangeRoleFlow] = useState({ invite: undefined })
  const [changeSeatTypeFlow, setChangeSeatTypeFlow] = useState({ invite: undefined })

  // --- Selectors ---
  const { searchQuery, dateFilter, seatType } = useSelector(selectFilters)
  const bulkItems = useSelector(selectBulkIds)
  const processedInvitationsCount = useSelector(selectProcessedInvitationsCount)
  const allInvites = useSelector(selectProcessedInvitations)
  const pagination = useSelector(selectInvitationsPagination)
  const displayedInvitations = useSelector(selectDisplayedInvitations)
  const allowedRoles = useSelector(selectAllowedRoles)
  const allRoles = useSelector(selectAllRoles)
  const invitationsLoading = useSelector(selectInvitationsLoading)
  const isMultiSeatPlan = useSelector(selectIsMultiSeatPlan)

  // --- Permissions ---
  const canChangeSeatTypePermission = useSelector(state =>
    selectPermission(state, 'People.ChangeSeatType')
  )
  const canManagePeoplePermission = useSelector(state =>
    selectPermission(state, 'People.ManageTeam')
  )

  // --- Feature Flags ---
  const showSeatTypeFlag = useSelector(selectShowSeatTypeFlag)
  const phase1bFlag = useSelector(selectInvitationSortingFilteringFlag)

  // --- Compound Booleans ---
  const showSeatType = showSeatTypeFlag && isMultiSeatPlan
  const canChangeSeatType = canChangeSeatTypePermission && showSeatTypeFlag

  // --- Dispatchers ---
  const resendInvitationRequest = ({ invitationId, onDone, onError }) =>
    dispatch(resendInvitation({ invitationId, onDone, onError }))
  const fetchAllInvitationsRequest = useCallback(
    options => dispatch(fetchAllInvitations(options)),
    [dispatch]
  )
  const changeInvitationRoleRequest = useCallback(
    ({ invitationId, roleId, onDone, onError }) =>
      dispatch(changeInvitationRole({ invitationId, roleId, onDone, onError })),
    [dispatch]
  )
  const changeSeatTypeRequest = useCallback(
    ({ invitationId, seatTypeId, onDone, onError }) =>
      dispatch(changeInvitationSeatType({ invitationId, seatTypeId, onDone, onError })),
    [dispatch]
  )

  const toggleBulkItemsRequest = (id, bulkType) => dispatch(toggleBulkItems(id, bulkType))
  const removeInviteFromStoreRequest = id => dispatch(removeInviteFromStore(id))

  const { successToast, errorToast } = useToast()

  const getDuration = date => {
    const duration = new Date() - new Date(date)
    return duration / 1000 / 3600 // returns a floating point number
  }

  const handleRowClick = invite => toggleBulkItemsRequest(invite.id, 'invite')

  const isRowChecked = invite => bulkItems.includes(invite.id)

  const onChangeRole = useCallback(
    (invite, newRole) => {
      changeInvitationRoleRequest({
        invitationId: invite.id,
        roleId: newRole,
        onDone: () => {
          fetchAllInvitationsRequest({ background: true, force: true })
          successToast('The role has been successfully updated')
        },
        onError: () => {
          errorToast('Something went wrong, please try again')
        }
      })

      trackPeopleRoleChange({
        targeted_userid: invite.userID,
        old_role: getRoleNameById(allRoles, invite.roleID),
        new_role: newRole.role,
        action: 'single'
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [successToast, errorToast]
  )

  const onChangeSeatType = useCallback(
    (invite, newSeatTypeID) => {
      changeSeatTypeRequest({
        invitationId: invite.id,
        seatTypeId: newSeatTypeID,
        onDone: () => {
          successToast('The seat type has been successfully updated')
        },
        onError: () => {
          errorToast('Something went wrong, please try again')
        }
      })
      // analytics
      trackPeopleSeatTypeChanged({
        userId: invite.createdBy.userId,
        oldSeatType: invite.seatTypeID,
        newSeatType: newSeatTypeID,
        action: 'single'
      })
    },
    [successToast, errorToast, changeSeatTypeRequest]
  )

  /**
   * Handles resending an invitation. Throttles resends to no more than one
   * per hour. Dispatches notifications on success or failure or if the resend
   * exceeds the throttling threshhold.
   * @param {object} invitation
   */
  const handleResend = invitation => {
    const hours = getDuration(invitation.latestInvite)

    // Don't allow invites to be sent more frequently than once an hour
    if (hours <= 1) {
      errorToast(`Please wait at least an hour before trying to resend an invitation.`)
      return
    }

    resendInvitationRequest({
      invitationId: invitation.id,
      onDone: () => {
        successToast(`Your invitation to ${invitation.email} has been resent.`)
        trackPeopleResendInvite({ action: 'single' })
      },
      onError: () => {
        errorToast(`We were unable to resend the invitation for ${invitation.email}.`)
        trackPeopleResendInviteFailed({ action: 'sigle' })
      }
    })
  }

  const handleRemove = () => {
    const { invite } = removeFlow
    setDeletingStatus('deleting')

    deleteInvitationBffRequest(invite.id)
      .then(() => {
        setDeletingStatus('closed')
        successToast(`Your invitation to ${invite.email} has been removed.`)
        removeInviteFromStoreRequest(invite.id)
        // analytics
        trackPeopleRemoveInvite({ action: 'single' })
      })
      .catch(() => {
        errorToast(`We were unable to remove the invitation for ${invite.email}.`)
      })
      .then(() => setDeletingStatus('closed'))
  }

  const removingInvite = invite => {
    setDeletingStatus('open')
    setRemoveFlow({ invite })
  }

  const startChangingRole = invite => setChangeRoleFlow({ invite })

  const startChangingSeatType = invite => setChangeSeatTypeFlow({ invite })

  const closeDialog = () => {
    setRemoveFlow({
      invite: undefined
    })
    setChangeRoleFlow({
      invite: undefined
    })
    setChangeSeatTypeFlow({
      invite: undefined
    })
  }

  const editRowItems = invite => {
    const items = []
    if (canManagePeoplePermission) {
      items.push({
        label: 'Resend invitation',
        type: 'item',
        onClick: () => handleResend(invite)
      })
    }

    if (canManageRole(invite.roleID, allowedRoles)) {
      items.push({
        label: 'Remove invitation',
        type: 'item',
        destructive: true,
        onClick: () => removingInvite(invite)
      })
      // unshift because using push would throw an error (Helios)
      items.unshift({
        label: 'Change role',
        type: 'item',
        onClick: () => startChangingRole(invite)
      })
    }

    return items
  }

  const renderTable = () => {
    const hasNoResults = pagination.isLoaded && displayedInvitations.length === 0
    let isEmpty = hasNoResults && !!searchQuery === false

    if (isEmpty && phase1bFlag) {
      isEmpty = !!dateFilter === false && !!seatType === false
    }

    const invitesRows = displayedInvitations.map(invite => {
      const columns = {
        name: <RowProfileInfo item={invite} isInvite showRoleBadge />
      }

      if (showSeatType) {
        columns.seatType = (
          <SeatType
            canChangeSeatType={canChangeSeatType}
            member={invite}
            seatTypeId={invite.seatTypeID}
            onChange={startChangingSeatType}
          />
        )
      }

      columns.date = (
        <Text order="body" color="text-darker">
          {moment(invite.latestInvite).fromNow() ?? 'N/A'}
        </Text>
      )

      const editRowMenuItems = editRowItems(invite)

      return {
        id: invite.id.toString(),
        selected: isRowChecked(invite),
        onSelectedChange() {
          handleRowClick(invite)
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
        title: phase1bFlag ? <SeatTypeFilterDropdown tab="invitations" /> : 'Seat type',
        width: '185px',
        renderWhenLoading: <LoadingLine />
      })
    }

    columns.push({
      id: 'date',
      title: phase1bFlag ? (
        <DateFilterDropdown
          align="right"
          filtersLabel="Invites"
          width={250}
          tab="invitations"
        />
      ) : (
        'Date'
      ),
      width: '160px',
      renderWhenLoading: <LoadingLine />
    })

    return (
      <>
        <NewTable
          selectable
          rows={invitesRows}
          columns={columns}
          loading={invitationsLoading}
          loadingRowCount={3}
          hideHeaders={isEmpty}
        />
        <Pagination
          isTableLoaded={invitationsLoading === false}
          label="Invitations"
          items={displayedInvitations}
          totalItems={processedInvitationsCount}
        />

        {isEmpty && (
          <Padded top="l">
            <Animation speed="fast" order="drop-in-bottom">
              <BlockerCard title="Grow your team anytime" image={Image}>
                Your team currently does not have any pending invitations. When you do, you can
                send reminders or remove them here. Try sending a few invites now.
              </BlockerCard>
            </Animation>
          </Padded>
        )}
        {!isEmpty && hasNoResults && (
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
    <>
      {renderTable()}
      <div style={{ flex: '1 0 auto' }} />

      <DeleteConfirmationDialog
        title="Are you sure you want to do this?"
        open={deletingStatus === 'open' || deletingStatus === 'deleting'}
        onConfirm={() => handleRemove()}
        onBack={() => setDeletingStatus('closed')}
        positiveText="Remove invitation from team"
        negativeText="Cancel"
        illustration={deleteImage}
        loading={deletingStatus === 'deleting'}
      />
      <ChangeRoleDialog
        item={changeRoleFlow.invite}
        onClose={closeDialog}
        onSubmit={onChangeRole}
      />
      <ChangeSeatTypeDialog
        type="invitation"
        item={changeSeatTypeFlow.invite}
        onClose={closeDialog}
        onSubmit={onChangeSeatType}
      />
      <BulkBar
        page="invitations"
        chooseId={invite => invite.id}
        bulkEditableItems={allInvites}
        allItems={allInvites}
        totalItems={processedInvitationsCount}
        onVisible={() => fetchAllInvitationsRequest({ background: true })}
      />
    </>
  )
}

export default Invitations
