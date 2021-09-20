import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  FormFieldset,
  Modal,
  TextInput
} from '@udacity/veritas-components';
import { __ } from '../../services/localization-service';

import Alert from '../components/alert';
import styles from './otp-modal.module.scss';
import { ENTER_KEY_CODE } from '../constants';

export default class OtpModal extends Component {
  // Note: OTP = One Time Password,
  // refers to the authentication code used in
  // Two Factor Authentication (2FA)

  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
  };

  state = {
    error: null
  };

  handleKeyPress = (e) => {
    if (e.which === ENTER_KEY_CODE) {
      e.preventDefault();
      this.handleSubmitClick();
    }
  };

  handleSubmitClick = () => {
    const otp = this.refs.otp.getValue();
    if (!otp) {
      this.setState({ error: __('You must enter an authorization code.') });
      return;
    }

    this.setState({ error: null });
    this.props.onSubmit(otp);
  };

  render() {
    const { onRequestClose, isOpen } = this.props;
    const { error } = this.state;
    const placeholder = __('Authentication code');

    return (
      <Modal
        label={__('Two Factor Authentication Modal')}
        onClose={onRequestClose}
        open={isOpen}
      >
        <div>
          <div className={styles.info}>
            <div className={styles.header}>
              {__('Two Factor Authentication')}
            </div>

            <div className={styles.description}>
              {__(
                'Enter a code from your two factor authentication app to verify your identity.'
              )}
            </div>
          </div>

          <div className={styles.footer}>
            <Alert
              className={styles.alert}
              type="error"
              isVisible={!!error}
              text={error}
            />

            <FormFieldset>
              <TextInput
                autoFocus={true}
                id="otp"
                label={placeholder}
                hiddenLabel
                onKeyDown={this.handleKeyPress}
                placeholder={placeholder}
              />
              <Button
                label={__('Sign In')}
                onClick={this.handleSubmitClick}
                type="submit"
                variant="primary"
              />
            </FormFieldset>
          </div>
        </div>
      </Modal>
    );
  }
}
