import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormValidation, TextInput } from '@udacity/veritas-components';
import { __ } from '../../../services/localization-service';

import AgeGateModal from '../age-gate-modal';
import BirthdateForm from './birthdate-form';
import RecaptchaForm from './recaptcha-form';
import PasswordCreator from '../password-creator';

export default class SignUpForm extends Component {
  static propTypes = {
    fieldErrors: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onFormChange: PropTypes.func.isRequired,
    onAgeGateModalClose: PropTypes.func.isRequired,
    onBirthdateFormChange: PropTypes.func,
    isAgeGateModalOpen: PropTypes.bool,
    showRecaptcha: PropTypes.bool,
    showPasswordError: PropTypes.bool
  };

  static defaultProps = {
    onBirthdateFormChange: () => {},
    isAgeGateModalOpen: false,
    showRecaptcha: false,
    showPasswordError: false
  };

  static contextTypes = {
    location: PropTypes.object
  };

  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  _getBirthday() {
    const birthdate = {
      day: this._birthdateForm.day.getValue(),
      month: this._birthdateForm.month.getValue(),
      year: this._birthdateForm.year.getValue()
    };
    return birthdate;
  }

  handleSubmit = () => {
    const recaptcha = this.recaptcha;
    const formValues = {
      firstName: this.state.firstName.trim(),
      lastName: this.state.lastName.trim(),
      email: this.state.email.trim(),
      password: this.state.password,
      recaptcha
    };
    if (this.props.ageRequired) {
      const birthdate = this._getBirthday();
      formValues.day = birthdate.day;
      formValues.month = birthdate.month;
      formValues.year = birthdate.year;
    }
    this.props.onSubmit(formValues);
    this.recaptcha = '';
  };

  handleRecaptchaChange = (recaptchaValue) => {
    this.recaptcha = recaptchaValue;
  };

  _renderBirthdayForm() {
    const { ageRequired, onBirthdateFormChange } = this.props;
    const birthdateFormLabel = __('Birthdate Form');
    return ageRequired ? (
      <BirthdateForm
        label={birthdateFormLabel}
        ref={(ref) => (this._birthdateForm = ref)}
        onBirthdateFormChange={onBirthdateFormChange}
        shouldRenderDescription={true}
        error={this.props.fieldErrors['invalidDate']}
      />
    ) : null;
  }

  render() {
    const {
      fieldErrors,
      onFormChange,
      isAgeGateModalOpen,
      onAgeGateModalClose,
      showRecaptcha,
      showPasswordError
    } = this.props;

    const { firstName, lastName, email, password } = this.state;
    const tosLabel = __('Terms of Service');

    return (
      <div>
        <RecaptchaForm
          buttonLabel={__('Sign Up')}
          onSubmit={this.handleSubmit}
          showRecaptcha={showRecaptcha}
          onRecaptchaChange={this.handleRecaptchaChange}
        >
          <TextInput
            id="first-name"
            type="text"
            required
            placeholder={__('First Name')}
            label={__('First Name')}
            hiddenLabel
            value={firstName}
            validation={
              fieldErrors['firstName'] && (
                <FormValidation message={fieldErrors['firstName']} />
              )
            }
            onChange={(e) => {
              onFormChange();
              this.setState({ firstName: e.target.value.trimLeft() });
            }}
          />
          <TextInput
            id="last-name"
            type="text"
            required
            placeholder={__('Last Name')}
            label={__('Last Name')}
            hiddenLabel
            value={lastName}
            validation={
              fieldErrors['lastName'] && (
                <FormValidation message={fieldErrors['lastName']} />
              )
            }
            onChange={(e) => {
              onFormChange();
              this.setState({ lastName: e.target.value.trimLeft() });
            }}
          />

          <TextInput
            id="email"
            type="text"
            required
            placeholder={__('Email Address')}
            label={__('Email Address')}
            hiddenLabel
            value={email}
            validation={
              fieldErrors['email'] && (
                <FormValidation message={fieldErrors['email']} />
              )
            }
            onChange={(e) => {
              onFormChange();
              this.setState({ email: e.target.value.trim() });
            }}
          />

          <PasswordCreator
            value={password}
            error={fieldErrors['password']}
            showRules={showPasswordError}
            onChange={(e) => {
              onFormChange();
              this.setState({ password: e.target.value });
            }}
          />

          {this._renderBirthdayForm()}

          <div className="tos-blurb" label={tosLabel}>
            {__(
              "By clicking Sign Up, you agree to our <a href='<%= terms_of_service_link %>'><%= terms_of_service %></a> and our <a href='<%= privacy_policy_link %>'><%= privacy_policy %></a>.",
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

        <AgeGateModal
          onRequestClose={onAgeGateModalClose}
          isOpen={isAgeGateModalOpen}
        />
      </div>
    );
  }
}
