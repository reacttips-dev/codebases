import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import PropTypes from 'prop-types';

export default class CrashHandler extends Component {
  constructor (props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true });
    pm.logger.error('CrashHandler~componentDidCatch: Error logged via props', this.props.errorMessage, error, info);
  }

  renderAction () {
    if (_.isFunction(this.props.renderAction)) {
      return this.props.renderAction();
    }
    else if (_.isFunction(this.props.onClose)) {
      return (
        <Button
          type='primary'
          onClick={this.props.onClose}
        >
          {this.props.buttonText || 'Close'}
        </Button>
      );
    }
  }

  render () {
    if (this.state.hasError && this.props.silent) {
      return null;
    }

    if (this.state.hasError || this.props.showError) {
      return (
        <div className='app-crash-wrapper'>
          <div className='app-crash-thumbnail' />
          <div className='app-crash-content-container'>
            <div className='app-crash-header'>Something Went Wrong</div>
            <div className='app-crash-content'>
              {this.props.message || 'Postman has encountered an error. If this problem persists, contact us at help@postman.com'}
            </div>
            {this.renderAction()}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

CrashHandler.propTypes = {
  renderAction: PropTypes.func,
  onClose: PropTypes.func,
  buttonText: PropTypes.string,
  message: PropTypes.string
};

