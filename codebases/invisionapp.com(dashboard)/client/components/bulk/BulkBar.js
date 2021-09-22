import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _uniq from 'lodash/uniq'
import styled from 'styled-components'
import {
  Button,
  Flex,
  IconButton,
  Link,
  LoadingDots,
  Padded,
  Spaced
} from '@invisionapp/helios'
import { Trash } from '@invisionapp/helios/icons'
import pluralize from 'pluralize'
import { GlobalHeaderContainer } from '@invisionapp/helios/composites'

import Permission from '../Permission'
import Feature from '../Feature'

import {
  addSelectAllBulkItems,
  addSelectPageBulkItems,
  deleteBulkItems,
  resendBulkInvites,
  resetBulkItems,
  selectBulkIds,
  selectCanSelectAllAll,
  selectDidSelectAll,
  selectHasBulkItems,
  selectItemsFromBulkIds
} from '../../stores/bulkItems'
import { startBulkReinvitingUsers, load as loadRemovedUsers } from '../../stores/removedUsers'
import {
  bulkChangeRole,
  bulkChangeSeatType,
  fetchAllMembers,
  getSeatType,
  updateBulkMembers
} from '../../stores/members'
import {
  bulkChangeInvitationsRole,
  bulkChangeInvitationsSeatType,
  fetchAndReplaceInvitations,
  fetchInvitations,
  updateBulkInvitations
} from '../../stores/invitations'
import { selectIsMultiSeatPlan } from '../../stores/billing'
import { fetchUserGroups } from '../../stores/userGroups'
import { selectUseV2MembersFlag } from '../../stores/featureFlags'

import useEscapeKey from '../../hooks/useEscapeKey'
import useToast from '../../hooks/useToast'
import usePeopleBanner from '../../hooks/usePeopleBanner'

import ChangeRoleDropdown from './ChangeRoleDropdown'
import ChangeSeatTypeDropdown from './ChangeSeatTypeDropdown'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import RoleChangeConfirmationDialog from './RoleChangeConfirmationDialog'

import {
  trackPeopleRemoveInvite,
  trackPeopleRemoveUser,
  trackPeopleResendInvite,
  trackPeopleResendInviteFailed,
  trackPeopleRoleChange
} from '../../helpers/analytics'

import { GENERAL_ERROR_MESSAGE } from '../../constants'

const BAR_TRANSITION_LENGTH = 150

