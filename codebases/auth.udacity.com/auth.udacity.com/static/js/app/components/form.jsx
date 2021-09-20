import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormFieldset } from '@udacity/veritas-components';
import Alert from '../components/alert';
import FormHeader from '../components/form-header';
import styles from './form.module.scss';
import { ENTER_KEY_CODE } from '../constants';

export default class Form extends Component {
  static propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    header: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    error: PropTypes.string,
    success: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    header: null,
    description: null,
    error: null,
    success: null,
    children: null
  };

  handleKeyPress = (e) => {
    if (e.which === ENTER_KEY_CODE) {
      e.preventDefault();
      this.props.onSubmit();
    }
  };

  render() {
    let {
      buttonLabel,
      onSubmit,
      header,
      description,
      error,
      success
    } = this.props;

    return (
      <div>
        <FormHeader header={header} description={description} />

        <div className={styles.alerts}>
          <Alert type="success" isVisible={!!success} text={success} />

          <Alert type="error" isVisible={!!error} text={error} />
        </div>

        <form onKeyPress={this.handleKeyPress}>
          <FormFieldset>
            {this.props.children}
            <Button label={buttonLabel} onClick={onSubmit} variant="primary" />
          </FormFieldset>
        </form>
      </div>
    );
  }
}
