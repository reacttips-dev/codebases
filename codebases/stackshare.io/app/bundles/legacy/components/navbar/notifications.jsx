import React, {Component} from 'react';
import {observer} from 'mobx-react';
import store from './store/notification_store.js';
import NotificationDropdown from './notification_dropdown.jsx';
import NotificationsBell from './notifications_bell.jsx';

export default
@observer
class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      unreadCount:
        typeof window !== 'undefined' ? window.app_data.current_user.unread_notifications_count : 0
    };

    this.cacheKey = `notification-cache-${
      typeof window !== 'undefined' ? window.app_data.current_user.id : ''
    }`;

    const emptyCache = {read: []};

    try {
      this.cache = JSON.parse(localStorage.getItem(this.cacheKey)) || emptyCache;
      if (!(this.cache.read instanceof Array)) {
        this.cache = emptyCache;
        this.saveLocal();
      }
    } catch (err) {
      this.cache = emptyCache;
    }
  }

  clickBell = () => {
    if (this.state.unreadCount > 0) {
      trackEvent('user.notifications.menuOpen', {notificationCount: this.state.unreadCount});
    }
    if (this.state.open === false) {
      post('/api/v1/notifications/clear');
      this.setState({unreadCount: 0});
    }

    store.seen();

    this.setState({open: !this.state.open});
  };

  hideMenu = () => {
    this.setState({open: false});
  };

  render() {
    return (
      <div
        className={`navbar__notifications${this.state.open ? ' open' : ''}${
          this.state.unreadCount !== 0 ? ' unread' : ''
        }`}
        onClick={this.clickBell}
      >
        {this.state.unreadCount > 0 && (
          <div className="navbar__notifications__count">{this.state.unreadCount}</div>
        )}
        <NotificationsBell />
        {this.state.open && <NotificationDropdown />}
        {this.state.open && <div className="react-overlay transparent" onClick={this.hideMenu} />}
      </div>
    );
  }
}
