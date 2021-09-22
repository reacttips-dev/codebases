import PropTypes from 'prop-types';
import React from 'react';
import URI from 'jsuri';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import TrackedButton from 'bundles/page/components/TrackedButton';
import _t from 'i18n!nls/ondemand';

class LoggedOutBox extends React.Component {
  static propTypes = {
    ensureAuthenticated: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  handleLoginClick = () => {
    this.props.ensureAuthenticated({
      redirectUrl: this.getRedirectUrlAfterAuth(),
    });
  };

  getRedirectUrlAfterAuth = () => {
    const uri = new URI(this.context.router.location.pathname);
    uri.addQueryParam('action', 'enroll');
    return uri.toString();
  };

  render() {
    return (
      <div className="rc-LoggedOutBox rc-EnrollBox cozy od-container theme-dark">
        <div className="vertical-box styleguide">
          <h3 className="color-primary-text">{_t('Log in to enroll in this course')}</h3>
          <div className="horizontal-box align-items-right">
            <TrackedButton trackingName="logged_out_box_login" onClick={this.handleLoginClick} className="primary">
              {_t('Log in')}
            </TrackedButton>
          </div>
        </div>
      </div>
    );
  }
}

export default connectToStores(LoggedOutBox, ['ApplicationStore'], ({ ApplicationStore }, props) => {
  const { ensureAuthenticated } = ApplicationStore;
  return { ...props, ensureAuthenticated };
});
