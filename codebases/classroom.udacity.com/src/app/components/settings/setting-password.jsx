import {
  FormValidation,
  Heading,
  TextInput,
} from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import SettingButtons from './_setting-buttons';
import UserService from 'services/user-service';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import isLength from 'validator/lib/isLength';
import styles from './setting-password.scss';

@cssModule(styles)
export class SettingPassword extends React.Component {
  static displayName = 'settings/setting-password';

  static propTypes = {
    createErrorAlert: PropTypes.func.isRequired,
    createNotificationAlert: PropTypes.func.isRequired,
  };

  state = {
    currentPassword: '',
    newPassword: '',
    newPasswordRetype: '',
    isCurrentPasswordValid: true,
    isNewPasswordValid: true,
    areNewPasswordsMatching: true,
  };

  _clearErrors = () => {
    this.setState({
      isCurrentPasswordValid: true,
      isNewPasswordValid: true,
      areNewPasswordsMatching: true,
    });
  };

  _clearFields = () => {
    this.setState({
      currentPassword: '',
      newPassword: '',
      newPasswordRetype: '',
    });
    this._clearErrors();
  };

  _validateNewPassword(value) {
    return isLength(value, 6, 50);
  }

  handleCurrentPasswordChange = (evt) => {
    this.setState({ currentPassword: _.get(evt, 'target.value') });
  };

  handleNewPasswordChange = (evt) => {
    const newPassword = _.get(evt, 'target.value');
    const isNewPasswordValid = this._validateNewPassword(newPassword);
    this.setState({ newPassword, isNewPasswordValid });
  };

  handleRetypePasswordChange = (evt) => {
    const { newPassword } = this.state;
    const newPasswordRetype = _.get(evt, 'target.value');
    const areNewPasswordsMatching = newPassword === newPasswordRetype;

    this.setState({ newPasswordRetype, areNewPasswordsMatching });
  };

  handleSaveClick = () => {
    this._clearErrors();

    const {
      currentPassword,
      newPassword,
      isNewPasswordValid,
      areNewPasswordsMatching,
    } = this.state;

    if (isNewPasswordValid && areNewPasswordsMatching) {
      return UserService.resetPassword(currentPassword, newPassword)
        .then(() => {
          this._clearFields();
          this.props.createNotificationAlert(
            __('Password changed successfully')
          );
        })
        .catch(() => {
          this.props.createErrorAlert('Unable to change your password');
          this.setState({
            isCurrentPasswordValid: false,
          });
        });
    }
  };

  render() {
    const {
      isCurrentPasswordValid,
      isNewPasswordValid,
      areNewPasswordsMatching,
    } = this.state;

    const currentPasswordInput = (
      <TextInput
        id="current"
        label="current"
        hiddenLabel
        value={this.state.currentPassword}
        onChange={this.handleCurrentPasswordChange}
        placeholder={__('Current Password')}
        type="password"
        validation={
          !isCurrentPasswordValid ? (
            <FormValidation message={__('Password entered is incorrect')} />
          ) : null
        }
      />
    );

    const newPasswordInput = (
      <TextInput
        id="new"
        label="new"
        hiddenLabel
        value={this.state.newPassword}
        onChange={this.handleNewPasswordChange}
        placeholder={__('New Password')}
        type="password"
        validation={
          !isNewPasswordValid ? (
            <FormValidation
              message={__('New password must be at least 6 characters')}
            />
          ) : null
        }
      />
    );

    const verifyPasswordInput = (
      <TextInput
        id="verify"
        label="verify"
        hiddenLabel
        value={this.state.newPasswordRetype}
        onChange={this.handleRetypePasswordChange}
        placeholder={__('Verify Password')}
        type="password"
        validation={
          !areNewPasswordsMatching ? (
            <FormValidation message={__('Passwords must match')} />
          ) : null
        }
      />
    );

    return (
      <section styleName="content-container">
        <div>
          <div styleName="main">
            <div styleName="password-container">
              <Heading size="h3" as="h1">
                {__('Change Password')}
              </Heading>
              {currentPasswordInput}
              {newPasswordInput}
              {verifyPasswordInput}
            </div>
          </div>

          <SettingButtons
            isSaveEnabled={areNewPasswordsMatching && isNewPasswordValid}
            onSaveClick={this.handleSaveClick}
            onCancelClick={this._clearFields}
          />
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = actionsBinder(
  'createErrorAlert',
  'createNotificationAlert'
);

export default connect(null, mapDispatchToProps)(SettingPassword);
