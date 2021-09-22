import React from 'react';
import classNames from 'classnames';
import * as DateTimeUtils from 'js/utils/DateTimeUtils';
import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';

import type { Notification as NotificationType } from 'bundles/notification-center/types';

import 'css!./__styles__/Notification';

type Props = {
  href: string;
  children: React.ReactNode;
  notification: NotificationType;
  onClick: (notification: NotificationType) => void;
};

// TODO: Limit length of notification text
const Notification: React.FC<Props> = ({ href, notification, onClick, children }) => (
  <TrackedLink2
    href={href}
    trackingName="notification"
    data={{
      id: notification.id,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      messageType: notification.messageType,
    }}
    onClick={() => onClick(notification)}
    className={classNames('rc-Notification', { read: notification.isRead })}
  >
    {children}

    <div className="notification-timestamp">
      {DateTimeUtils.momentWithUserTimezone(notification.createdAt).fromNow()}
    </div>
  </TrackedLink2>
);

export default Notification;
