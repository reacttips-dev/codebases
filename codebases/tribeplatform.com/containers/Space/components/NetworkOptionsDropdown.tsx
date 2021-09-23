import React, { useCallback, useEffect } from 'react'

import { Box } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import LoginCircleLineIcon from 'remixicon-react/LoginCircleLineIcon'
import LogoutCircleLineIcon from 'remixicon-react/LogoutCircleLineIcon'
import MoreLineIcon from 'remixicon-react/MoreLineIcon'
import Settings4LineIcon from 'remixicon-react/Settings4LineIcon'
import UserSettingsLineIcon from 'remixicon-react/UserSettingsLineIcon'

import { RoleType } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Dropdown,
  DropdownDivider,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  Link,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import useNavbar from 'containers/Network/hooks/useNavbar'
import useGetNetwork from 'containers/Network/useGetNetwork'

import useAuthMember from 'hooks/useAuthMember'
import { useResponsive } from 'hooks/useResponsive'

import { useLogout } from '../../Network/useLogout'

const styles = {
  dropdownIcon: {
    base: {
      size: 'xs',
      icon: <MoreLineIcon size="20px" />,
    },
    mobile: {
      backgroundColor: 'bg.secondary',
      borderEndRadius: 'base',
      borderStartRadius: 'base',
      p: 0,
      size: 'md',
    },
  },
}

export const NetworkOptionsList = () => {
  const { authUser } = useAuthMember()
  const { network } = useGetNetwork()
  const { logout } = useLogout()
  const { asPath } = useRouter()
  const onLogin = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }, [])

  const { authorized: loginNetworkPermision } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'loginNetwork',
  )
  const canLogin =
    (!authUser || authUser?.role?.type === RoleType.GUEST) &&
    loginNetworkPermision

  const { authorized: canUpdateNetwork } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'updateNetwork',
  )

  return (
    <Box zIndex="popover">
      <DropdownList>
        {canLogin && (
          <DropdownItem
            onClick={onLogin}
            icon={LoginCircleLineIcon}
            data-testid="network-login-di"
          >
            <Trans i18nKey="network.login" defaults="Login" />
          </DropdownItem>
        )}
        {authUser && authUser?.role?.type !== RoleType.GUEST && (
          <>
            {canUpdateNetwork && (
              <NextLink href="/admin/network/settings" passHref>
                <DropdownItem
                  as={Link}
                  icon={Settings4LineIcon}
                  data-testid="network-settings-di"
                  marginBottom={1}
                >
                  <Trans
                    i18nKey="common:space.sidebar.network"
                    defaults="Administration"
                  />
                </DropdownItem>
              </NextLink>
            )}
            <NextLink
              href="/member/[memberId]/edit"
              as={`/member/${authUser?.id}/edit?from=${asPath}`}
              passHref
            >
              <DropdownItem
                as={Link}
                icon={UserSettingsLineIcon}
                data-testid="account-settings-di"
              >
                <Trans
                  i18nKey="common:space.sidebar.account"
                  defaults="Account settings"
                />
              </DropdownItem>
            </NextLink>

            <DropdownDivider />

            <DropdownItem
              onClick={logout}
              icon={LogoutCircleLineIcon}
              data-testid="network-logout-di"
            >
              <Trans i18nKey="network.logout" defaults="Log out" />
            </DropdownItem>
          </>
        )}
      </DropdownList>
    </Box>
  )
}
export const NetworkOptionsDropdown = () => {
  const { authUser } = useAuthMember()
  const { isMobile, mobileHeader, isSidebarOpen, isPhone } = useResponsive()
  const { hasNavbar } = useNavbar()
  const isClient = typeof window !== 'undefined'

  const optionsDropdown = (
    <Dropdown
      isMobile={isPhone}
      placement={isMobile ? 'top-end' : 'right-start'}
      isLazy
      strategy="fixed"
    >
      <DropdownIconButton
        data-testid="network-options-dd-icon"
        {...styles.dropdownIcon.base}
        {...(isMobile && styles.dropdownIcon.mobile)}
      />
      {isClient && <NetworkOptionsList />}
    </Dropdown>
  )

  useEffect(() => {
    if (isSidebarOpen && authUser) {
      mobileHeader.setRight(optionsDropdown)
    }

    // Options dropdown is new each time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen, mobileHeader, authUser])

  if (isMobile || !authUser || hasNavbar) {
    return null
  }

  return optionsDropdown
}
