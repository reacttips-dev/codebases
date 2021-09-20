import { Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import Analytics from '@udacity/ureact-analytics';
import Helmet from 'react-helmet';
import { Loading } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import qs from 'qs';
import {
  AuthenticationService,
  LocationService,
  UserService,
} from '../../services';

import {
  BIRTHDATE_REQ,
  ONE_TIME_PASSWORD_REQ,
  TERMS_OF_USE_REQ,
  WEAK_PASSWORD_REQ,
} from '../constants/user-api';
import SentryHelper from '../helpers/sentry-helper';
import Alert from '../components/alert';
import AnalyticsService from '../helpers/analytics-helper';
import AuthPanels from '../components/auth-panels';
import FormHeader from '../components/form-header';
import OrSeparator from '../components/or-separator';
import ProviderButtons from '../components/provider-buttons';
import Providers from '../constants/social-providers';
import RoutesHelper from '../helpers/routes-helper';
import { SIGN_IN } from '../constants/sign-x';
import SignInFormPassword from '../components/forms/sign-in-form-password';
import SignInFormSSO from '../components/forms/sign-in-form-sso';
import { __ } from '../../services/localization-service';
import { isStatus } from '../helpers/http-helper';
import {
  translateError,
  includeContactSupportText,
  getContactSupportText,
  getContactSupportLink,
} from '../helpers/user-error-helper';
import styles from '../components/form.module.scss';

class SignIn extends Component {
  static propTypes = {
    isSso: PropTypes.bool.isRequired,
  };

  state = {
    provider: null,
    error: null,
    contactSupportText: null,
    contactSupportLink: null,
    success: null,
    isOtpModalOpen: false,
    isLoading: false,
    showRecaptcha: false,
  };

  componentDidMount() {
    if (AuthenticationService.isSsoCookied()) {
      const { history, location } = this.props;
      history.push({
        pathname: '/sign-in/sso',
        search: location.search,
      });
      return;
    }

    Analytics.page('Sign In', `Sign In${this.props.isSso ? ' SSO' : ''}`);
    const { location } = this.props;
    const errorCode = RoutesHelper.getQueryParam(location, 'errorCode');

    if (errorCode) {
      // General 500 from user-api, different translation for sign-in
      if (errorCode === 5000) {
        this._setError(__('Unable to sign in at this time'));
      } else {
        this._setError(translateError(errorCode));
        if (includeContactSupportText(errorCode)) {
          this._setContactSupportText(getContactSupportText(errorCode));
          this._setContactSupportLink(getContactSupportLink(errorCode));
        }
      }
    }
  }

  onOtpModalClose = () => {
    this.setState({ isOtpModalOpen: false });
  };

  _getNext = () => {
    return RoutesHelper.getNext(this.props.location);
  };

  _setError = (error) => {
    this.setState({ error });
  };

  _setContactSupportText = (contactSupportText) => {
    this.setState({ contactSupportText });
  };

  _setContactSupportLink = (contactSupportLink) => {
    this.setState({ contactSupportLink });
  };

  _setSuccess = (success) => {
    this.setState({ success });
  };

  _clearAlerts = () => {
    this._setError(null);
    this._setSuccess(null);
  };

  _redirectToPasswordSignIn = (error) => {
    let search = qs.parse(this.props.location.search);
    search = { ...search, errorCode: error };
    this.props.history.push({
      pathname: '/sign-in',
      search: qs.stringify(search),
    });
  };

  toggleLoading = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  trackSignIn = (jwt, email) => {
    return Analytics.identify({ id: jwtDecode(jwt).uid, email }).then(() => {
      return AnalyticsService.track('Signed In', {
        category: 'Sign In',
        label: 'Auth Form - Sign In',
      });
    });
  };

  handlePasswordSubmit = (email, password, recaptcha, otp) => {
    this._clearAlerts();
    const next = RoutesHelper.getNext(this.props.location);

    AnalyticsService.track('Signed In CTA Clicked', {
      category: 'Sign In',
      label: 'Auth Form - Sign In',
    });

    if (!(email && password)) {
      this._setError(__('Must specify an email and password'));
    } else if (this.state.showRecaptcha && !recaptcha) {
      this._setError(__('Must solve ReCAPTCHA'));
    } else {
      this.toggleLoading();
      this.handleOtpModalClose();
      return UserService.authenticate(email, password, recaptcha, otp, next)
        .then((response) => {
          const { data } = response;
          // user-api returns a 200 with a requirement if there is more
          // needed to finish signing in the user
          if (data.req === ONE_TIME_PASSWORD_REQ) {
            this.handleOtpRequired();
            // if no error but OTP modal is turned on, need to
            // toggle the loading back off
            this.toggleLoading();
          } else if (
            data.req === BIRTHDATE_REQ ||
            data.req === TERMS_OF_USE_REQ ||
            data.req === WEAK_PASSWORD_REQ
          ) {
            LocationService.redirectSafelyTo(data.location);
          } else {
            const jwt = data.jwt;
            return this.trackSignIn(jwt, email).finally(() => {
              AuthenticationService.setJWT(jwt);
              LocationService.redirectSafelyTo(next);
            });
          }
        })
        .catch((error) => {
          const was2FA = this.state.isOtpModalOpen;

          this.toggleLoading();
          this.handleOtpModalClose();

          let errorText;
          if (isStatus(error, 401)) {
            this.setState({ showRecaptcha: true });
            if (was2FA) {
              errorText = __('The authentication code was invalid.');
            } else {
              errorText = __('The email or password you entered is invalid');
            }
          } else if (isStatus(error, 429)) {
            errorText = __(
              'You have made too many requests. Please try again in an hour.'
            );
          } else {
            errorText = __('Unable to sign in at this time.');
            SentryHelper.notify({
              descrip: 'error from user-api sign-in',
              component: SignIn.displayName,
              error,
            });
          }

          this._setError(errorText);
        });
    }
  };

  handleSsoSubmit = (email) => {
    this._clearAlerts();

    if (!email) {
      this._setError(__('Must specify an email'));
      return;
    }

    // Do a webfinger first to see if they should use SSO
    // If so, _get a redirect URL from User API and send them
    return UserService.webfinger(email)
      .then((idp) => {
        if (idp) {
          const url = UserService.ssoSignInUrl(email, idp, this._getNext());
          return LocationService.redirectSafelyTo(url);
        } else {
          this._redirectToPasswordSignIn('NO_SSO');
        }
      })
      .catch((error) => {
        // Report the error but degrade to password
        SentryHelper.notify({
          descrip: 'error from okta webfinger',
          component: SignIn.displayName,
          error,
        });
        this._redirectToPasswordSignIn('WEBFINGER_FAIL');
      });
  };

  handleOtpModalClose = () => {
    this.setState({ isOtpModalOpen: false });
  };

  handleOtpRequired = () => {
    this.setState({ isOtpModalOpen: true });
  };

  handlePasswordLinkClick = () => {
    AuthenticationService.clearSsoCookie();
  };

  _renderPassword = () => {
    const { isOtpModalOpen, showRecaptcha } = this.state;
    const { location } = this.props;
    const next = this._getNext();

    return (
      <div>
        <ProviderButtons
          type={SIGN_IN}
          next={next}
          providers={[Providers.GOOGLE, Providers.FACEBOOK]}
        />

        <OrSeparator />

        <SignInFormPassword
          onSubmit={this.handlePasswordSubmit}
          isOtpModalOpen={isOtpModalOpen}
          onOtpModalClose={this.handleOtpModalClose}
          onOtpSubmit={this.handlePasswordSubmit}
          location={location}
          showRecaptcha={showRecaptcha}
        />

        <OrSeparator />

        <Link to={{ pathname: '/sign-in/sso', search: location.search }}>
          {__('Sign in with your organization')}
        </Link>
      </div>
    );
  };

  _renderSso = () => {
    const { location } = this.props;

    return (
      <div>
        <SignInFormSSO onSubmit={this.handleSsoSubmit} />

        <OrSeparator />

        <Link
          onClick={this.handlePasswordLinkClick}
          to={{ pathname: '/sign-in', search: location.search }}
        >
          {__('Sign in with a different account')}
        </Link>
      </div>
    );
  };

  render = () => {
    const {
      isLoading,
      error,
      contactSupportText,
      contactSupportLink,
      success,
    } = this.state;
    const { isSso } = this.props;

    return (
      <div>
        <Loading busy={isLoading} label={__('Loading Sign In')} size="lg">
          <Helmet title={__('Sign In')} />
          <AuthPanels selectedTabIndex={1}>
            <FormHeader
              header={__('Sign in to your account')}
              description={__(
                'Build skills for today, tomorrow, and beyond.<br/>Education to future-proof your career.',
                { renderHTML: true }
              )}
            />
            <div className={styles.alerts}>
              <Alert type="success" isVisible={!!success} text={success} />

              <Alert
                type="error"
                isVisible={!!error}
                text={error}
                contactSupportText={contactSupportText}
                contactSupportLink={contactSupportLink}
              />
            </div>
            {isSso ? this._renderSso() : this._renderPassword()}
          </AuthPanels>
        </Loading>
      </div>
    );
  };
}

export default withRouter(SignIn);
