import React, { useCallback, useEffect } from 'react'

import { Spacer } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Apps2FillIcon from 'remixicon-react/Apps2FillIcon'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import BankCardFillIcon from 'remixicon-react/BankCardFillIcon'
import BarChartFillIcon from 'remixicon-react/BarChartFillIcon'
import BrushFillIcon from 'remixicon-react/BrushFillIcon'
import FileList2FillIcon from 'remixicon-react/FileList2FillIcon'
import GroupFillIcon from 'remixicon-react/GroupFillIcon'
import LoginCircleFillIcon from 'remixicon-react/LoginCircleFillIcon'
import Notification2FillIcon from 'remixicon-react/Notification2FillIcon'
import Settings4FillIcon from 'remixicon-react/Settings4FillIcon'
import WindowFillIcon from 'remixicon-react/WindowFillIcon'

import {
  Sidebar,
  SIDEBAR_VISIBLE,
  SidebarGroup,
  SidebarItem,
  SidebarLabel,
  SidebarLeftElement,
  Text,
  useResponsive,
} from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import { SidebarFooter } from 'components/Layout'

import { SidebarPlanBar } from 'containers/AdminSettings/components/SidebarPlanBar'
import { SpacesDropdown } from 'containers/AdminSettings/components/SpacesDropdown'
import { AppIcon } from 'containers/Apps/components/AppIcon'
import { DefaultApps } from 'containers/Apps/components/TabContent/SettingsContent/DefaultApps'
import { useAppBySlug } from 'containers/Apps/hooks/useAppBySlug'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { useSpace } from 'hooks/space/useSpace'
import useAuthMember from 'hooks/useAuthMember'

