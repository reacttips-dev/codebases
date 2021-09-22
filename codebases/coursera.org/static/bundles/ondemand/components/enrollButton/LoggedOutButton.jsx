import PropTypes from 'prop-types';
import React from 'react';
import URI from 'jsuri';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import BaseButton from './BaseButton';

class LoggedOutButton extends React.Component {
  static propTypes = {
    ensureAuthenticated: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onClick: () => {},
  };

  onClick = () => {
    this.props.ensureAuthenticated({
      redirectUrl: this.getRedirectUrlAfterAuth(),
    });
  };

  getRedirectUrlAfterAuth() {
    const uri = new URI(this.context.router.location.pathname);
    uri.addQueryParam('action', 'enroll');
    return uri.toString();
  }

  render() {
    return <BaseButton onClick={this.onClick} isEnrolled={false} />;
  }
}

export default connectToStores(LoggedOutButton, ['ApplicationStore'], ({ ApplicationStore }, props) => {
  const { ensureAuthenticated } = ApplicationStore;
  return { ...props, ensureAuthenticated };
});
