import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Modal, ModalHeader, ModalContent } from '@postman-app-monolith/renderer/js/components/base/Modals';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import LoadingIndicator from '@postman-app-monolith/renderer/js/components/base/LoadingIndicator';
import ErrorIcon from '@postman-app-monolith/renderer/js/components/base/Icons/ErrorIcon';
import SuccessIcon from '@postman-app-monolith/renderer/js/components/base/Icons/SuccessBadgeIcon';

const MODAL_CLOSE_TIMEOUT = 5;

export default class OAuth2WaitingModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      status: '',
      error: '',
      closingIn: MODAL_CLOSE_TIMEOUT
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleWaitingForCallback = this.handleWaitingForCallback.bind(this);
    this.handleWaitingForToken = this.handleWaitingForToken.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.proceedWithToken = this.proceedWithToken.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('oauth2Start', this.handleWaitingForCallback);
    pm.mediator.on('oauth2TokenRequest', this.handleWaitingForToken);
    pm.mediator.on('oauth2Error', this.handleError);
    pm.mediator.on('newOAuth2Token', this.handleSuccess);
  }

  componentWillUnmount () {
    pm.mediator.off('oauth2Start', this.handleWaitingForCallback);
    pm.mediator.off('oauth2TokenRequest', this.handleWaitingForToken);
    pm.mediator.off('oauth2Error', this.handleError);
    pm.mediator.off('newOAuth2Token', this.handleSuccess);
  }

  getCustomStyles () {
    return {
      marginTop: '20vh',
      width: '615px'
    };
  }

  getTitleClasses () {
    return classnames({
      'oauth2-waiting-title': true,
      'oauth2-waiting-title__success': this.state.status === 'success',
      'oauth2-waiting-title__error': this.state.status === 'error'
    });
  }

  handleClose () {
    // Clear modal close timer which was started on success
    clearInterval(this.closeModalTimer);

    this.props.onClose();
  }

  handleWaitingForCallback () {
    this.setState({
      status: 'waitingForCallback',
      error: ''
    });
  }

  handleWaitingForToken () {
    this.setState({
      status: 'waitingForToken',
      error: ''
    });
  }

  handleError (err) {
    if (!err) { return; }

    this.setState({
      status: 'error',
      error: _.startsWith(err, 'Oauth request timed out') ? 'Authentication timed out' : 'Authentication failed'
    });
  }

  handleSuccess (token) {
    this.setState({
      status: 'success',
      token,
      closingIn: MODAL_CLOSE_TIMEOUT
    });

    // Set timer to automatically close this modal
    this.closeModalTimer = setInterval(() => {
      if (this.state.closingIn === 0) {
        this.proceedWithToken();
      } else {
        this.setState((prev) => ({ closingIn: prev.closingIn - 1 }));
      }
    }, 1000);
  }

  proceedWithToken () {
    this.handleClose();

    // Open the generated token
    pm.mediator.trigger('openNewOAuth2Token', this.state.token, this.props.handleTokenSelect);
  }


  render () {
    let statusIcon,
      title,
      description,
      btnText,
      btnAction;

    if (this.state.status === 'waitingForCallback') {
      statusIcon = <LoadingIndicator />;
      title = 'Authenticate via browser';
      description = 'This dialogue will automatically close once the auth callback is received. Make sure your browser is not blocking pop-up window.';
      btnText = 'Cancel authentication';
      btnAction = this.handleClose;
    } else if (this.state.status === 'waitingForToken') {
      statusIcon = <LoadingIndicator />;
      title = 'Collecting Access Token';
      description = 'This dialogue will automatically close once the token is received.';
      btnText = 'Cancel authentication';
      btnAction = this.handleClose;
    } else if (this.state.status === 'error') {
      statusIcon = <ErrorIcon size='md' />;
      title = this.state.error;
      description = 'Couldn\'t complete authentication. Check the Postman Console for more details.';
      btnText = 'Retry';
      btnAction = this.props.onRetry;
    } else {
      statusIcon = <SuccessIcon size='md' />;
      title = 'Authentication complete';
      description = `This dialogue will automatically close in ${this.state.closingIn}...`;
      btnText = 'Proceed';
      btnAction = this.proceedWithToken;
    }

    return (
      <Modal
        className='oauth2-callback-waiting-modal'
        isOpen={this.props.isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>GET NEW ACCESS TOKEN</ModalHeader>
        <ModalContent>
          <div className='oauth2-callback-waiting-modal-wrapper'>
            <div className='oauth2-waiting-status'>
              {statusIcon}
            </div>
            <div className={this.getTitleClasses()}>
              {title}
            </div>
            <div className='oauth2-waiting-description'>
              {description}
              {

                // @todo: Uncomment this when the documentation for oauth2 using browser is ready
                // this.state.status === 'waiting' &&
                //   <div className='oauth2-callback-learn-more-link' onClick={() => {}}>
                //     Learn more about the auth callback
                //   </div>
              }
            </div>
            <div className='oauth2-waiting-action'>
              <Button
                className={`oauth2-waiting-action__${this.state.status}`}
                type={this.state.status === 'error' ? 'primary' : 'secondary'}
                onClick={btnAction}
              >
                {btnText}
              </Button>
            </div>
            {
              this.state.status === 'error' && (
                <div className='oauth2-callback-return-link' onClick={this.handleClose}>
                  Back to token details
                </div>
              )
}
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

OAuth2WaitingModal.defaultProps = {
  isOpen: false
};

OAuth2WaitingModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  handleTokenSelect: PropTypes.func.isRequired
};
