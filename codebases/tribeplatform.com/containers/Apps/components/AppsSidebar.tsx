import React, { FC, memo, useCallback } from 'react'

import { Divider, Spacer } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import isEqual from 'react-fast-compare'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import ErrorWarningFillIcon from 'remixicon-react/ErrorWarningFillIcon'
import LayoutGridFillIcon from 'remixicon-react/LayoutGridFillIcon'

import { AppInstallation, AppInstallationStatus, SpaceQuery } from 'tribe-api'
import {
  Icon,
  Sidebar,
  SIDEBAR_VISIBLE,
  SidebarItem,
  SidebarLabel,
  SidebarLeftElement,
  SidebarRightElement,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { SidebarFooter } from 'components/Layout'

import { SidebarPlanBar } from 'containers/AdminSettings/components/SidebarPlanBar'
import { AppIcon } from 'containers/Apps/components/AppIcon'

import { useAppBySlug } from '../hooks/useAppBySlug'
import { DefaultApps } from './TabContent/SettingsContent/DefaultApps'

type AppsSidebarProps = {
  appInstallations: AppInstallation[]
  space?: SpaceQuery['space']
}

const AppsSidebar: FC<AppsSidebarProps> = ({ appInstallations, space }) => {
  const { asPath } = useRouter()
  const getAs = useCallback(
    (appSlug: string) => {
      if (!space?.slug) {
        return `/admin/network/apps/${appSlug}`
      }
      return `/admin/space/${space?.slug}/apps/${appSlug}`
    },
    [space?.slug],
  )
  const getBackHref = useCallback(
    (path: string) =>
      space?.slug
        ? `/admin/space/${space?.slug}/${path}`
        : `/admin/network/${path}`,
    [space?.slug],
  )
  const spacePostTypeAppSlug =
    space?.spaceType?.name === 'Discussion'
      ? DefaultApps.Discussion
      : DefaultApps.QA

  const { app: postTypeApp, loading: postTypeAppLoading } = useAppBySlug({
    slug: spacePostTypeAppSlug,
  })

  return (
    <>
      <Sidebar pt={{ base: '5rem', [SIDEBAR_VISIBLE]: 4 }} w="full" pb={6}>
        <NextLink passHref href={getBackHref('settings')}>
          <SidebarItem
            data-testid="sidebar-back-button"
            icon={ArrowLeftLineIcon}
            variant="ghost"
            mb={4}
            mt={-1}
          >
            <Text textStyle="medium/small" color="label.secondary">
              <Trans
                i18nKey="apps:sidebar.back"
                defaults="Back to Admin tools"
              />
            </Text>
          </SidebarItem>
        </NextLink>
        <Text textStyle="medium/large" color="label.primary" mb={6}>
          <Trans i18nKey="apps:sidebar.title" defaults="Apps" />
        </Text>
        <Divider mx={-6} />
        <Text textStyle="medium/small" color="label.secondary" mt={6} mb={2}>
          <Trans i18nKey="apps:sidebar.catalog.title" defaults="App catalog" />
        </Text>
        <NextLink href={getBackHref('apps')} passHref>
          <SidebarItem active={asPath === getBackHref('apps')}>
            <SidebarLeftElement>
              <LayoutGridFillIcon size={15} />
            </SidebarLeftElement>
            <SidebarLabel>
              <Trans
                i18nKey="apps:sidebar.catalog.allApps"
                defaults="All apps"
              />
            </SidebarLabel>
          </SidebarItem>
        </NextLink>
        {(appInstallations?.length || space) && (
          <Text textStyle="medium/small" color="label.secondary" mt={6} mb={2}>
            <Trans
              i18nKey="apps:sidebar.installed.title"
              defaults="Installed Apps"
            />
          </Text>
        )}
        {appInstallations.map(({ app, status }) => (
          <NextLink key={app?.slug} href={getAs(app?.slug || '')} passHref>
            <SidebarItem active={asPath === getAs(app?.slug || '')}>
              <SidebarLeftElement>
                <AppIcon app={app} size="5" />
              </SidebarLeftElement>
              <SidebarLabel>{app?.name}</SidebarLabel>
              {status === AppInstallationStatus.DISABLED && (
                <SidebarRightElement>
                  <Icon as={ErrorWarningFillIcon} color="danger.base" />
                </SidebarRightElement>
              )}
            </SidebarItem>
          </NextLink>
        ))}
        {!postTypeAppLoading && space?.spaceType && postTypeApp && (
          <NextLink
            key={postTypeApp?.slug}
            href={getAs(postTypeApp?.slug || '')}
            passHref
          >
            <SidebarItem active={asPath === getAs(postTypeApp?.slug || '')}>
              <SidebarLeftElement>
                <AppIcon app={postTypeApp} size="5" />
              </SidebarLeftElement>
              <SidebarLabel>{postTypeApp?.name}</SidebarLabel>
            </SidebarItem>
          </NextLink>
        )}
        <Spacer mt={5} />
        <SidebarPlanBar />
      </Sidebar>
      <SidebarFooter />
    </>
  )
}

export default memo(AppsSidebar, isEqual)
