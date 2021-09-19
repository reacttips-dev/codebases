import PropTypes from 'prop-types';

import { Clear } from 'components/icons';

import styles from 'styles/components/notificationsOverlay.scss';

const NotificationsOverlay = ({ showOverlay, dismissOverlay }, { testId }) => {
  if (showOverlay) {
    return (
      <div className={styles.notificationsOverlay} data-test-id={testId('notificationsOverlay')}>
        <span>Push notifications are currently <b>disabled</b>. You can always change permissions by clicking the lock. <button type="button" onClick={dismissOverlay}><Clear size="15" /></button></span>
      </div>
    );
  }
  return null;
};

NotificationsOverlay.contextTypes = {
  testId: PropTypes.func
};

export default NotificationsOverlay;