const BulkBarComponent = props => {
  const { bulkEditableItems = [], allItems = [], totalItems = 0, onVisible = () => {} } = props

  const dispatch = useDispatch()

  // Hooks
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [forceHide, setForceHide] = useState(false)
  const [deletingStatus, setDeletingStatus] = useState('closed') // closed | open | deleting
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving
  const { successToast, errorToast } = useToast()
  const { alertPeopleBanner, hidePeopleBanner } = usePeopleBanner()
  const [needsRoleChangeConfirmation, setNeedsRoleChangeConfirmation] = useState(false)
  const [roleId, setRoleId] = useState(null)

  // Selectors
  const bulkIds = useSelector(selectBulkIds)
  const bulkItems = useSelector(selectItemsFromBulkIds(allItems))
  const isVisible = useSelector(selectHasBulkItems)
  const didSelectAll = useSelector(selectDidSelectAll(bulkEditableItems))
  const isMultiSeatPlan = useSelector(selectIsMultiSeatPlan)
  const showPerfImprovesFlag = useSelector(selectUseV2MembersFlag)

  // Dispatchers
  const fetchAllMembersRequest = options => dispatch(fetchAllMembers(options))
  const loadRemovedUsersRequest = () => dispatch(loadRemovedUsers)

  const canSelectAllAll =
    useSelector(selectCanSelectAllAll(bulkEditableItems)) &&
    totalItems > bulkEditableItems.length

  const hasMoreThanOneSelected = bulkItems.length > 1

  const smoothlyCloseBar = () => {
    hidePeopleBanner()

    setForceHide(true)

    setTimeout(() => {
      dispatch(resetBulkItems())
      setForceHide(false)
    }, BAR_TRANSITION_LENGTH / 2)
  }

  useEscapeKey(() => {
    if (!isDropdownOpen) {
      smoothlyCloseBar()
    }
  }, [isDropdownOpen])

  // TODO: remove me when removing the FF:
  // team-management-web-accts-5535-performance-improvements
  useEffect(() => {
    // no need to fetch all on visible if the perf improvements FF is ON
    if (showPerfImprovesFlag) {
      return
    }

    if (isVisible) {
      onVisible()
    }
  }, [isVisible])

  const handleToggleSelectAllClick = useCallback(() => {
    const ids = bulkEditableItems.map(props.chooseId)

    if (didSelectAll) {
      // clicked on 'Deselect all'
      smoothlyCloseBar()
    } else {
      // clicked on 'Select all'
      dispatch(addSelectPageBulkItems(ids))
    }
  }, [bulkEditableItems, didSelectAll])

  const handleSelectAllAllClick = () => {
    const ids = allItems.map(props.chooseId)
    dispatch(addSelectAllBulkItems(ids))
  }

  const formatFailures = (failures, itemType) => {
    const failedIds = failures.filter(resp => resp.status === 'failed').map(resp => resp.id)

    if (failedIds.length === 0) {
      return []
    }

    const [failedId1, failedId2] = failedIds

    const failedItems = bulkEditableItems
      .filter(item => item.id === failedId1 || item.id === failedId2)
      .map(item => item[itemType])

    // the rest of the failed items
    if (failedIds.length > 2) {
      failedItems.push(`and ${failedIds.length - 2} more`)
    }

    return failedItems
  }

  const getItemsCountLabel = () => {
    switch (props.page) {
      case 'invitations':
        return 'invitation'
      case 'userGroups':
        return 'user group'
      default:
        // 'members' - 'removedUsers' - 'guests'
        return 'user'
    }
  }

  const deleteMembers = data => {
    return deleteBulkItems({ members: data }, 'members')
      .then(({ fulfilled, failed, hasFailures, hasSuccesses }) => {
        const failedNames = formatFailures(failed, 'name')

        if (hasSuccesses) {
          successToast(
            `${fulfilled.length} ${pluralize(
              getItemsCountLabel(),
              fulfilled.length
            )} successfully removed`
          )
          fetchAllMembersRequest({ background: true, force: true })
          loadRemovedUsersRequest()

          // anaytics - success
          trackPeopleRemoveUser({
            action: 'bulk',
            targeted_userid: fulfilled.map(item => item.id),
            selected_all: fulfilled.length + failed.length === totalItems
          })
        }

        if (hasFailures) {
          alertPeopleBanner(`${failedNames.join(', ')} could not be removed`)
        }

        // Resetting bulk items here because there's a modal involved in the process
        if (!hasFailures) {
          dispatch(resetBulkItems())
        }
      })
      .catch(() => errorToast(GENERAL_ERROR_MESSAGE))
  }

  const deleteInvites = data => {
    return deleteBulkItems({ invitations: data }, 'invitations')
      .then(({ fulfilled, failed, hasFailures, hasSuccesses }) => {
        const failedEmails = formatFailures(failed, 'email')

        if (hasSuccesses) {
          successToast(
            `${fulfilled.length} ${pluralize(
              getItemsCountLabel(),
              fulfilled.length
            )} successfully removed`
          )
          dispatch(fetchAndReplaceInvitations.request())

          // anaytics - success
          trackPeopleRemoveInvite({
            action: 'bulk',
            targeted_userid: fulfilled.map(item => item.id),
            selected_all: fulfilled.length + failed.length === totalItems
          })
        }

        if (hasFailures) {
          alertPeopleBanner(`${failedEmails.join(', ')} could not be removed`)
        }

        // Resetting bulk items here because there's a modal involved in the process
        if (!hasFailures) {
          dispatch(resetBulkItems())
        }
      })
      .catch(() => errorToast(GENERAL_ERROR_MESSAGE))
  }

  const deleteUserGroups = data => {
    return deleteBulkItems({ userGroups: data }, 'user-groups')
      .then(({ fulfilled, failed, hasFailures, hasSuccesses }) => {
        const failedNames = formatFailures(failed, 'name')

        if (hasSuccesses) {
          successToast(
            `${fulfilled.length} ${pluralize(
              getItemsCountLabel(),
              fulfilled.length
            )} successfully removed`
          )
          dispatch(fetchUserGroups({ background: true }))

          // anaytics - success HERE
        }

        if (hasFailures) {
          alertPeopleBanner(`${failedNames.join(', ')} could not be removed`)
        }

        // Resetting bulk items here because there's a modal involved in the process
        if (!hasFailures) {
          dispatch(resetBulkItems())
        }
      })
      .catch(() => errorToast(GENERAL_ERROR_MESSAGE))
  }

  const changeSeatType = (data, seatTypeID) => {
    dispatch(updateBulkMembers(bulkIds))

    return bulkChangeSeatType(data)
      .then(() => {
        const itemsActuallyChanged = bulkItems.filter(itm => {
          return itm.seatTypeID !== seatTypeID
        }).length

        successToast(
          `${itemsActuallyChanged} seat ${pluralize(
            'type',
            itemsActuallyChanged
          )} successfully updated`
        )

        smoothlyCloseBar()

        // TODO: track bulk billing type change

        fetchAllMembersRequest({ background: true, force: true })
      })
      .catch(() => errorToast(GENERAL_ERROR_MESSAGE))
      .finally(() => fetchAllMembersRequest({ background: true, force: true }))
  }

  const changeMemberRole = (data, roleID) => {
    dispatch(updateBulkMembers(bulkIds))

    return bulkChangeRole(data)
      .then(() => {
        const itemsActuallyChanged = bulkItems.filter(itm => itm.roleID !== roleID).length

        successToast(
          `${itemsActuallyChanged} ${pluralize(
            'role',
            itemsActuallyChanged
          )} successfully updated`
        )

        smoothlyCloseBar()

        // analytics
        trackPeopleRoleChange({
          action: 'bulk',
          targeted_userid: data.map(item => item.userID),
          new_role: roleID,
          selected_all: data.length === totalItems
        })
      })
      .catch(() => errorToast(GENERAL_ERROR_MESSAGE))
      .finally(() => fetchAllMembersRequest({ background: true, force: true }))
  }

  const changeInviteRole = (data, roleID) => {
    dispatch(updateBulkInvitations(bulkIds))

    return bulkChangeInvitationsRole(data)
      .then(({ hasSuccesses, hasFailures, failed, fulfilled }) => {
        const failedEmails = formatFailures(failed, 'email')

        let failedLen = 0
        if (hasFailures) {
          // get the failed items with a different roleID
          failedLen = bulkItems.filter(itm =>
            failed.some(f => itm.id === f.id && itm.role !== roleID)
          ).length
        }
        const itemsActuallyChanged =
          bulkItems.filter(itm => itm.roleID !== roleID).length - failedLen

        // Toast
        if (hasSuccesses) {
          successToast(
            `${itemsActuallyChanged} ${pluralize(
              'role',
              itemsActuallyChanged
            )} successfully updated`
          )
        }

        // Banner
        if (hasFailures) {
          alertPeopleBanner(`${failedEmails.join(', ')} could not be updated`)
        }

        // analytics
        trackPeopleRoleChange({
          action: 'bulk',
          targeted_userid: fulfilled.map(item => item.id),
          new_role: roleID,
          selected_all: fulfilled.length + failed.length === totalItems
        })

        // Bar
        if (!hasFailures) {
          smoothlyCloseBar()
        }
      })
      .catch(() => errorToast(GENERAL_ERROR_MESSAGE))
      .finally(() => dispatch(fetchAndReplaceInvitations.request({ background: true })))
  }

  const changeInviteSeatType = (data, seatTypeID) => {
    dispatch(updateBulkInvitations(bulkIds))

    return bulkChangeInvitationsSeatType(data)
      .then(({ hasSuccesses, hasFailures, failed }) => {
        const failedEmails = formatFailures(failed, 'email')

        let failedLen = 0
        if (hasFailures) {
          // get the failed items with a different seatTypeID
          failedLen = bulkItems.filter(itm =>
            failed.some(f => itm.id === f.id && itm.seatTypeID !== seatTypeID)
          ).length
        }
        const itemsActuallyChanged =
          bulkItems.filter(itm => itm.seatTypeID !== seatTypeID).length - failedLen

        // Toast
        if (hasSuccesses) {
          successToast(
            `${itemsActuallyChanged} ${pluralize(
              'role',
              itemsActuallyChanged
            )} successfully updated`
          )
        }

        // Banner
        if (hasFailures) {
          alertPeopleBanner(`${failedEmails.join(', ')} could not be updated`)
        }

        // Bar
        if (!hasFailures) {
          smoothlyCloseBar()
        }
      })
      .catch(() => errorToast(GENERAL_ERROR_MESSAGE))
      .finally(() => dispatch(fetchAndReplaceInvitations.request({ background: true })))
  }

  // ****** SEND INVITES: Removed Users ******
  const handleSendInvites = () => dispatch(startBulkReinvitingUsers(bulkIds))

  const handleChangeRole = roleID => {
    // Action is not visible if length < 1

    setRoleId(null)
    setNeedsRoleChangeConfirmation(false)

    // roleID sentinel
    if (!roleID || roleID < 1 || roleID > 5) {
      errorToast(GENERAL_ERROR_MESSAGE)
    }

    // Once the Change role dropdown menu is ready, I send the relative roleID
    const data = bulkIds.map(item => {
      return { roleID, invitationID: item, userID: item }
    })

    hidePeopleBanner()
    setSaveStatus('saving')

    if (props.page === 'members' || props.page === 'guests') {
      changeMemberRole(data, roleID).then(() => setSaveStatus('idle'))
    }

    if (props.page === 'invitations') {
      changeInviteRole(data, roleID).then(() => setSaveStatus('idle'))
    }
  }

  // ****** CHANGE SEAT TYPE: members, guests and invitations ******
  const handleChangeSeatType = useCallback(
    seatTypeID => {
      // seatTypeID sentinel
      if (!seatTypeID || seatTypeID < 1) {
        errorToast(GENERAL_ERROR_MESSAGE)
      }

      const data = bulkIds.map(item => ({
        invitationID: item,
        seatTypeID,
        userID: item
      }))

      hidePeopleBanner()
      setSaveStatus('saving')

      if (props.page === 'members' || props.page === 'guests') {
        changeSeatType(data, seatTypeID).then(() => setSaveStatus('idle'))
      }

      if (props.page === 'invitations') {
        changeInviteSeatType(data, seatTypeID).then(() => setSaveStatus('idle'))
      }
    },
    [bulkIds, successToast, errorToast]
  )

  // ****** RESEND INVITES: invitations ******
  const handleResendInvitations = () => {
    const data = bulkIds.map(item => {
      return { userID: item }
    })

    hidePeopleBanner()
    setSaveStatus('saving')

    resendBulkInvites({ invitations: data })
      .then(({ fulfilled, failed, hasFailures, hasSuccesses }) => {
        const failedEmails = formatFailures(failed, 'email')

        if (hasSuccesses) {
          successToast(
            `${fulfilled.length} ${pluralize(
              getItemsCountLabel(),
              fulfilled.length
            )} ${pluralize('has', fulfilled.length)} been successfully resent`
          )
          dispatch(fetchInvitations.request())

          // analytics
          trackPeopleResendInvite({
            action: 'bulk',
            targeted_userid: fulfilled.map(item => item.id),
            selected_all: fulfilled.length + failed.length === totalItems
          })
        }

        if (hasFailures) {
          alertPeopleBanner(`${failedEmails.join(', ')} could not be sent`)
          // analytics
          trackPeopleResendInviteFailed({
            action: 'bulk',
            targeted_userid: failed.map(item => item.id),
            selected_all: fulfilled.length + failed.length === totalItems
          })
        }

        if (!hasFailures) {
          smoothlyCloseBar()
        }
      })
      .catch(() => errorToast(GENERAL_ERROR_MESSAGE))
      .finally(() => setSaveStatus('idle'))
  }

  // ****** REMOVE: members - invitations - userGroups *******
  const handleRemove = () => {
    setDeletingStatus('deleting')

    const data = bulkIds.map(item => {
      return { userID: item }
    })

    setSaveStatus('saving')

    switch (props.page) {
      case 'members':
      case 'guests':
        deleteMembers(data).then(() => {
          setSaveStatus('idle')
          setDeletingStatus('closed')
        })
        break
      case 'invitations':
        deleteInvites(data).then(() => {
          setSaveStatus('idle')
          setDeletingStatus('closed')
        })
        break
      case 'userGroups':
        deleteUserGroups(data).then(() => {
          setSaveStatus('idle')
          setDeletingStatus('closed')
        })
        break
      default: // do nothing
    }
  }

  const renderActions = () => {
    const selectedRoles = _uniq(bulkItems.map(item => item.roleID))
    const selectedSeatTypes = _uniq(bulkItems.map(getSeatType).filter(item => !!item))

    // members | guests | invitations | removedUsers
    switch (props.page) {
      case 'members':
      case 'guests':
        return (
          <>
            <ChangeRoleDropdown
              onRoleChange={handleChangeRole}
              onChangeVisibility={visibility => setDropdownOpen(visibility.open)}
              disabled={saveStatus === 'saving'}
              selectedRoles={selectedRoles}
            />
            {isMultiSeatPlan && (
              <Feature
                flag="team-management-web-accts-5318-seat-type"
                renderActive={
                  <Permission for="People.ChangeSeatType">
                    <>
                      <Padded horizontal="xs"> </Padded>
                      <ChangeSeatTypeDropdown
                        disabled={saveStatus === 'saving'}
                        label="Change seat type"
                        onChange={handleChangeSeatType}
                        onChangeVisibility={visibility => setDropdownOpen(visibility.open)}
                        selectedSeats={selectedSeatTypes}
                      />
                    </>
                  </Permission>
                }
              />
            )}
          </>
        )
      case 'invitations':
        return (
          <>
            <Spaced horizontal="m">
              <ChangeRoleDropdown
                onRoleChange={handleChangeRole}
                onChangeVisibility={visibility => setDropdownOpen(visibility.open)}
                disabled={saveStatus === 'saving'}
                selectedRoles={selectedRoles}
              />
            </Spaced>

            {isMultiSeatPlan && (
              <Feature
                flag="team-management-web-accts-5318-seat-type"
                renderActive={
                  <Permission for="People.ChangeSeatType">
                    <Padded horizontal="xs"> </Padded>
                    <ChangeSeatTypeDropdown
                      disabled={saveStatus === 'saving'}
                      label="Change seat type"
                      onChange={handleChangeSeatType}
                      onChangeVisibility={visibility => setDropdownOpen(visibility.open)}
                      selectedSeats={selectedSeatTypes}
                    />
                  </Permission>
                }
              />
            )}

            <Spaced left="m">
              <Button order="secondary" size="smaller" onClick={handleResendInvitations}>
                Resend {pluralize('invite', bulkIds.length)}
              </Button>
            </Spaced>
          </>
        )
      case 'removedUsers': {
        return (
          <Spaced horizontal="m">
            <Button order="secondary" size="smaller" onClick={handleSendInvites}>
              Send {pluralize('invite', bulkIds.length)}
            </Button>
          </Spaced>
        )
      }
      default:
        return undefined
    }
  }

  const renderRemove = () => {
    switch (
      props.page // members | guests | invitations | removedUsers | userGroups
    ) {
      case 'members':
      case 'guests':
      case 'invitations':
      case 'userGroups':
        return (
          <Spaced horizontal="s">
            <IconButton
              tooltip={
                <>
                  Remove {bulkIds.length} {pluralize(getItemsCountLabel(), bulkIds.length)}
                  <br /> from the team
                </>
              }
            >
              <Trash
                fill="text"
                style={{ cursor: 'pointer' }}
                onClick={() => setDeletingStatus('open')}
              />
            </IconButton>
          </Spaced>
        )
      default:
        return undefined
    }
  }

  const renderedComponent = (
    <>
      <Wrapper isVisible={!forceHide && isVisible}>
        <GlobalHeaderContainer>
          <Bar>
            <Flex
              justifyContent="flex-start"
              alignItems="center"
              style={{ position: 'absolute', height: '100%', top: 0 }}
            >
              <BulkItemsCount>{bulkIds.length === 0 ? 1 : bulkIds.length}</BulkItemsCount>
              <Spaced left="xxs" right="m">
                <span>
                  {pluralize(getItemsCountLabel(), bulkIds.length)} selected
                  {/*
                Things don't jump around horizontally when words get pluralized, this adds
                fake padding with an invisible "s"
              */}
                  {!hasMoreThanOneSelected && <FakedPadding>s</FakedPadding>}
                </span>
              </Spaced>

              <SelectAllContainer>
                <Spaced right="m">
                  <Button
                    size="smaller"
                    order="secondary"
                    role="button"
                    key={(!!didSelectAll).toString()}
                    onClick={handleToggleSelectAllClick}
                  >
                    {didSelectAll ? `Deselect all` : `Select all`}
                  </Button>
                </Spaced>

                <SelectAllAllButton
                  role="button"
                  order="primary"
                  tabIndex="0"
                  onClick={handleSelectAllAllClick}
                  active={canSelectAllAll.toString()}
                >
                  Select all {allItems.length} {pluralize('users', totalItems)}
                </SelectAllAllButton>
              </SelectAllContainer>
            </Flex>

            <Flex
              justifyContent="flex-start"
              alignItems="center"
              style={{ position: 'absolute', height: '100%', top: 0, right: `5px` }}
            >
              {renderActions()}
              {renderRemove()}
            </Flex>
          </Bar>
        </GlobalHeaderContainer>
      </Wrapper>
      <DeleteConfirmationDialog
        open={deletingStatus === 'open' || deletingStatus === 'deleting'}
        onConfirm={() => handleRemove()}
        onBack={() => setDeletingStatus('closed')}
        isBackDisabled={deletingStatus === 'deleting'}
        buttonText={
          deletingStatus === 'deleting' ? (
            <LoadingDots color="white" />
          ) : (
            `Remove ${bulkIds.length} ${pluralize(getItemsCountLabel(), bulkIds.length)}`
          )
        }
        showExtraConfirmation={props.page === 'userGroups'}
        extraConfirmationText={'All group members will be removed from associated documents.'}
      />

      <RoleChangeConfirmationDialog
        open={needsRoleChangeConfirmation}
        onConfirm={() => handleChangeRole(roleId)}
        onCancel={() => setNeedsRoleChangeConfirmation(false)}
      />
    </>
  )

  return <Permission for="People.BulkEdit">{renderedComponent}</Permission>
}

