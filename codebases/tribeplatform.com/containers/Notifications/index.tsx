import React, { useCallback, useEffect } from 'react'

import { Center, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import queryString from 'query-string'
import InfiniteScroll from 'react-infinite-scroll-component'
import CheckDoubleLineIcon from 'remixicon-react/CheckDoubleLineIcon'

import { Notification as NotificationInterface } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Dropdown,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  getNotificationLink,
  Link,
  NonIdealState,
  Notification,
  SIDEBAR_VISIBLE,
  Skeleton,
  SkeletonProvider,
  SkeletonText,
  Spinner,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { CenterLayout } from 'components/Layout/CenterLayout'

import useGetNetwork from 'containers/Network/useGetNetwork'
import { useSearch } from 'containers/Search/hooks/useSearchModal'

import { useResponsive } from 'hooks/useResponsive'

import { logger } from 'lib/logger'

import NotificationsEmpty from './components/Empty'
import NotificationsHeader from './components/Header'
import {
  DEFAULT_NOTIFICATIONS_LIMIT,
  useClearNotificationsCount,
  useGetNotifications,
  useReadAllNotifications,
  useReadNotification,
} from './hooks'

export const NOTIFICATIONS_FROM_PARAM = '/notifications'

const NotificationWrapper = ({
  notification,
  onClick,
}: {
  notification: NotificationInterface
  onClick: (notification: NotificationInterface) => void
}) => {
  if (!notification?.meta?.relativeUrl) {
    logger.info(
      `${notification?.verb} notification does not have relativeUrl. id: ${notification?.id}`,
    )
  }

  const href = notification?.meta?.relativeUrl
    ? queryString.stringifyUrl({
        url: notification.meta.relativeUrl,
        query: { from: NOTIFICATIONS_FROM_PARAM },
      })
    : getNotificationLink(notification)

  if (!href) {
    return null
  }

  return (
    <NextLink href={href} passHref>
      <Notification
        notification={notification}
        onClick={() => onClick(notification)}
        data-testid={`notification-${notification?.id}`}
        href={href}
        as={Link}
      />
    </NextLink>
  )
}

const NotificationsContainer = () => {
  const { t } = useTranslation()

  const {
    notifications,
    loading: notificationsLoading,
    hasNextPage,
    totalCount,
    loadMore,
    isEmpty,
    error,
  } = useGetNotifications({
    limit: DEFAULT_NOTIFICATIONS_LIMIT,
  })
  const { isMobile, isSidebarOpen, mobileHeader } = useResponsive()
  const { isSearchModalOpen } = useSearch()
  const { network } = useGetNetwork()
  const { authorized: canReadNotification } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'readNotification',
  )

  const clearNotificationsCount = useClearNotificationsCount()
  const readNotification = useReadNotification()
  const readNotifications = useReadAllNotifications()

  const readAllNotifications = useCallback((): void => {
    try {
      readNotifications()
    } catch (e) {
      logger.error(e)
    }
  }, [readNotifications])

  useEffect(() => {
    if (isSidebarOpen || isSearchModalOpen) return

    mobileHeader.setRight(
      <Dropdown>
        <DropdownIconButton
          background="bg.secondary"
          backgroundColor="bg.secondary"
          borderEndRadius="base"
          borderStartRadius="base"
          p={0}
          size="md"
          mr={{
            base: 0,
            [SIDEBAR_VISIBLE]: 4,
          }}
        />
        <DropdownList>
          <DropdownItem
            py={0}
            icon={CheckDoubleLineIcon}
            onClick={readAllNotifications}
          >
            <Trans
              i18nKey="notification:header.markAllRead"
              defaults="Mark all as read"
            />
          </DropdownItem>
        </DropdownList>
      </Dropdown>,
    )
  }, [mobileHeader, isSidebarOpen, isSearchModalOpen, readAllNotifications])

  useEffect(() => {
    clearNotificationsCount()
  }, [])

  const onNotificationClick = (notification: NotificationInterface) => {
    if (!canReadNotification) return
    if (!notification.read) {
      readNotification(notification, notification?.id)
    }
  }

  return (
    <CenterLayout pt={[0, 8]}>
      <SkeletonProvider loading={!totalCount && notificationsLoading}>
        {!isMobile && (
          <NotificationsHeader
            canReadAllNotifications={canReadNotification}
            onNotificationsRead={readAllNotifications}
            notifications={notifications}
          />
        )}

        {!!error && (
          <NonIdealState
            height="70vh"
            title={t('notification:error.title', 'It’s not you, it’s us.')}
            description={t(
              'notification:error.description',
              'Something’s not working properly. Please try again in few minutes.',
            )}
          />
        )}
        {isEmpty && <NotificationsEmpty />}

        <InfiniteScroll
          dataLength={notifications?.length}
          next={loadMore}
          hasMore={hasNextPage}
          loader={
            <Center pb={10} mt={5}>
              <Spinner />
            </Center>
          }
        >
          <VStack spacing={0} align="stretch" w="full">
            <Skeleton
              fallback={
                <SkeletonText skeletonHeight={20} width="100%" noOfLines={8} />
              }
            >
              {notifications &&
                notifications.map((notification: NotificationInterface) => (
                  <NotificationWrapper
                    key={notification.id}
                    notification={notification}
                    onClick={onNotificationClick}
                  />
                ))}
            </Skeleton>
          </VStack>
        </InfiniteScroll>
      </SkeletonProvider>
    </CenterLayout>
  )
}

export default NotificationsContainer
