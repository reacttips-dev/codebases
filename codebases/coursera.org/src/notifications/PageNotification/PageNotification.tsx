/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import {
  LocalNotification,
  LocalNotificationProps,
} from '@core/notifications/LocalNotification';
import { useNotificationListContext } from '@core/notifications/NotificationList';
import { NotificationSeverity } from '@core/notifications/types';

export type PageNotificationProps = {
  /**
   * Notification title.
   */
  title?: string;
  /**
   * Severity type of Notification
   * @default information
   */
  severity?: NotificationSeverity;
} & Omit<LocalNotificationProps, 'titleProps' | 'severity'>;

/**
 * Page Notifications are system notifications that appear at the page level to
 * communicate information during a user journey or at the account level.
 *
 * See [Props](__storybookUrl__/feedback-notifications--default#props)
 */
const PageNotification = React.forwardRef(function PageNotification(
  props: PageNotificationProps,
  ref: React.Ref<HTMLDivElement>
) {
  const stacked = useNotificationListContext();
  const { title, severity, ...rest } = props;

  return (
    <LocalNotification
      {...rest}
      ref={ref}
      severity={severity || 'information'}
      titleProps={{
        children: title,
        component: stacked ? 'h3' : 'h2',
      }}
    />
  );
});

export default PageNotification;
