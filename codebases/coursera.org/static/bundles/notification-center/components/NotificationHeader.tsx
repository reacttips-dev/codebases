import React from 'react';
import { Button } from '@coursera/coursera-ui';
import withSingleTracked from 'bundles/common/components/withSingleTracked';

import _t from 'i18n!nls/notification-center';

import 'css!./__styles__/NotificationHeader';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

type Props = {
  unreadCount: number;
  onMarkAllAsRead: () => void;
};

const NotificationHeader: React.FC<Props> = ({ unreadCount, onMarkAllAsRead }) => (
  <div className="rc-NotificationHeader">
    <h1>{_t('Notifications')}</h1>

    {unreadCount > 0 && (
      <TrackedButton
        type="link"
        onClick={onMarkAllAsRead}
        label={_t('Mark all as read')}
        trackingName="mark_all_as_read"
        rootClassName="notification-center-mark-all-read"
      />
    )}
  </div>
);

export default NotificationHeader;
