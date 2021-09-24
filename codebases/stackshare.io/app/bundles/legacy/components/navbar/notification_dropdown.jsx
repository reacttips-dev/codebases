import React, {Component} from 'react';
import {observer} from 'mobx-react';
import store from './store/notification_store.js';

import NotificationEmpty from './notification_empty.jsx';
import NotificationTile from './notification_tile.jsx';

export default
@observer
class NotificationDropdown extends Component {
  clearAll = e => {
    stopEvent(e);
    store.markAllRead();
  };

  render() {
    let stickyNotifications = store.stickyNotifications;
    let notifications = store.notifications;

    if (notifications.length + stickyNotifications.length === 0)
      notifications = <NotificationEmpty />;
    else {
      notifications = (
        <div className="navbar__notifications__menu__container">
          {store.notifications.map(n => (
            <NotificationTile n={n} key={`notification-${n.id}`} />
          ))}
        </div>
      );
      stickyNotifications = (
        <div className="navbar__notifications__menu__container">
          {store.stickyNotifications.map(n => (
            <NotificationTile n={n} key={`notification-${n.id}`} />
          ))}
        </div>
      );
    }

    return (
      <div className="navbar__notifications__menu">
        <div className="navbar__menu__header">
          Notifications
          <span className="spacer" />
          {store.localUnreadCount > 0 && (
            <a
              className="navbar__notifications__menu__links"
              onClick={event => this.clearAll(event)}
            >
              Mark All as Read
            </a>
          )}
        </div>
        {stickyNotifications}
        {notifications}
        {window.app_data.current_user.notification_count > 9 && (
          <a className="navbar__notifications__menu__footer" href="/notifications">
            See All Notifications
          </a>
        )}
      </div>
    );
  }
}
