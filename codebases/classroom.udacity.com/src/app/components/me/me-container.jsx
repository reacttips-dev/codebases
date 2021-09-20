/**
 * Gets current user's nanodegrees and courses and parts
 */
import Header from 'components/common/header';
import Layout from 'components/common/layout';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import UiHelper from 'helpers/ui-helper';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';

const mapStateToProps = function (state) {
  return {
    isFetchingMe: UiHelper.State.isFetchingMe(state),
    connectSession: SettingsHelper.State.getConnectSession(state),
  };
};

const mapDispatchToProps = actionsBinder(
  'fetchMe',
  'fetchConnectEnrollment',
  'fetchConnectNdProgress',
  'fetchApplications'
);

const MeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    static displayName = 'me/container';

    static propTypes = {
      /* Redux */
      isFetchingMe: PropTypes.bool.isRequired,
      fetchMe: PropTypes.func.isRequired,
      fetchConnectEnrollment: PropTypes.func.isRequired,
      fetchConnectNdProgress: PropTypes.func.isRequired,
      fetchApplications: PropTypes.func.isRequired,
    };

    state = {
      hasFetched: false,
    };

    componentWillMount() {
      const {
        fetchMe,
        fetchApplications,
        fetchConnectEnrollment,
        fetchConnectNdProgress,
        connectSession,
      } = this.props;

      fetchMe();
      fetchApplications();
      this._setHasFetched(false);
      if (_.isEmpty(connectSession)) {
        fetchConnectEnrollment().then((response) => {
          const degreeId = _.get(response, 'degree.id');
          if (degreeId) {
            fetchConnectNdProgress(degreeId);
          }
        });
      }
    }

    componentWillReceiveProps(nextProps) {
      if (!this.state.hasFetched && !nextProps.isFetchingMe) {
        this._setHasFetched(true);
      }
    }

    _setHasFetched = (hasFetched) => {
      this.setState({ hasFetched });
    };

    render() {
      const { hasFetched } = this.state;
      return (
        <Layout
          navVariant="large"
          busy={!hasFetched}
          documentTitle={__('Home')}
          header={<Header title={__('Home')} />}
        >
          {hasFetched ? this.props.children : null}
        </Layout>
      );
    }
  }
);

export default MeContainer;
