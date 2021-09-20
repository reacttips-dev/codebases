import { IconChecked, IconInfo, IconRepeat } from '@udacity/veritas-icons';

import Actions from 'actions';
import BusyButton from 'components/common/busy-button';
import { Loading } from '@udacity/veritas-components';
import NotificationPreferencesApiService from 'services/notification-preferences-api-service';
import PhoneNumberEditor from './_phone-number-editor';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import { i18n } from 'services/localization-service';
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';
import styles from './_phone-number-manager.scss';
import { validatePhoneNumber } from 'helpers/phone-number-helper';

const VERIFICATION_CODE_LENGTH = 4;

const STATES = {
  UNVERIFIED: 'UNVERIFIED',
  VERIFICATION_STARTED: 'VERIFICATION_STARTED',
  WAITING_FOR_CODE: 'WAITING_FOR_CODE',
  CODE_VALIDATION_STARTED: 'CODE_VALIDATION_STARTED',
  WAITING_FOR_VALIDATION: 'WAITING_FOR_VALIDATION',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  VERIFIED: 'VERIFIED',
};

@cssModule(styles)
export class PhoneNumberManager extends React.Component {
  static displayName = 'settings/setting-personal-info/_phone-number-manager';

  static propTypes = {
    className: PropTypes.string,
    createErrorAlert: PropTypes.func.isRequired,
    createNotificationAlert: PropTypes.func.isRequired,
    notifyPhoneVerificationComplete: PropTypes.func.isRequired,
    number: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    userKey: PropTypes.string.isRequired,
    isEmailVerified: PropTypes.bool.isRequired,
    verified: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    const { number, verified } = this.props;

    this.state = {
      number: number || '',
      verificationCode: '',
      verificationState: verified ? STATES.VERIFIED : STATES.UNVERIFIED,
    };
  }

  handleNumberChange = (number = '') => {
    const { verificationState } = this.state;
    let nextVerificationState = verificationState;
    if (this.isNumberChanged(number)) {
      nextVerificationState = STATES.UNVERIFIED;
    } else if (this.props.verified) {
      nextVerificationState = STATES.VERIFIED;
    }

    this.setState({ number, verificationState: nextVerificationState });
  };

  handleCodeChange = (evt) => {
    const newVerificationCode = evt.target.value;
    this.setState({
      verificationCode: newVerificationCode,
      isCodeValid: newVerificationCode.length === VERIFICATION_CODE_LENGTH,
    });
  };

  handleStartVerification = async (evt) => {
    evt.preventDefault();
    const { createErrorAlert, userKey } = this.props;
    const { number } = this.state;
    const parsedNumber = parsePhoneNumberFromString(number || '') || {};

    this.setState({ verificationState: STATES.VERIFICATION_STARTED });

    const {
      success,
      error,
    } = await NotificationPreferencesApiService.startPhoneNumberVerification(
      userKey,
      parsedNumber.countryCallingCode,
      parsedNumber.nationalNumber,
      i18n.getLocale()
    );
    if (success) {
      this.setState({ verificationState: STATES.WAITING_FOR_CODE });
    } else {
      this.setState({ verificationState: STATES.UNVERIFIED });
      const alert =
        error === 'InvalidPhoneNumberOrCountryCode'
          ? __(
              'Our SMS service does not consider this a valid number. Please check your phone number and try again.'
            )
          : error === 'TooManyVerificationRequests'
          ? __(
              'Too many failed SMS verification attempts. Please try again in 24 hours.'
            )
          : __(
              'An error occurred while trying to generate a verification code. Please try again.'
            );

      createErrorAlert(alert);
    }
  };

