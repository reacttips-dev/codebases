import React from 'react'

import NextLink from 'next/link'
import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import { PlanName } from 'tribe-api/interfaces'
import { hasActionPermission, hasInputPermission } from 'tribe-api/permissions'
import {
  Sidebar,
  SIDEBAR_VISIBLE,
  SidebarItem,
  SidebarRightElement,
  SkeletonProvider,
  Text,
  PlanBadge,
  Divider,
} from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

function AdminBrandingSidebar() {
  const { push } = useRouter()
  const { network, loading: loadingNetwork } = useGetNetwork()
  const { actionPermission: updateNetworkPermissions } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'updateNetwork',
  )

  const { authorized: canChangeWhiteLabel } = hasInputPermission(
    updateNetworkPermissions?.inputPermissions || [],
    'input.tribeBranding',
  )

  const { isEnabled: isWhiteLabelEnabled } = useTribeFeature(
    Features.WhiteLabelInitialRelease,
  )

  const goToMainAdminSettings = () => {
    return push('/admin/network/settings')
  }

  const WhiteLabel = () => (
    <SidebarItem>
      <Trans
        i18nKey="admin:sidebar.branding.whiteLabel"
        defaults="White-label"
      />

      <SidebarRightElement>
        <PlanBadge plan={PlanName.PREMIUM} isAuthorized={canChangeWhiteLabel} />
      </SidebarRightElement>
    </SidebarItem>
  )

  return (
    <SkeletonProvider loading={loadingNetwork}>
      <Sidebar pt={{ base: '5rem', [SIDEBAR_VISIBLE]: 8 }} pb={6}>
        <SidebarItem
          data-testid="sidebar-back-button"
          onClick={goToMainAdminSettings}
          icon={ArrowLeftLineIcon}
          variant="ghost"
          mb={6}
        >
          <Text textStyle="medium/small" color="label.secondary">
            <Trans i18nKey="admin:sidebar.theme.back" defaults="Back" />
          </Text>
        </SidebarItem>

        <Text textStyle="medium/large" color="label.primary">
          <Trans i18nKey="admin:sidebar.branding.back" defaults="Branding" />
        </Text>

        <Divider w="auto" my={5} mx={-6} />

        <NextLink passHref href="/admin/network/branding/colors">
          <SidebarItem>
            <Trans i18nKey="admin:sidebar.branding.colors" defaults="Colors" />
          </SidebarItem>
        </NextLink>

        <NextLink passHref href="/admin/network/branding/top-navigation">
          <SidebarItem>
            <Trans
              i18nKey="admin:sidebar.branding.topNavigation"
              defaults="Top Navigation"
            />
          </SidebarItem>
        </NextLink>

        {isWhiteLabelEnabled && canChangeWhiteLabel && (
          <NextLink passHref href="/admin/network/branding/white-label">
            <SidebarItem>
              <Trans
                i18nKey="admin:sidebar.branding.whiteLabel"
                defaults="White-label"
              />

              <SidebarRightElement>
                <PlanBadge
                  plan={PlanName.PREMIUM}
                  isAuthorized={canChangeWhiteLabel}
                />
              </SidebarRightElement>
            </SidebarItem>
          </NextLink>
        )}

        {isWhiteLabelEnabled && !canChangeWhiteLabel && (
          <NextLink passHref href="/admin/network/billing">
            {/* Doesn't work if i pass a functional component */}
            {WhiteLabel()}
          </NextLink>
        )}
      </Sidebar>
    </SkeletonProvider>
  )
}

export default AdminBrandingSidebar
