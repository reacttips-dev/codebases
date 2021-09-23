import React, { forwardRef, memo, RefObject, useEffect, useState } from 'react'

import { Box, Circle } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Compass3FillIcon from 'remixicon-react/Compass3FillIcon'
import FileList2FillIcon from 'remixicon-react/FileList2FillIcon'
import MoreLineIcon from 'remixicon-react/MoreLineIcon'
import NotificationFillIcon from 'remixicon-react/NotificationFillIcon'
import SearchLineIcon from 'remixicon-react/SearchLineIcon'

import { NetworkLandingPage } from 'tribe-api/interfaces/interface.generated'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Avatar,
  Dropdown,
  DropdownButton,
  Link,
  Logo,
  Sidebar,
  SIDEBAR_ICON_SIZE,
  SIDEBAR_VISIBLE,
  SidebarItem,
  SidebarLabel,
  SidebarLeftElement,
  SidebarRightElement,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { SidebarFooter, SidebarHeader } from 'components/Layout'

import useNavbar from 'containers/Network/hooks/useNavbar'
import useGetNetwork from 'containers/Network/useGetNetwork'
import useLandingPage from 'containers/Network/useLandingPage'
import { useGetNotificationsCount } from 'containers/Notifications/hooks'
import Search from 'containers/Search'
import { useSearch } from 'containers/Search/hooks/useSearchModal'
import {
  NetworkOptionsDropdown,
  NetworkOptionsList,
} from 'containers/Space/components/NetworkOptionsDropdown'

import useAuthMember from 'hooks/useAuthMember'
import { useResponsive } from 'hooks/useResponsive'

import { SideBarHelpButton } from './SidebarHelpButton'
import { SidebarInviteMembersButton } from './SidebarInviteMembersButton'
import { SidebarNewCollectionButton } from './SidebarNewCollectionButton'
import SpaceSidebarCollections from './SpaceSidebarCollections'

const profilePaths = ['/member/[memberId]', '/member/[memberId]/edit']

const isActive = (activePathNames, authUser, router, href): boolean => {
  const { memberId } = router.query

  let isActive

  // If item's active state isn't controlled from outside
  if (activePathNames) {
    if (memberId != null && memberId !== authUser?.id) {
      isActive = false
    } else {
      isActive = activePathNames.includes(router?.pathname)
    }
  } else if (href) {
    isActive = router?.pathname === href
  }
  return isActive
}

type SpaceSidebarProps = {
  isPreview?: boolean
  isNavigationPreviewEnabled?: boolean
  isWhiteLabelPreviewEnabled?: boolean
}

