import React from 'react';
import Notification from 'bundles/notification-center/components/Notification';

import type {
  Notification as NotificationType,
  CalendarSyncNotification as CalendarSyncNotificationType,
} from 'bundles/notification-center/types';

import _t from 'i18n!nls/notification-center';

type Props = {
  notification: CalendarSyncNotificationType;
  onClick: (notification: NotificationType) => void;
};

const CalendarSyncNotification: React.FC<Props> = ({ notification, onClick }) => (
  <Notification onClick={onClick} href="/account-settings" notification={notification}>
    {_t("Don't miss out on deadlines. Add all your assignment deadlines to your calendar.")}
  </Notification>
);

export default CalendarSyncNotification;