const Wrapper = styled.div`
  position: fixed;
  z-index: 20;
  bottom: 24px;
  left: 0;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  @media (min-width: 1024px) {
    left: 280px;
    width: calc(100% - 280px);
  }
  text-align: center;
  transition: opacity ${BAR_TRANSITION_LENGTH}ms cubic-bezier(0.94, 0.01, 0.83, 0.86) 0s,
    transform ${BAR_TRANSITION_LENGTH}ms cubic-bezier(0.2, 0.91, 0.85, 0.96) 0s;

  ${({ isVisible }) => {
    if (isVisible) {
      return `
        transform: translateY(0px);
        opacity: 1;
      `
    }
    return `
      transform: translateY(70px);
      opacity: 0;
    `
  }};
`

const Bar = styled.div`
  position: relative;
  max-width: 797px;
  height: 63px;
  padding: 0px ${({ theme }) => theme.spacing.s};
  border: 1px solid #f2f2f2;
  margin: 0px auto;
  margin-right: -16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 9px 13px 0 rgba(0, 0, 0, 0.11), 0 3px 7px 0 rgba(0, 0, 0, 0);
`

const BulkItemsCount = styled.strong`
  display: inline-block;

  /*
    These values make sure that things around this don't jump when this number goes from 1 to
    2 digits
  */
  min-width: 20px;
  font-weight: 500;
  text-align: right;
`

const FakedPadding = styled.span`
  visibility: hidden;
`

const SelectAllContainer = styled.div`
  position: relative;
`

const SelectAllAllButton = styled(Link)`
  opacity: ${props => (props.active === 'true' ? 1 : 0)};
  pointer-events: ${props => (props.active === 'true' ? 'inherit' : 'none')};
  transition: opacity 200ms ${({ theme }) => theme.beziers.inOut};
`

export default BulkBarComponent
