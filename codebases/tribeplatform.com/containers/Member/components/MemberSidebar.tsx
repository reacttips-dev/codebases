import React, { memo } from 'react'

import { Flex } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import LockPasswordFillIcon from 'remixicon-react/LockPasswordFillIcon'
import Notification2FillIcon from 'remixicon-react/Notification2FillIcon'
import UserFillIcon from 'remixicon-react/UserFillIcon'

import { hasActionPermission } from 'tribe-api/permissions'
import {
  Sidebar,
  SIDEBAR_VISIBLE,
  SidebarGroup,
  SidebarItem,
  Skeleton,
  SkeletonProvider,
  SkeletonText,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { SidebarFooter } from 'components/Layout'

import useGetNetwork from 'containers/Network/useGetNetwork'

import useAuthMember from 'hooks/useAuthMember'

import { getSearchParams } from 'utils/url.utils'

const MemberSidebar = () => {
  const router = useRouter()
  const { authUser, loading } = useAuthMember()
  const { network } = useGetNetwork()

  const { authorized: hasConfirmResetPasswordPermission } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'confirmResetPassword',
  )
  const { authorized: hasDoResetPasswordPermission } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'doResetPassword',
  )
  const canResetPassword =
    hasConfirmResetPasswordPermission && hasDoResetPasswordPermission
  const { memberId, section } = router?.query || {}

  const { from } = getSearchParams<'from'>(['from']) || {}

  const params: any = {
    href: '/member/[memberId]',
    as: `/member/${authUser.id}`,
  }

  if (from) {
    params.href = from
    params.as = from
  }

  return (
    <Flex flexDir="column" flexGrow={1} height="100vh" pb={3}>
      <SkeletonProvider loading={loading}>
        <Sidebar
          variant="basic"
          flexGrow={1}
          pt={{
            base: 20,
            [SIDEBAR_VISIBLE]: 8,
          }}
        >
          <Skeleton
            fallback={
              <SkeletonText skeletonHeight={7} width="95%" noOfLines={8} />
            }
          >
            <NextLink passHref {...params}>
              <SidebarItem
                data-testid="sidebar-back-link"
                icon={ArrowLeftLineIcon}
                variant="ghost"
              >
                <Text textStyle="medium/small" color="label.secondary">
                  <Trans i18nKey="common:back" defaults="Back" />
                </Text>
              </SidebarItem>
            </NextLink>

            <SidebarGroup mt={6} mb={4}>
              <Trans
                i18nKey="common:account.settings"
                defaults="Account Settings"
              />
            </SidebarGroup>

            <NextLink
              passHref
              href={`/member/${memberId ?? authUser?.id}/edit?from=${from}`}
            >
              <SidebarItem
                active={router?.pathname === '/member/[memberId]/edit'}
                icon={UserFillIcon}
                data-testid="sidebar-edit-profile-link"
              >
                <Trans i18nKey="common:profile.profile" defaults="Profile" />
              </SidebarItem>
            </NextLink>

            {(memberId === authUser?.id || !memberId) && (
              <>
                {canResetPassword && (
                  <NextLink passHref href={`/settings/login?from=${from}`}>
                    <SidebarItem
                      active={section === 'login'}
                      data-testid="sidebar-login-link"
                      icon={LockPasswordFillIcon}
                    >
                      <Trans i18nKey="common:profile.login" defaults="Login" />
                    </SidebarItem>
                  </NextLink>
                )}

                <NextLink
                  passHref
                  href={`/settings/notifications?from=${from}`}
                >
                  <SidebarItem
                    active={section === 'notifications'}
                    data-testid="sidebar-notifications-link"
                    icon={Notification2FillIcon}
                  >
                    <Trans
                      i18nKey="common:profile.notifications"
                      defaults="Notifications"
                    />
                  </SidebarItem>
                </NextLink>
              </>
            )}
          </Skeleton>
        </Sidebar>
      </SkeletonProvider>

      <SidebarFooter />
    </Flex>
  )
}

export default memo(MemberSidebar)
