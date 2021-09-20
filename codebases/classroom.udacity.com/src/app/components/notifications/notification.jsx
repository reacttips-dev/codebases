import { IconChecked, IconMoney, IconWarning } from '@udacity/veritas-icons';
import { Banner } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './notification.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'notifications/notification';

    static propTypes = {
      isVisible: PropTypes.bool.isRequired,
      children: PropTypes.element.isRequired,
      onRequestClose: PropTypes.func.isRequired,
      /*
      Notification (green): "Your password has been changed"
      Error (red): "Failed to update your password"
      Message (blue): "Tune in for our live broadcast"
    */
      type: PropTypes.oneOf(['information', 'success', 'error', 'warning'])
        .isRequired,
      dismissable: PropTypes.oneOf(['auto', 'manual', 'none']),
    };

    getIcon(type) {
      switch (type) {
        case 'error':
        case 'warning':
          return <IconWarning />;
          break;
        case 'success':
          return <IconChecked />;
          break;
        case 'information':
          return <IconMoney />;
          break;
        default:
          return null;
          break;
      }
    }

    render() {
      let {
        isVisible,
        children,
        onRequestClose,
        type,
        dismissable,
      } = this.props;
      return isVisible ? (
        <div className="notification">
          <div
            styleName={classNames(type, {
              persistent: !_.includes(['manual', 'auto'], dismissable),
            })}
          >
            <Banner
              icon={this.getIcon(type)}
              variant={type}
              closeable
              onClose={onRequestClose}
            >
              {children}
            </Banner>
          </div>
        </div>
      ) : null;
    }
  },
  styles,
  { allowMultiple: true }
);
