import Manager from './manager';
import Notification from './notification';
import SettingsHelper from 'helpers/settings-helper';
import UserHelper from 'helpers/user-helper';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const isAuthenticated = UserHelper.State.isAuthenticated(state);
  const maintenanceBannerNotification = state.notifications.maintenanceBanner;
  // Notifications - which are largely promotional - should be filtered out for
  // some students.
  const studentCanSeeNotifications = SettingsHelper.State.studentCanSeeNotifications(
    state
  );
  return {
    notification: Manager.getFirstUnread(
      isAuthenticated,
      maintenanceBannerNotification,
      studentCanSeeNotifications
    ),
    paused: state.notifications.notificationsPausedCounter > 0,
    user: SettingsHelper.State.getUser(state),
    customMessage: maintenanceBannerNotification.message,
  };
};

const mapDispatchToProps = actionsBinder(
  'fetchScheduledMaintenanceNotification'
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    static displayName = 'notifications/index';

    state = {
      isVisible: true,
    };

    async componentDidMount() {
      const { fetchScheduledMaintenanceNotification, user } = this.props;
      fetchScheduledMaintenanceNotification(user.id, user.preferred_language);
    }

    handleClose = (notification, customMessage) => {
      Manager.setRead(notification.key, true, customMessage);

      this.setState({
        isVisible: false,
      });
    };

    render() {
      const { notification, paused, customMessage } = this.props;
      const { isVisible } = this.state;

      return notification ? (
        <Notification
          isVisible={isVisible && !paused}
          onRequestClose={() => this.handleClose(notification, customMessage)}
          type="message"
        >
          <notification.component customMessage={customMessage} />
        </Notification>
      ) : null;
    }
  }
);
