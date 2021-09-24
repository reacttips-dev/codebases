import React, {Component} from 'react';
import {observer} from 'mobx-react';
import store from './store/notification_store.js';

export default
@observer
class NotificationTile extends Component {
  markRead(e, n) {
    stopEvent(e);
    trackEvent('user.notifications.read', {n_type: n.n_type});
    store.markRead(n);
  }

  img_url(url) {
    return url || 'https://img.stackshare.io/fe/ss-logo-notifications.png';
  }

  click = () => {
    trackEvent('user.notifications.clickThrough', {n_type: this.props.n.n_type});
  };

  render() {
    const n = this.props.n;
    return (
      <div className="notification__container">
        <a
          href={`/notifications/${n.id}`}
          className={`notification${n.read ? ' read' : ''}`}
          onClick={this.click}
        >
          <div className="n_image">
            <img
              className={`${n.n_type === 'comment' ? 'circle' : ''}`}
              src={this.img_url(n.image_url)}
            />
          </div>
          <div>
            <p className="content">{n.content}</p>
            {n.icon && <span className={n.icon} />}
            <p className="time">{n.time} ago</p>
          </div>
        </a>
        {!n.read && (
          <div className="archive__container" onClick={event => this.markRead(event, n)}>
            <div className="archive" />
          </div>
        )}
      </div>
    );
  }
}
