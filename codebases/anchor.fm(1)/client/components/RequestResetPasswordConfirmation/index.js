import React, { Component } from 'react';
import SuccessButton from '../SuccessButton';
import styles from './styles.sass';

class RequestResetPasswordConfirmation extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClickLogIn = this.handleClickLogIn.bind(this);
  }

  handleClickLogIn(evt) {
    const { clickLogIn } = this.props;
    evt.preventDefault();
    clickLogIn();
  }

  render() {
    return (
      <div>
        <p className="text-center">Email sent!</p>
        <SuccessButton
          className={styles.successIcon}
          bgColor="#5000b9"
          fgColor="#ffffff"
        />
        <p className="text-center">
          Click the link in the email we sent to finish resetting your password.
        </p>
        <p className={`text-center ${styles.loginFooter}`}>
          <a href onClick={this.handleClickLogIn}>
            Return to login
          </a>
        </p>
      </div>
    );
  }
}

export default RequestResetPasswordConfirmation;
