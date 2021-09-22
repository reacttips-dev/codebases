import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Alert, Spaced } from '@invisionapp/helios'
import { GlobalHeader, GlobalHeaderContainer } from '@invisionapp/helios/composites'
import { Link as RouterLink } from 'react-router'
import styled from 'styled-components'

import {
  fetchAllMembers,
  selectTotalGuestsCount,
  selectTotalMembersCount
} from '../stores/members'
import {
  selectInvitationsPagination,
  fetchInvitations,
  fetchAllInvitations
} from '../stores/invitations'
import { fetchBillingInfo } from '../stores/billing'
import { selectRemovedUsersLen, load as loadRemovedUsers } from '../stores/removedUsers'
import { fetchUserGroups, selectUserGroupsLength } from '../stores/userGroups'
import { resetBulkItems } from '../stores/bulkItems'
import { selectBanner, hideBanner } from '../stores/banner'
import { openInviteUser, closeInviteUser, openCreateUserGroup } from '../stores/pageHeader'
import { selectPermission } from '../stores/permissions'
import { blockInviteUsers, selectPaywall } from '../auth/blockerSelectors'

import Notification from '../components/Notification'
import { GlobalNavigation } from '../components/GlobalNavigation'

import { PeopleIcon } from '../components/icons/PeopleIcon'
import { GuestIcon } from '../components/icons/GuestIcon'
import { UserGroupsIcon } from '../components/icons/UserGroupsIcon'

import { removeLocationQuery, selectLocation } from '../stores/location'

import InviteDialog from '../components/dialogs/InviteDialog'
import ExportMenu from '../components/ExportMenu'

import { trackPeopleViewed } from '../helpers/analytics'
import { selectAllowExporting } from '../stores/featureFlags'

// ------ layouts/People ------

const isActivePath = (pathname, target) => pathname.indexOf(target) === 0
const isPage = (pathname, page) => pathname.includes(page)

