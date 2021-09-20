import React from 'react';
import PropTypes from 'prop-types';

import { __ } from '../../services/localization-service';
import RevealablePassword from './revealable-password';
import styles from './password-creator.module.scss';
import { calcPasswordStrength } from '../helpers/form-helper';

export default class PasswordCreator extends React.Component {
  static propTypes = {
    testID: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    showRules: PropTypes.bool,
    error: PropTypes.string,
  };

  static defaultProps = {
    error: null,
    showRules: false,
  };

  state = {
    passwordStrength: 0,
    passwordChanged: false,
  };

  onPasswordChange = (e) => {
    const passwordStrength = calcPasswordStrength(e.target.value);
    this.setState({ passwordStrength, passwordChanged: true });
    this.props.onChange(e);
  };

  render() {
    const { error, testID, value, showRules } = this.props;
    const { passwordStrength, passwordChanged } = this.state;

    return (
      <div className={styles.password_creator}>
        <RevealablePassword
          testID={testID}
          placeholder={__('Password')}
          value={value}
          onChange={this.onPasswordChange}
          error={passwordChanged ? null : error}
        />

        {passwordChanged && (
          <meter
            className={styles.strength_meter}
            max="3"
            low="1.1"
            high="2.9"
            optimum="3"
            value={passwordStrength}
          />
        )}

        {showRules && (
          <div className={styles.password_rules}>
            <ul>
              <li className={styles.password_rule}>
                Password must be 10 characters or more
              </li>
              <li className={styles.password_rule}>
                Password must have at least 8 unique characters
              </li>
              <li className={styles.password_rule}>
                Password cannot be your name or email address
              </li>
              <li className={styles.password_rule}>
                Password cannot be included in a known breach
              </li>
            </ul>
            <div className={styles.password_rule}>
              We encourage you to not use the same password you have used for
              another site. Passwords will be checked against datasets like{' '}
              <a href="https://haveibeenpwned.com">HaveIBeenPwned</a>.
            </div>
          </div>
        )}
      </div>
    );
  }
}