const SpaceSidebar = ({
  isPreview,
  isNavigationPreviewEnabled,
  isWhiteLabelPreviewEnabled,
}: SpaceSidebarProps) => {
  const { network } = useGetNetwork()
  const { landingPage } = useLandingPage()
  const router = useRouter()
  const { authUser, isGuest, isNetworkAdmin } = useAuthMember()
  const { 'space-slug': spaceSlug } = router.query
  const [activeSpace, setActiveSpace] = useState(spaceSlug)
  const { hasNavbar } = useNavbar()
  const { responsive } = useResponsive()

  const { openSearchModal } = useSearch()

  const { newNotificationsCount } = useGetNotificationsCount()

  useEffect(() => {
    if (spaceSlug !== activeSpace) {
      setActiveSpace(spaceSlug)
    }
  }, [activeSpace, spaceSlug])

  const { authorized: hasNotificationsPermission } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'getNotifications',
  )
  const { authorized: hasSearchPermission } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'search',
  )
  const { authorized: canAddCollection } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'addGroup',
  )
  const { authorized: hasNetworkInvitePermissions } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'inviteMembers',
  )

  const userDisplayName = authUser?.displayName || authUser?.name

  const shouldHideSidebarHeader =
    typeof isNavigationPreviewEnabled !== 'undefined'
      ? isNavigationPreviewEnabled
      : hasNavbar

  const activeHomepage = isActive(['/'], authUser, router, '/')

  return (
    <>
      <Sidebar py={6}>
        <SidebarHeader
          display={{
            [SIDEBAR_VISIBLE]: shouldHideSidebarHeader ? 'none' : 'flex',
          }}
        >
          <NextLink href="/" passHref>
            <Logo src={network?.logo} name={network?.name} as={Link} />
          </NextLink>
          <NetworkOptionsDropdown />
        </SidebarHeader>
        <NextLink passHref href="/feed">
          <SidebarItem
            icon={FileList2FillIcon}
            active={
              isPreview ||
              isActive(['/feed'], authUser, router, '/feed') ||
              (landingPage === NetworkLandingPage.FEED && activeHomepage)
            }
            data-testid="sidebar-feed-link"
          >
            <Trans i18nKey="common:space.sidebar.feed" defaults="Feed" />
          </SidebarItem>
        </NextLink>
        <NextLink passHref href="/explore">
          <SidebarItem
            active={
              isActive(['/explore'], authUser, router, '/explore') ||
              (landingPage === NetworkLandingPage.EXPLORE && activeHomepage)
            }
            icon={Compass3FillIcon}
            data-testid="sidebar-explore-link"
          >
            <Trans i18nKey="common:space.sidebar.explore" defaults="Explore" />
          </SidebarItem>
        </NextLink>
        {hasSearchPermission && (
          <SidebarItem
            onClick={openSearchModal}
            data-testid="sidebar-search-button"
            icon={SearchLineIcon}
          >
            <Trans i18nKey="common:space.sidebar.search" defaults="Search" />
          </SidebarItem>
        )}
        {hasNotificationsPermission && (
          <NextLink passHref href="/notifications">
            <SidebarItem
              active={isActive(
                ['/notifications'],
                authUser,
                router,
                '/notifications',
              )}
              icon={NotificationFillIcon}
              data-testid="sidebar-notifications-link"
            >
              <SidebarLabel>
                <Trans
                  i18nKey="common:space.sidebar.notifications"
                  defaults="Notifications"
                />
              </SidebarLabel>
              {newNotificationsCount > 0 && (
                <SidebarRightElement>
                  <Circle
                    size={SIDEBAR_ICON_SIZE}
                    color="label.button"
                    bg="accent.base"
                    fontSize="0.625rem"
                  >
                    {newNotificationsCount}
                  </Circle>
                </SidebarRightElement>
              )}
            </SidebarItem>
          </NextLink>
        )}

        {/* Make this a new sidebar component if the need arises. */}
        {authUser && !isGuest && (
          <NextLink passHref href={`/member/${authUser?.id}`}>
            <SidebarItem
              active={isActive(
                profilePaths,
                authUser,
                router,
                '/member/[memberId]',
              )}
              data-testid="sidebar-profile-link"
            >
              <SidebarLeftElement>
                <Avatar
                  size={responsive?.[SIDEBAR_VISIBLE] ? 'xs' : 'md'}
                  src={authUser?.profilePicture}
                  name={userDisplayName}
                />
              </SidebarLeftElement>
              <SidebarLabel>
                <Trans
                  i18nKey="common:space.sidebar.profile"
                  defaults="Profile"
                />
              </SidebarLabel>
            </SidebarItem>
          </NextLink>
        )}

        {authUser && hasNavbar && (
          <Box
            display={{ base: 'none', [SIDEBAR_VISIBLE]: 'block' }}
            height={{ base: 12, [SIDEBAR_VISIBLE]: 9 }}
          >
            <Dropdown>
              <DropdownButton
                data-testid="network-options-dd-icon"
                // to remove the className
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                as={forwardRef(({ className, ...rest }, ref) => (
                  <SidebarItem
                    active={false}
                    {...rest}
                    ref={ref as RefObject<HTMLDivElement>}
                    icon={MoreLineIcon}
                    as="span"
                  >
                    <Trans
                      i18nKey="common:space.sidebar.more"
                      defaults="More"
                    />
                  </SidebarItem>
                ))}
              />
              <NetworkOptionsList />
            </Dropdown>
          </Box>
        )}

        <Box mt={4}>
          {hasNetworkInvitePermissions && <SidebarInviteMembersButton />}
          {canAddCollection && <SidebarNewCollectionButton />}
          {isNetworkAdmin && <SideBarHelpButton />}
        </Box>
        <SpaceSidebarCollections />
      </Sidebar>

      <SidebarFooter forceShowBranding={isWhiteLabelPreviewEnabled} />

      {hasSearchPermission && <Search />}
    </>
  )
}

export default memo(SpaceSidebar)
