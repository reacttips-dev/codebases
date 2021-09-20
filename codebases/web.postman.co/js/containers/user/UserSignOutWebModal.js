import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Button } from '../../components/base/Buttons';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import LoadingIndicator from '../../components/base/LoadingIndicator';
import { signOutOnWeb } from '../../modules/services/UserSignOutService';

const MODAL_HEADER = 'SIGN OUT OF POSTMAN',
  MODAL_SIGNOUT_MESSAGE = 'Are you sure you wish to sign out?',
  MODAL_CONFIRM_BUTTON = 'Sign Out',
  MODAL_CANCEL_BUTTON = 'Cancel';

@pureRender
export default class UserSignOutWebModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      isSigningOut: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showUserSignoutWebModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showUserSignoutWebModal', this.handleOpen);
  }

  handleOpen () {
    this.setState({
      isOpen: true
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      isSigningOut: false
    });
  }

  handleConfirm () {
    this.setState({ isSigningOut: true });

    return signOutOnWeb()
      .catch(() => {
        pm.toasts.error('Unable to sign out right now. Try again later.');

        this.setState({ isSigningOut: false });
      });
  }

  getCustomStyles () {
    return { marginTop: '35vh' };
  }

  render () {
    let disableSignout = this.state.isSigningOut;

    return (
      <Modal
        isOpen={this.state.isOpen}
        className='user-signout-modal'
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>{MODAL_HEADER}</ModalHeader>
        <ModalContent>
          <div className='user-signout-modal-message'>
            {MODAL_SIGNOUT_MESSAGE}
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            type='secondary'
            onClick={this.handleClose}
            disabled={disableSignout}
          >{MODAL_CANCEL_BUTTON}</Button>
          <Button
            type='primary'
            onClick={this.handleConfirm}
            disabled={disableSignout}
          >
            {this.state.isSigningOut ? <LoadingIndicator /> : MODAL_CONFIRM_BUTTON}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