const AdminSidebar = () => {
  const { query, push, asPath } = useRouter()
  const spaceSlug = query['space-slug']
  const { network } = useGetNetwork()
  // authMember reaching this page either Admin or Moderator https://www.notion.so/tribeplatform/Roles-permissions-1d5cc1f5d62d471794492205eaae3f18
  const { isNetworkAdmin } = useAuthMember()
  const { space } = useSpace({
    variables: {
      slug: spaceSlug ? String(spaceSlug) : null,
    },
    skip: !spaceSlug,
  })

  const { isSidebarOpen, mobileHeader } = useResponsive()

  const { isEnabled: isAppStoreEnabled } = useTribeFeature(
    Features.AppsInitialRelease,
  )

  const { isEnabled: isDefaultNotificationSettingEnabled } = useTribeFeature(
    Features.DefaultNotificationSettings,
  )

  const isNetworkSetting = !spaceSlug

  useEffect(() => {
    if (!isSidebarOpen) return

    mobileHeader.setRight(null)
  }, [isSidebarOpen, mobileHeader, space])

  const goToHome = useCallback(() => {
    push('/')
  }, [push])

  const getAs = useCallback(
    (section, slug) => {
      if (!spaceSlug) {
        return `/admin/network/${section}`
      }
      return `/admin/space/${slug}/${section}`
    },
    [spaceSlug],
  )

  const spacePostTypeAppSlug =
    space?.spaceType?.name === 'Discussion'
      ? DefaultApps.Discussion
      : DefaultApps.QA

  const { app: postTypeApp } = useAppBySlug({
    slug: spacePostTypeAppSlug,
  })

  return (
    <>
      <Sidebar pt={{ base: '5rem', [SIDEBAR_VISIBLE]: 8 }} pb={6}>
        <SidebarItem
          data-testid="sidebar-back-button"
          onClick={goToHome}
          icon={ArrowLeftLineIcon}
          variant="ghost"
        >
          <Text isTruncated textStyle="medium/small" color="label.secondary">
            <Trans
              i18nKey="admin:sidebar.title"
              defaults="Back to {{ networkName }}"
              values={{ networkName: network?.name }}
            />
          </Text>
        </SidebarItem>

        <SpacesDropdown />

        {isNetworkAdmin && (
          <>
            <SidebarGroup
              display={{ base: 'none', [SIDEBAR_VISIBLE]: 'block' }}
              mb={4}
            >
              <Trans i18nKey="admin:sidebar.tools" defaults="Admin tools" />
            </SidebarGroup>

            <NextLink passHref href={getAs('settings', query['space-slug'])}>
              <SidebarItem
                active={query.section === 'settings'}
                icon={Settings4FillIcon}
                data-testid="sidebar-settings-link"
              >
                <Trans
                  i18nKey="admin:sidebar.items.settings"
                  defaults="Settings"
                />
              </SidebarItem>
            </NextLink>

            <NextLink passHref href={getAs('members', query['space-slug'])}>
              <SidebarItem
                data-testid="sidebar-members-link"
                active={query.section === 'members'}
                icon={GroupFillIcon}
              >
                <Trans
                  i18nKey="admin:sidebar.items.members"
                  defaults="Members"
                />
              </SidebarItem>
            </NextLink>

            {!isNetworkSetting && isDefaultNotificationSettingEnabled && (
              <NextLink
                passHref
                href={getAs('notifications', query['space-slug'])}
              >
                <SidebarItem
                  data-testid="sidebar-notifications-link"
                  active={query.section === 'notifications'}
                  icon={Notification2FillIcon}
                >
                  <Trans
                    i18nKey="admin:sidebar.items.notifications"
                    defaults="Notifications"
                  />
                </SidebarItem>
              </NextLink>
            )}

            {isNetworkSetting && (
              <NextLink
                passHref
                href={getAs('authentication', query['space-slug'])}
              >
                <SidebarItem
                  data-testid="sidebar-authentication-link"
                  active={query.section === 'authentication'}
                  icon={LoginCircleFillIcon}
                >
                  <Trans
                    i18nKey="admin:sidebar.items.authentication"
                    defaults="Authentication"
                  />
                </SidebarItem>
              </NextLink>
            )}

            {isNetworkSetting && (
              <NextLink passHref href={getAs('domain', query['space-slug'])}>
                <SidebarItem
                  data-testid="sidebar-domain-link"
                  active={query.section === 'domain'}
                  icon={WindowFillIcon}
                >
                  <Trans
                    i18nKey="admin:sidebar.items.domain"
                    defaults="Domain"
                  />
                </SidebarItem>
              </NextLink>
            )}

            <NextLink passHref href={getAs('analytics', query['space-slug'])}>
              <SidebarItem
                data-testid="sidebar-analytics-link"
                active={query.section === 'analytics'}
                icon={BarChartFillIcon}
              >
                <Trans
                  i18nKey="admin:sidebar.items.analytics"
                  defaults="Analytics"
                />
              </SidebarItem>
            </NextLink>

            {isNetworkSetting && (
              <NextLink passHref href={getAs('branding', query['space-slug'])}>
                <SidebarItem
                  data-testid="sidebar-theme-link"
                  active={query.section === 'branding'}
                  icon={BrushFillIcon}
                >
                  <Trans
                    i18nKey="admin:sidebar.items.theme"
                    defaults="Branding"
                  />
                </SidebarItem>
              </NextLink>
            )}

            {isNetworkSetting && isAppStoreEnabled && (
              <NextLink passHref href={getAs('apps', query['space-slug'])}>
                <SidebarItem
                  data-testid="sidebar-apps-link"
                  active={query.section === 'apps'}
                  icon={Apps2FillIcon}
                >
                  <Trans
                    i18nKey="admin:sidebar.items.apps.title"
                    defaults="Apps"
                  />
                </SidebarItem>
              </NextLink>
            )}

            {isNetworkSetting && (
              <NextLink passHref href={getAs('billing', query['space-slug'])}>
                <SidebarItem
                  active={
                    query.section === 'purchase' ||
                    asPath === '/admin/network/billing'
                  }
                  icon={BankCardFillIcon}
                >
                  <Trans
                    i18nKey="admin:sidebar.items.billing"
                    defaults="Billing"
                  />
                </SidebarItem>
              </NextLink>
            )}
          </>
        )}

        <SidebarGroup
          display={{ base: 'none', [SIDEBAR_VISIBLE]: 'block' }}
          my={4}
        >
          <Trans i18nKey="admin:sidebar.moderation" defaults="Moderation" />
        </SidebarGroup>

        <NextLink passHref href={getAs('pending-posts', query['space-slug'])}>
          <SidebarItem
            data-testid="sidebar-moderation-pending-posts"
            active={query.section === 'pending-posts'}
            icon={FileList2FillIcon}
          >
            <Trans
              i18nKey="admin:sidebar.items.moderation.pendingPosts"
              defaults="Pending posts"
            />
          </SidebarItem>
        </NextLink>

        {isNetworkSetting && (
          <NextLink passHref href="/admin/network/moderation/settings">
            <SidebarItem
              data-testid="sidebar-moderation-settings"
              active={asPath === '/admin/network/moderation/settings'}
              icon={Settings4FillIcon}
            >
              <Trans
                i18nKey="admin:sidebar.items.moderation.settings"
                defaults="Moderation settings"
              />
            </SidebarItem>
          </NextLink>
        )}

        {isAppStoreEnabled && spaceSlug && (
          <>
            <SidebarGroup
              display={{ base: 'none', [SIDEBAR_VISIBLE]: 'block' }}
              my={4}
            >
              <Trans
                i18nKey="admin:sidebar.appsSettings"
                defaults="Apps Settings"
              />
            </SidebarGroup>

            <NextLink
              passHref
              href={getAs(`apps/${spacePostTypeAppSlug}`, query['space-slug'])}
            >
              <SidebarItem
                active={
                  asPath ===
                  getAs(`apps/${spacePostTypeAppSlug}`, query['space-slug'])
                }
              >
                <SidebarLeftElement>
                  <AppIcon app={postTypeApp} size="5" />
                </SidebarLeftElement>
                <SidebarLabel>{postTypeApp?.name}</SidebarLabel>
              </SidebarItem>
            </NextLink>
          </>
        )}

        <Spacer mt={5} />
        <SidebarPlanBar />
      </Sidebar>

      <SidebarFooter />
    </>
  )
}

export default AdminSidebar
