import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import _get from 'lodash/get';
import _some from 'lodash/some';
import { Loading } from '@udacity/veritas-components';
import Analytics from '@udacity/ureact-analytics';
import {
  AgeService,
  AuthenticationService,
  LocalizationService,
  LocationService,
  UserService
} from '../../services';
import { __ } from '../../services/localization-service';

import Alert from '../components/alert';
import SentryHelper from '../helpers/sentry-helper';
import AnalyticsService from '../helpers/analytics-helper';
import AuthPanels from '../components/auth-panels';
import FormHeader from '../components/form-header';
import OrSeparator from '../components/or-separator';
import ProviderButtons from '../components/provider-buttons';
import Providers from '../constants/social-providers';
import RoutesHelper from '../helpers/routes-helper';
import SignUpForm from '../components/forms/sign-up-form';
import { SIGN_UP } from '../constants/sign-x';
import { formatNumber, validateForm } from '../helpers/form-helper';
import { translateError } from '../helpers/user-error-helper';
import styles from '../components/form.module.scss';

class SignUp extends Component {
  state = {
    error: null,
    fieldErrors: {},
    isLoading: false,
    ageRequirement: {},
    isAgeGateModalOpen: false,
    showRecaptcha: false,
    showPasswordError: false
  };

  componentDidMount() {
    Analytics.page('Sign Up', 'Sign Up');
    const errorCode = RoutesHelper.getQueryParam(
      this.props.location,
      'errorCode'
    );

    if (errorCode) {
      // General 500 from user-api, different translation for sign-up
      if (errorCode === 5000) {
        this._setError(__('Unable to sign up at this time'));
      } else {
        this._setError(translateError(errorCode));
      }
    }

    const ageRequirement = AgeService.getAgeRequirement();
    this.setState({ ageRequirement });
  }

  handleFormChange = () => {
    if (!this.signUpFormFillTracked) {
      this.signUpFormFillTracked = true;
      AnalyticsService.track('Sign Up Started', { category: 'Sign Up' });
    }
  };

  _getNext() {
    return RoutesHelper.getNext(this.props.location);
  }

  _setError(error) {
    this.setState({
      error
    });
  }

  handleAgeGate = (e) => {
    e.preventDefault();
    this.setState({
      isAgeGateModalOpen: true
    });
  };

  handleAgeGateModalClose = () => {
    this.setState({ isAgeGateModalOpen: false });
  };

  handleBirthdateFormChange = () => {
    this.setState((prevState) => ({
      fieldErrors: {
        ...prevState.fieldErrors,
        invalidDate: null,
        insufficientBirthday: null
      }
    }));
  };

  handleToggleLoading = () => {
    this.setState({
      isLoading: !this.state.isLoading
    });
  };

  validate = (formValues = {}) => {
    const { ageRequirement } = this.state;
    let fieldErrors = validateForm(formValues, ageRequirement);

    this.setState({ fieldErrors });
    return fieldErrors;
  };

  trackSignUp = (jwt, email, enabledRecaptcha = false) => {
    return Analytics.identify({ id: jwtDecode(jwt).uid, email }).then(() => {
      AnalyticsService.trackEmailLeadGenEvent(email);
      return AnalyticsService.track('Signed Up', {
        category: 'Sign Up',
        enabledRecaptcha,
        label: 'Auth Form - Sign Up'
      });
    });
  };

  authenticate = (formValues) => {
    const { ageRequirement, showRecaptcha } = this.state;
    const { email } = formValues;

    if (ageRequirement.ageRequired) {
      // Use UTC date here for consistency with user-api.
      formValues.birthdate = `${formValues.year}-${formatNumber(
        formValues.month
      )}-${formatNumber(formValues.day)}`;
    }
    return UserService.register(formValues).then(({ data: { jwt } }) => {
      return this.trackSignUp(jwt, email, showRecaptcha).finally(() => {
        AuthenticationService.setJWT(jwt);
        LocationService.redirectSafelyTo(this._getNext());
      });
    });
  };

  handleSubmit = (formValues) => {
    this._setError(null);
    const fieldErrors = this.validate(formValues);

    AnalyticsService.track('Signed Up CTA Clicked', {
      category: 'Sign Up',
      label: 'Auth Form - Sign Up'
    });

    if (_some(fieldErrors)) {
      const showPasswordError = !!fieldErrors.password;

      this.setState({
        fieldErrors,
        isAgeGateModalOpen: !!fieldErrors.insufficientBirthday,
        showPasswordError
      });
      return;
    }

    this.handleToggleLoading();
    this.setState({ showRecaptcha: false, showPasswordError: false });

    const authPromise = this.authenticate(formValues).catch((error) => {
      this.handleToggleLoading();

      const status = _get(error, 'response.status');
      const data = _get(error, 'response.data') || {};
      let errorText;

      console.log('data', data);

      // New weak password code
      if (data.error_code === 4203) {
        errorText = translateError(data.error_code);
        this.setState({ showPasswordError: true, error: errorText });
        return;
      }

      // If we have a granular error code from User API, use that
      // (backwards compat so we can ship auth-web before user-api)
      if (data.error_code) {
        errorText = translateError(data.error_code);
      }

      // Otherwise use the status codes
      if (!errorText) {
        if (status === 409) {
          errorText = __('This email is already registered');
        } else if (status === 429) {
          // they were rate limited, enable ReCAPTCHA
          this.setState({ showRecaptcha: true });
        } else {
          errorText = __('Unable to sign up at this time');
          SentryHelper.notify({
            descrip: 'error from authCall',
            component: SignUp.displayName,
            error,
            // Have recurring issue where sign-up responds with a 400
            // saying we didn't submit the birthdate info, need to find out
            // what our state is when that happens
            extra: {
              age_service: JSON.stringify(AgeService.getAgeRequirement()),
              state: JSON.stringify(this.state),
              geo_location: LocalizationService.getGeoLocation()
            }
          });
        }
      }
      this._setError(errorText);
    });

    return authPromise;
  };

  render() {
    const {
      ageRequirement,
      error,
      fieldErrors,
      isAgeGateModalOpen,
      isLoading,
      showRecaptcha,
      showPasswordError
    } = this.state;

    return (
      <div>
        <Loading busy={isLoading} label={__('Loading Sign Up')} size="lg">
          <Helmet title={__('Sign Up')} />
          <AuthPanels selectedTabIndex={0}>
            <FormHeader
              header={__('Create your account')}
              description={__(
                'Build skills for today, tomorrow, and beyond.<br/>Education to future-proof your career.',
                { renderHTML: true }
              )}
            />

            <div className={styles.alerts}>
              <Alert type="error" isVisible={!!error} text={error} />
            </div>

            <ProviderButtons
              type={SIGN_UP}
              next={this._getNext()}
              providers={[Providers.GOOGLE, Providers.FACEBOOK]}
            />

            <OrSeparator />

            <SignUpForm
              ageRequired={ageRequirement.ageRequired}
              fieldErrors={fieldErrors}
              onBirthdateFormChange={this.handleBirthdateFormChange}
              onSubmit={this.handleSubmit}
              onFormChange={this.handleFormChange}
              onAgeGateModalClose={this.handleAgeGateModalClose}
              isAgeGateModalOpen={isAgeGateModalOpen}
              showRecaptcha={showRecaptcha}
              showPasswordError={showPasswordError}
            />
          </AuthPanels>
        </Loading>
      </div>
    );
  }
}

export default withRouter(SignUp);
