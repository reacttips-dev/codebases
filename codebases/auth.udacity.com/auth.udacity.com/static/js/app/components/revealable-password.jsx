import React from 'react';
import PropTypes from 'prop-types';
import { FormValidation, TextInput } from '@udacity/veritas-components';
import { IconViewOn, IconViewOff } from '@udacity/veritas-icons';
import styles from './revealable-password.module.scss';

export default class RevealablePassword extends React.Component {
  static propTypes = {
    testID: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    error: PropTypes.string,
  };

  static defaultProps = {
    error: null,
  };

  state = {
    isRevealed: false,
  };

  handleIconClick = () => {
    this.setState({
      isRevealed: !this.state.isRevealed,
    });
  };

  render() {
    const { error, onChange, placeholder, testID, value } = this.props;
    const inputType = this.state.isRevealed ? 'text' : 'password';

    return (
      <div className={styles.revealable_password}>
        <TextInput
          id="revealable-password"
          required
          testID={testID}
          placeholder={placeholder}
          label={placeholder}
          hiddenLabel
          type={inputType}
          value={value}
          onChange={onChange}
          validation={error && <FormValidation message={error} />}
        />
        <span className={styles.icon_container} onClick={this.handleIconClick}>
          {this.state.isRevealed ? (
            <IconViewOff color="silver" />
          ) : (
            <IconViewOn color="silver" />
          )}
        </span>
      </div>
    );
  }
}
