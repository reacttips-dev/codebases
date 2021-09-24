import React from 'react'

import { HStack, Spacer } from '@chakra-ui/react'
import CheckDoubleLineIcon from 'remixicon-react/CheckDoubleLineIcon'

import { Notification } from 'tribe-api/interfaces'
import { Icon, Text } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

interface NotificationsHeaderProps {
  onNotificationsRead: () => void
  canReadAllNotifications: boolean
  notifications: Notification[]
}

const NotificationsHeader = ({
  canReadAllNotifications,
  onNotificationsRead,
  notifications,
}: NotificationsHeaderProps) => {
  const { t } = useTranslation()
  return (
    <HStack justify="space-between" mb={7}>
      <Text as="h2" textStyle="bold/2xlarge">
        {t(`notification:header.title`, 'Notifications')}
      </Text>

      <Spacer />

      {notifications && notifications.length > 0 && canReadAllNotifications && (
        <HStack
          data-testid="read-all-notifications"
          cursor="pointer"
          onClick={onNotificationsRead}
        >
          <Icon size="lg" as={CheckDoubleLineIcon} boxSize="5" />
          <Text fontSize="md">
            {t(`notification:header.markAllRead`, 'Mark all as read')}
          </Text>
        </HStack>
      )}
    </HStack>
  )
}

export default NotificationsHeader
