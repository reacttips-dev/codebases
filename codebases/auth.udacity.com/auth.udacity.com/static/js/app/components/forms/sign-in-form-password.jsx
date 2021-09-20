import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { TextInput } from '@udacity/veritas-components';
import { __ } from '../../../services/localization-service';
import RevealablePassword from '../revealable-password';
import OtpModal from '../otp-modal';
import RecaptchaForm from './recaptcha-form';

class SignInFormPassword extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onOtpModalClose: PropTypes.func.isRequired,
    isOtpModalOpen: PropTypes.bool,
    onOtpSubmit: PropTypes.func,
    showRecaptcha: PropTypes.bool
  };

  static defaultProps = {
    isOtpModalOpen: false,
    onOtpSubmit: () => {},
    showRecaptcha: false
  };

  state = {
    email: '',
    password: ''
  };

  handleRecaptchaChange = (recaptchaValue) => {
    this.recaptcha = recaptchaValue;
  };

  handleSubmit = () => {
    this.props.onSubmit(
      this.state.email.trim(),
      this.state.password,
      this.recaptcha,
      ''
    );
  };

  handleOtpSubmit = (otp) => {
    this.props.onOtpSubmit(
      this.state.email.trim(),
      this.state.password,
      this.recaptcha,
      otp
    );
  };

  render() {
    const { email, password } = this.state;
    const {
      isOtpModalOpen,
      onOtpModalClose,
      location,
      showRecaptcha
    } = this.props;

    return (
      <div data-testid="signin-form">
        <RecaptchaForm
          buttonLabel={__('Sign In')}
          onSubmit={this.handleSubmit}
          showRecaptcha={showRecaptcha}
          onRecaptchaChange={this.handleRecaptchaChange}
        >
          <TextInput
            id="email"
            testID="signin-email"
            required
            type="text"
            placeholder={__('Email Address')}
            label={__('Email Address')}
            hiddenLabel
            isFocus={true}
            data-cy="signin-email"
            value={email}
            onChange={(e) => {
              this.setState({ email: e.target.value.trim() });
            }}
          />

          <RevealablePassword
            testID="signin-password"
            placeholder={__('Password')}
            data-cy="signin-password"
            value={password}
            onChange={(e) => {
              this.setState({ password: e.target.value });
            }}
          />

          <div className="tos-blurb">
            {__(
              "By clicking Sign In, you agree to our <a href='<%= terms_of_service_link %>'><%= terms_of_service %></a> and our <a href='<%= privacy_policy_link %>'><%= privacy_policy %></a>.",
              {
                terms_of_service_link: __(
                  'https://www.udacity.com/legal/terms-of-service'
                ),
                terms_of_service: __('Terms of Use'),
                privacy_policy_link: __(
                  'https://www.udacity.com/legal/privacy'
                ),
                privacy_policy: __('Privacy Policy')
              },
              { renderHTML: true }
            )}
          </div>
        </RecaptchaForm>

        <br />

        <Link
          to={{ pathname: '/reset-password-email', search: location.search }}
        >
          {__('Forgot your password?')}
        </Link>

        <OtpModal
          onRequestClose={onOtpModalClose}
          onSubmit={this.handleOtpSubmit}
          isOpen={isOtpModalOpen}
        />
      </div>
    );
  }
}

export default withRouter(SignInFormPassword);
