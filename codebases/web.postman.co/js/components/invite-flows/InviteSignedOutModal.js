import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent } from '../base/Modals';
import { Button } from '../base/Buttons';
import AuthHandlerService from '../../modules/services/AuthHandlerService';
import { getAllParams } from '../../../onboarding/src/common/UTMService';

export default class InviteSignedOutModal extends Component {
  constructor (props) {
    super(props);

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignIn () {
    this.props.onClose && this.props.onClose();
    AuthHandlerService.initiateLogin();
  }

  handleSignUp () {
    this.props.onClose && this.props.onClose();

    const utmParams = getAllParams({
      utm_content: 'invite_signed_out_modal',
      utm_term: 'sign_up'
    });

    AuthHandlerService.initiateLogin({ isSignup: true, queryParams: utmParams });
  }

  render () {
    return (
      <Modal
        className='invite-signed-out-modal'
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
      >
        <ModalHeader>
          Sign in to invite
        </ModalHeader>
        <ModalContent>
        <div className='disabled-operation-modal'>
          <div className='disabled-operation-modal__icon'>
            <div className='disabled-operation-modal__icon__icon' />
          </div>

          <div className='disabled-operation-modal__title'>
            Sign in to invite
          </div>

          <div className='disabled-operation-modal__subtitle'>
            You need to be signed in to be able to invite people to collaborate with you.
          </div>

          <div className='disabled-operation-modal__actions'>
            <Button
              type='primary'
              onClick={this.handleSignIn}
            >
              Sign in
            </Button>
            <Button
              type='primary'
              onClick={this.handleSignUp}
            >
              Create an account
            </Button>
          </div>
        </div>
        </ModalContent>
      </Modal>
    );
  }
}
