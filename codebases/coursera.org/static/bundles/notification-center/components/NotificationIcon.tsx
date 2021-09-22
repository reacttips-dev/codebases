import React from 'react';

import { color } from '@coursera/coursera-ui';
import { SvgBell } from '@coursera/coursera-ui/svg';

import TrackedButton from 'bundles/page/components/TrackedButton';
import NotificationUnreadCount from 'bundles/notification-center/components/NotificationUnreadCount';

import _t from 'i18n!nls/notification-center';

import 'css!./__styles__/NotificationIcon';

type Props = {
  active: boolean;
  unreadCount: number;
  onClick: () => void;
};

const NotificationIcon: React.FC<Props> = ({ active, unreadCount, onClick }) => (
  <TrackedButton
    onClick={onClick}
    data={{ unreadCount, active }}
    className="rc-NotificationIcon"
    trackingName="notification_icon"
  >
    <SvgBell
      title={active ? _t('Hide notifications') : _t('Show notifications')}
      color={active ? color.primary : undefined}
    />

    {unreadCount > 0 && <NotificationUnreadCount count={unreadCount} />}
  </TrackedButton>
);

export default NotificationIcon;
