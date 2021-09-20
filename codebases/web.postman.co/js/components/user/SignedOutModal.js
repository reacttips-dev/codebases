import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent } from '../base/Modals';
import { Button } from '../base/Buttons';
import AuthHandlerService from '../../modules/services/AuthHandlerService';

export default class SignedOutModal extends Component {
  constructor (props) {
    super(props);

    this.state = { isOpen: false };

    this.handleClose = this.handleClose.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.setState({ isOpen: this.props.isOpen });
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ isOpen: nextProps.isOpen });
  }

  handleClose () {
    this.setState({ isOpen: false }, this.props.onRequestClose);
  }

  handleSignIn () {
    this.handleClose();
    AuthHandlerService.initiateLogin();
  }

  render () {
    return (
      <Modal
        className='signed-out-modal'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
      >
        <ModalHeader>
          {this.props.title}
        </ModalHeader>
        <ModalContent>
          <div className='signed-out-modal-container-wrapper'>
            <div className='signed-out-modal-login-empty-message-container'>
            {
              this.props.message ? (
                <div className='signed-out-modal-login-empty-message'>
                  { _.isFunction(this.props.message) ? this.props.message() : this.props.message }
                </div>
              ) : (
                <div className='signed-out-modal-login-empty-message'>
                  You must be <span className='signed-out-modal-login-link' onClick={this.handleSignIn}> signed in</span> to Postman to {this.props.action}.
                </div>
              )
            }
            </div>

            <Button
              type='primary'
              className='signout-out-signin-btn'
              onClick={this.handleSignIn}
            >
              Sign in to Postman
            </Button>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}
