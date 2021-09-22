import React from 'react';
import { compose } from 'recompose';
import Retracked from 'js/lib/retracked';

import NotificationIcon from 'bundles/notification-center/components/NotificationIcon';
import NotificationListView from 'bundles/notification-center/components/NotificationListView';
import NotificationCenterDataProvider from 'bundles/notification-center/components/data/NotificationCenterDataProvider';
import CloseNotificationCenterOnClickOutside from 'bundles/notification-center/components/CloseNotificationCenterOnClickOutside';

import 'css!./__styles__/NotificationCenter';

type State = {
  active: boolean;
};

class NotificationCenter extends React.Component<{}, State> {
  notificationCenterRef: HTMLElement | null | undefined;

  state: State = {
    active: false,
  };

  getNotificationCenterRef = () => this.notificationCenterRef;

  toggleActive = () => {
    const { active } = this.state;
    this.setState({ active: !active });
  };

  render() {
    const { active } = this.state;

    return (
      <NotificationCenterDataProvider>
        {({ loading, error, refetch, notifications, markNotificationAsRead, markAllNotificationsAsRead }) => {
          if (loading || error || !notifications) {
            return (
              <div className="rc-NotificationCenter">
                <NotificationIcon unreadCount={0} active={false} onClick={this.toggleActive} />
              </div>
            );
          }

          const unreadCount = notifications.filter((notification) => {
            if (notification.messageType === 'PartnerIncentiveMessage') {
              return false;
            }

            return !notification.isRead;
          }).length;

          return (
            <div
              ref={(ref) => {
                this.notificationCenterRef = ref;
              }}
              className="rc-NotificationCenter"
            >
              <NotificationIcon unreadCount={unreadCount} active={active} onClick={this.toggleActive} />

              {active && (
                <NotificationListView
                  unreadCount={unreadCount}
                  notifications={notifications}
                  refetchNotifications={refetch}
                  markNotificationAsRead={markNotificationAsRead}
                  markAllNotificationsAsRead={markAllNotificationsAsRead}
                />
              )}

              {active && (
                <CloseNotificationCenterOnClickOutside
                  onClick={this.toggleActive}
                  getNotificationCenterRef={this.getNotificationCenterRef}
                />
              )}
            </div>
          );
        }}
      </NotificationCenterDataProvider>
    );
  }
}

export default compose<{}, {}>(
  Retracked.createTrackedContainer(() => ({
    namespace: {
      page: 'notification_center',
    },
  }))
)(NotificationCenter);
