import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@udacity/veritas-components';
import styles from './notification-badge.scss';

export default class NotificationBadge extends React.PureComponent {
  static propTypes = {
    unreadCount: PropTypes.number,
  };

  static defaultProps = {
    unreadCount: 0,
  };

  render() {
    const { unreadCount } = this.props;
    const count = unreadCount > 99 ? '99+' : unreadCount;

    return (
      <span title="Notification" className={styles.notificationOuter}>
        {unreadCount > 0 ? (
          <span title="unread count" className={styles.count}>
            <Text size="xs" spacing="none" color="white">
              {count}
            </Text>
          </span>
        ) : (
          <span title="Unread messages" className={styles.notificationInner} />
        )}
      </span>
    );
  }
}