  handleSubmitVerification = async () => {
    const {
      createErrorAlert,
      createNotificationAlert,
      notifyPhoneVerificationComplete,
      onChange,
      userKey,
    } = this.props;
    const { number, verificationCode } = this.state;
    const parsedNumber = parsePhoneNumberFromString(number || '') || {};

    this.setState({ verificationState: STATES.CODE_VALIDATION_STARTED });

    const {
      success,
      error,
    } = await NotificationPreferencesApiService.verifyPhoneNumber(
      userKey,
      verificationCode,
      parsedNumber.countryCallingCode,
      parsedNumber.nationalNumber
    );
    if (success) {
      this.setState({ verificationState: STATES.VERIFIED });
      notifyPhoneVerificationComplete(number);
      createNotificationAlert(
        __('Verification Successful! Your mobile number is saved.')
      );
      onChange(number, true);
    } else {
      this.setState({ verificationState: STATES.VALIDATION_FAILED });
      const alert =
        error === 'IncorrectVerificationCode'
          ? __(
              'Failed to verify. Please check your verification code and try again.'
            )
          : __(
              'An error occurred while trying to validate your verification code. Please try again.'
            );
      createErrorAlert(alert);
    }
  };

  isNumberChanged = (number) => {
    return this.props.number !== number;
  };

  renderVerifying() {
    const { isCodeValid, verificationCode, verificationState } = this.state;

    if (verificationState === STATES.VERIFICATION_STARTED) {
      return <Loading />;
    }

    return (
      <div>
        <a
          href="#"
          styleName="phone-note"
          onClick={this.handleStartVerification}
        >
          <IconRepeat size="sm" />
          <span>{__('Resend verification code')}</span>
        </a>
        <p id="code-description">
          {__(
            'Enter your one-time verification code that was sent to your mobile device:'
          )}
        </p>
        <div styleName="verification-code">
          <input
            className={
              verificationState === STATES.VALIDATION_FAILED
                ? styles['error-field']
                : styles['field']
            }
            type="text"
            value={verificationCode}
            onChange={this.handleCodeChange}
            maxLength={VERIFICATION_CODE_LENGTH}
            aria-describedby="code-description"
          />
          <BusyButton
            onClick={this.handleSubmitVerification}
            variant="primary"
            disabled={!isCodeValid}
            label={__('Submit')}
          />
        </div>
      </div>
    );
  }

  renderNotVerifying() {
    const { verificationState } = this.state;

    return (
      <div styleName="phone-note">
        {verificationState === STATES.VERIFIED ? (
          <IconChecked size="sm" color="black" />
        ) : (
          <IconInfo size="sm" color="orange" />
        )}
        <p>
          {verificationState === STATES.VERIFIED
            ? __(
                'Mobile phone number is verified. Visit <a href="<%= url %>">notifications</a> to disable SMS notifications for this number.',
                { url: `${CONFIG.classroomUrl}/settings/notifications` },
                { renderHTML: true }
              )
            : !!this.props.isEmailVerified
            ? __(
                'A one-time verification code will be sent to your mobile device.'
              )
            : __(`Complete email verification before SMS verification`)}
        </p>
      </div>
    );
  }

  render() {
    const { className } = this.props;
    const { number, verificationState } = this.state;
    const isNumberValid = validatePhoneNumber(number);
    const isVerified = verificationState === STATES.VERIFIED;
    const isVerifying = _.includes(
      [
        STATES.VERIFICATION_STARTED,
        STATES.WAITING_FOR_CODE,
        STATES.CODE_VALIDATION_STARTED,
        STATES.WAITING_FOR_VALIDATION,
        STATES.VALIDATION_FAILED,
      ],
      verificationState
    );

    let label = __('Send Code');
    if (isVerifying) {
      label = __('Verifying...');
    } else if (isVerified) {
      label = __('Verified');
    }

    return (
      <div className={className}>
        <div styleName="phone-number">
          <PhoneNumberEditor
            styleName="editor"
            inputClassName={
              isNumberValid || _.isEmpty(number)
                ? styles['field']
                : styles['error-field']
            }
            value={number}
            onChange={this.handleNumberChange}
          />
          <BusyButton
            onClick={this.handleStartVerification}
            variant="primary"
            // isVerified and isVerifying refer to the sms verification status
            disabled={
              !isNumberValid ||
              isVerified ||
              isVerifying ||
              !this.props.isEmailVerified
            }
            label={label}
          />
        </div>
        {isVerifying ? this.renderVerifying() : this.renderNotVerifying()}
      </div>
    );
  }
}

const {
  createNotificationAlert,
  createErrorAlert,
  notifyPhoneVerificationComplete,
} = Actions;

export default connect(null, {
  createNotificationAlert,
  createErrorAlert,
  notifyPhoneVerificationComplete,
})(PhoneNumberManager);