const People = props => {
  const { children } = props
  const dispatch = useDispatch()

  // --- Permissions ---
  const canViewGroupsPermission = useSelector(state =>
    selectPermission(state, 'People.ViewGroups')
  )
  const canViewInvitesPermission = useSelector(state =>
    selectPermission(state, 'People.ViewInvites')
  )
  const canRemoveMemberPermission = useSelector(state =>
    selectPermission(state, 'People.RemoveMember')
  )
  const canManagePeoplePermission = useSelector(state =>
    selectPermission(state, 'People.ManageTeam')
  )
  const canManageGroupsPermission = useSelector(state =>
    selectPermission(state, 'People.ManageGroups')
  )
  const canExportCSVPermission = useSelector(state =>
    selectPermission(state, 'People.ExportCSV')
  )

  // --- Hooks ---
  const [inviteFlow, setInviteFlow] = useState({ isOpen: false })

  // --- Selectors ---
  const allowExporting = useSelector(selectAllowExporting)

  const invitations = useSelector(selectInvitationsPagination)

  const removedUsersLen = useSelector(selectRemovedUsersLen)
  const userGroupsLen = useSelector(selectUserGroupsLength)
  const location = useSelector(selectLocation)
  const banner = useSelector(selectBanner)
  const showPaywall = useSelector(blockInviteUsers)
  const paywall = useSelector(selectPaywall)
  const totalMembersCount = useSelector(selectTotalMembersCount)
  const totalGuestsCount = useSelector(selectTotalGuestsCount)

  // --- Dispatchers ---
  const fetchAllMembersRequest = useCallback(options => dispatch(fetchAllMembers(options)), [
    dispatch
  ])
  const fetchInvitationsRequest = useCallback(
    (limit, offset) => dispatch(fetchInvitations.request(limit, offset)),
    [dispatch]
  )
  const fetchAllInvitationsRequest = useCallback(() => dispatch(fetchAllInvitations()), [
    dispatch
  ])
  const fetchRemovedUsersRequest = useCallback(() => dispatch(loadRemovedUsers()), [dispatch])
  const fetchBillingInfoRequest = useCallback(() => dispatch(fetchBillingInfo()), [dispatch])
  const fetchUserGroupsRequest = useCallback(() => dispatch(fetchUserGroups()), [dispatch])
  const resetBulkItemsRequest = useCallback(() => dispatch(resetBulkItems()), [dispatch])
  const resetPeopleBannerRequest = useCallback(() => dispatch(hideBanner()), [dispatch])

  /* -- basics --  */
  useEffect(() => {
    document.title = 'People - InVision'
  }, [])

  /* -- billable users --  */
  useEffect(() => {
    fetchBillingInfoRequest()
  }, [location.pathname, fetchBillingInfoRequest])

  /* -- members --  */
  useEffect(() => {
    fetchAllMembersRequest()
  }, [location.pathname, fetchAllMembersRequest])

  /* -- invitations --  */
  useEffect(() => {
    if (canViewInvitesPermission) {
      if (isPage(location.pathname, 'invitations')) {
        fetchAllInvitationsRequest()
      } else {
        fetchInvitationsRequest()
      }
    }
  }, [
    canViewInvitesPermission,
    fetchAllInvitationsRequest,
    fetchInvitationsRequest,
    location.pathname
  ])

  /* -- user groups --  */
  useEffect(
    () => {
      if (canViewGroupsPermission) {
        fetchUserGroupsRequest()
      }
    },
    [canViewGroupsPermission, fetchUserGroupsRequest],
    location.pathname
  )

  /* -- removed users --  */
  useEffect(() => {
    if (canRemoveMemberPermission) {
      fetchRemovedUsersRequest()
    }
  }, [canRemoveMemberPermission, fetchRemovedUsersRequest, location.pathname])

  /* -- reset --  */
  useEffect(() => {
    // reset all the states and requests
    setInviteFlow({ isOpen: false })
    resetBulkItemsRequest()
    resetPeopleBannerRequest()
    removeLocationQuery()

    // analytics
    trackPeopleViewed(location.pathname)
  }, [location.pathname, resetBulkItemsRequest, resetPeopleBannerRequest])

  /* -- invite flow --  */
  useEffect(() => {
    if (isPage(location.pathname, 'add-invite') && inviteFlow.isOpen === false) {
      setInviteFlow({ isOpen: true })
    }
  }, [location.pathname, inviteFlow.isOpen])

  const closeInviteDialog = () => {
    closeInviteUser(location.pathname)
  }

  const navItems = () => {
    const element = RouterLink

    const navItems = [
      {
        to: '/teams/people/members',
        label: `Members (${totalMembersCount})`,
        element,
        active: isActivePath(location.pathname, '/teams/people/members')
      },
      {
        to: '/teams/people/guests',
        label: `Guests (${totalGuestsCount})`,
        element,
        active: isActivePath(location.pathname, '/teams/people/guests')
      },
      canViewInvitesPermission
        ? {
            to: '/teams/people/invitations',
            label: `Invitations (${invitations.totalCount})`,
            element,
            active: isActivePath(location.pathname, '/teams/people/invitations')
          }
        : undefined,
      canViewGroupsPermission
        ? {
            to: '/teams/people/groups',
            label: `User groups (${userGroupsLen})`,
            element,
            id: 'user-groups-tab',
            active: isActivePath(location.pathname, '/teams/people/groups')
          }
        : undefined,
      canRemoveMemberPermission
        ? {
            to: '/teams/people/removed',
            label: `Removed users (${removedUsersLen})`,
            element,
            active: isActivePath(location.pathname, '/teams/people/removed')
          }
        : undefined
    ]

    return navItems.filter(navItem => !!navItem)
  }

  const renderContent = () => (
    <StyledDiv>
      <Notification />
      {banner.show && (
        <Spaced bottom="s">
          <Alert status={banner.status}>{banner.message}</Alert>
        </Spaced>
      )}
      {children}
      <InviteDialog isOpen={inviteFlow.isOpen} onClose={closeInviteDialog} />
    </StyledDiv>
  )

  // ManageTeam is similar to InviteMember, but it returns true when there are restrictions.
  // We want to show the paywal if there's a restriction (seat overquota).

  // No permissions to manage people:
  // Don't show the [+ Add] CTA
  if (canManagePeoplePermission === false) {
    return (
      <>
        <GlobalHeader
          title="People"
          items={navItems()}
          globalNav={<GlobalNavigation />}
          rightAlignedItems={canExportCSVPermission && allowExporting && <ExportMenu />}
          disableNavShadow
        />
        <GlobalHeaderContainer>{renderContent()}</GlobalHeaderContainer>
      </>
    )
  }

  // if cannot manage groups - show only invites:
  // open the invitation modal when clicking on the [+ Add]
  if (canManageGroupsPermission === false) {
    return (
      <>
        <GlobalHeader
          title="People"
          items={navItems()}
          ctaLabel={<>Add</>}
          ctaMenuItems={[
            'Invite',
            {
              title: 'Team members',
              subtitle: 'Members can access all open team documents and spaces',
              icon: <PeopleIcon />,
              onClick: () => {
                openInviteUser(location.pathname, showPaywall, paywall)
              }
            },
            {
              title: 'External guests',
              subtitle:
                'Intended for third-party stakeholders, guests can only access documents and spaces they are invited to',
              icon: <GuestIcon />,
              onClick: () => {
                openInviteUser(location.pathname, showPaywall, paywall, true)
              }
            }
          ]}
          globalNav={<GlobalNavigation />}
          rightAlignedItems={canExportCSVPermission && allowExporting && <ExportMenu />}
          disableNavShadow
        />
        <GlobalHeaderContainer>{renderContent()}</GlobalHeaderContainer>
      </>
    )
  }

  // can add members and is not Free plan
  // show the CTA [+ Add] and open the menu with
  // - People (send invite)
  // - User group (add user group)

  const menuItems = [
    'Invite',
    {
      title: 'Team members',
      subtitle: 'Members can access all open team documents and spaces',
      icon: <PeopleIcon />,
      onClick: () => {
        openInviteUser(location.pathname, showPaywall, paywall)
      }
    },
    {
      title: 'External guests',
      subtitle:
        'Intended for third-party stakeholders, guests can only access documents and spaces they are invited to',
      icon: <GuestIcon />,
      onClick: () => {
        openInviteUser(location.pathname, showPaywall, paywall, true)
      }
    },
    'Create',
    {
      title: 'User group',
      subtitle: 'Create user groups to quickly share documents with segments of your team',
      icon: <UserGroupsIcon />,
      onClick: openCreateUserGroup
    }
  ]

  return (
    <>
      <GlobalHeader
        title="People"
        items={navItems()}
        ctaLabel={<>Add</>}
        ctaMenuItems={menuItems}
        globalNav={<GlobalNavigation />}
        rightAlignedItems={canExportCSVPermission && allowExporting && <ExportMenu />}
        disableNavShadow
      />
      <GlobalHeaderContainer>{renderContent()}</GlobalHeaderContainer>
    </>
  )
}

const StyledDiv = styled.div`
  position: relative;
`

export default People
