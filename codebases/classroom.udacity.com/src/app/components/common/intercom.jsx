import DOM from 'constants/dom';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import UIHelper from 'helpers/ui-helper';
import { connect } from 'react-redux';
import styles from './intercom.scss';

const mapStateToProps = (state) => {
  return {
    notificationsHidden:
      UIHelper.State.isRightSidebarVisible(state) ||
      state.notifications.notificationsPausedCounter > 0 ||
      SettingsHelper.State.isGTStudent(state),
  };
};

const hideIntercomCSS = `
#${DOM.INTERCOM_TOGGLE_ID} {
  display: none;
}
`;

export default connect(mapStateToProps)(
  cssModule(
    class extends React.Component {
      static displayName = 'common/intercom';

      static propTypes = {
        pathname: PropTypes.string.isRequired,
        notificationsHidden: PropTypes.bool,
      };

      static defaultProps = {
        notificationsHidden: false,
      };

      _shouldDisplay = () => {
        const { pathname } = this.props;

        if (this.props.notificationsHidden) {
          return false;
        } else if (
          pathname === '/me' ||
          pathname === '/settings/subscriptions' ||
          pathname.match(/\/nanodegrees\/[\w-]+\/syllabus/) ||
          pathname.match(/\/nanodegrees\/[\w-]+ptrial/)
        ) {
          return true;
        }
        return false;
      };

      render() {
        return this._shouldDisplay() ? (
          <div />
        ) : (
          <style type="text/css">{hideIntercomCSS}</style>
        );
      }
    },
    styles
  )
);
