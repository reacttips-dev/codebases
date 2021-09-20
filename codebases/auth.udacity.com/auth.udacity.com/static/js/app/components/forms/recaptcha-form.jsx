import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Recaptcha from 'react-google-recaptcha';
import { config } from 'config';
import { Space } from '@udacity/veritas-components';
import Form from '../form';
import styles from './recaptcha-form.module.scss';

export default class RecaptchaForm extends Component {
  static propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    showRecaptcha: PropTypes.bool.isRequired,
    onRecaptchaChange: PropTypes.func.isRequired
  };

  recaptchaRef = React.createRef();

  handleSubmit = () => {
    const instance = this.recaptchaRef.current;
    this.props.onRecaptchaChange(instance.getValue());
  };

  render() {
    const { buttonLabel, onSubmit, showRecaptcha } = this.props;
    return (
      <Form buttonLabel={buttonLabel} onSubmit={onSubmit}>
        {this.props.children}
        {showRecaptcha && (
          <Space type="stack" size="3x">
            <div className={styles.recaptcha}>
              <Recaptcha
                ref={this.recaptchaRef}
                sitekey={config.RECAPTCHA_KEY}
                onChange={this.handleSubmit}
              />
            </div>
          </Space>
        )}
      </Form>
    );
  }
}
