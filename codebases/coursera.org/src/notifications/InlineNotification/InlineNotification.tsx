/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import {
  LocalNotification,
  LocalNotificationProps,
} from '@core/notifications/LocalNotification';
import { NotificationSeverity } from '@core/notifications/types';

export type InlineNotificationProps = {
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
 * Inline notifications are system notifications that appear at the component level to
 * communicate task related feedback or action.
 *
 * See [Props](__storybookUrl__/feedback-notifications--default#props)
 */
const InlineNotification = React.forwardRef(function InlineNotification(
  props: InlineNotificationProps,
  ref: React.Ref<HTMLDivElement>
) {
  const { title, severity, ...rest } = props;

  return (
    <LocalNotification
      {...rest}
      ref={ref}
      severity={severity || 'information'}
      titleProps={{
        component: 'p',
        severity: severity,
        children: title,
      }}
    />
  );
});

export default InlineNotification;
