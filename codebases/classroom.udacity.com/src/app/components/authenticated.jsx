import Actions from 'actions';
import AnalyticsService from 'services/analytics-service';
import AuthenticationService from 'services/authentication-service';
import Layout from 'components/common/layout';
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';

export class Authenticated extends React.Component {
  static displayName = 'authenticated';

  static contextTypes = {
    location: PropTypes.object,
    router: PropTypes.object,
    // connect
    authenticationCompleted: PropTypes.func,
  };

  componentWillMount() {
    const defaultPath = '/me';
    this.props.authenticationCompleted();
    const path = AuthenticationService.getNextPath() || defaultPath;
    AuthenticationService.clearNextPath();
    AnalyticsService.identify(AuthenticationService.getCurrentUser());
    this.context.router.replace(path);
  }

  render() {
    return <Layout isBusy={true} documentTitle={__('Authenticating')} />;
  }
}

export default connect(null, {
  authenticationCompleted: Actions.authenticationCompleted,
})(Authenticated);
