import Alerts from 'components/notifications/alerts';
import Intercom from 'components/common/intercom';
import Layout from 'components/common/layout';
import LocaleHelper from 'helpers/locale-helper';
import Notifications from 'components/notifications';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import UIHelper from 'helpers/ui-helper';
import UserHelper from 'helpers/user-helper';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import { i18n } from 'services/localization-service';

const mapStateToProps = function (state) {
  return {
    user: SettingsHelper.State.getUser(state),
    isAuthenticated: UserHelper.State.isAuthenticated(state),
    isFetchingUserBase: UIHelper.State.isFetchingUserBase(state),
    isUserBaseFetched: UIHelper.State.isUserBaseFetched(state),
    isRightSidebarVisible: UIHelper.State.isRightSidebarVisible(state),
  };
};

const mapDispatchToProps = actionsBinder(
  'fetchUserBase',
  'fetchUserGeoLocation',
  'fetchOrderHistory',
  'setEnrollments'
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    static displayName = 'main';

    static propTypes = {
      /* Redux */
      user: PropTypes.any,
      isAuthenticated: PropTypes.bool.isRequired,
      isFetchingUserBase: PropTypes.bool,
      isUserBaseFetched: PropTypes.bool,
      isRightSidebarVisible: PropTypes.bool,
      fetchUserBase: PropTypes.func,
      fetchUserGeoLocation: PropTypes.func,
      setEnrollments: PropTypes.func,
      params: PropTypes.objectOf(PropTypes.string),
    };

    static childContextTypes = {
      location: PropTypes.object,
      params: PropTypes.objectOf(PropTypes.string),
    };

    getChildContext() {
      // TODO: (dcwither) get rid of this in favor of a `createReactContext`
      const { location, params } = this.props;
      return {
        location,
        params,
      };
    }

    componentWillMount() {
      this.props.fetchUserGeoLocation();
      if (this.props.isAuthenticated) {
        this.props.fetchUserBase();
        this.props.fetchOrderHistory();
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.isFetchingUserBase && !nextProps.isFetchingUserBase) {
        // We just finished fetchUserBase, do some key initialization things
        this._initialize(nextProps.user);
      }
    }

    _initialize = (user = {}) => {
      LocaleHelper.setDocumentLanguage(user.preferred_language);
      this.props.setEnrollments(
        _.compact(
          _.concat(
            user.nanodegrees,
            user.courses,
            user.parts,
            user.graduated_nanodegrees,
            user.graduated_courses,
            user.graduated_parts
          ).map((node) => {
            if (node) {
              // TODO: Fix this hack
              if (!node.enrollment) {
                node.enrollment = {};
                node.enrollment.root_node = node.node;
              }
              return node.enrollment;
            }
          })
        )
      );
    };

    _shouldDisplay = () => {
      var { isAuthenticated, isUserBaseFetched } = this.props;
      if (isAuthenticated) {
        return isUserBaseFetched;
      } else {
        return true;
      }
    };

    render() {
      var pathname = _.get(this.props, 'location.pathname');

      return this._shouldDisplay() ? (
        // The key property in the following div,
        // is used to force re-render of the entire app
        // when locale changes, to render the UI text in the new locale.
        <div id="main" key={i18n.getLocale()}>
          <Alerts />
          <Notifications />
          <Intercom pathname={pathname} />
          <div className="content">{this.props.children}</div>
        </div>
      ) : (
        <Layout isBusy={true} />
      );
    }
  }
);
