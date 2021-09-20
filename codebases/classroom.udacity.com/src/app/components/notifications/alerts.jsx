import Actions from 'actions';
import Notification from './notification';
import { connect } from 'react-redux';

const AUTO_REMOVE_ALERT_DURATION_MS = 8000;

const mapStateToProps = (state) => ({
  alerts: state.alerts || [],
});

const mapDispatchToProps = (dispatch) => ({
  onRemoveAlert: (alert) => dispatch(Actions.removeAlert(alert)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    static displayName = 'notifications/alerts';

    componentDidMount() {
      this._autoRemoveAlerts(this.props.alerts);
    }

    componentWillReceiveProps(newProps) {
      const newAlerts = _.differenceBy(
        newProps.alerts,
        this.props.alerts,
        'id'
      );

      this._autoRemoveAlerts(newAlerts);
    }

    _autoRemoveAlerts = (alerts) => {
      if (_.isEmpty(alerts)) {
        return;
      }

      setTimeout(() => {
        _.each(alerts, (alert) => {
          const dismissable = _.get(alert, 'dismissable', 'auto');
          if (dismissable === 'auto') {
            this.props.onRemoveAlert(alert);
          }
        });
      }, AUTO_REMOVE_ALERT_DURATION_MS);
    };

    _getNotifications = () => {
      return _.map(this.props.alerts, (alert) => {
        return (
          <Notification
            key={alert.id}
            isVisible={true}
            onRequestClose={() => this.props.onRemoveAlert(alert)}
            type={alert.type}
            dismissable={alert.dismissable}
          >
            <span>{alert.message}</span>
          </Notification>
        );
      });
    };

    render() {
      const notifications = this._getNotifications();

      return notifications.length ? <div>{notifications}</div> : null;
    }
  }
);
